import type { PublicCategory } from './category'

export type GradeFilter = 'all' | 1 | 2 | 3 | 4 | 5 | 6
export type TermFilter = 'all' | 'up' | 'down' | 'special'

export interface CompanionLabLesson {
  id: string
  title: string
  url: string
}

export interface CompanionLabInfo {
  unitLabel: string
  lessons: CompanionLabLesson[]
}

export interface BundleSavingsInfo {
  lessonCount: number
  sumPrice: number
  savedAmount: number
}

const LAB_BASE_URL = 'https://beikevip.site'

const CN_GRADE_MAP: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
}

export const GRADE_OPTIONS: { value: GradeFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'products.filterGradeAll' },
  { value: 1, labelKey: 'products.filterGrade1' },
  { value: 2, labelKey: 'products.filterGrade2' },
  { value: 3, labelKey: 'products.filterGrade3' },
  { value: 4, labelKey: 'products.filterGrade4' },
  { value: 5, labelKey: 'products.filterGrade5' },
  { value: 6, labelKey: 'products.filterGrade6' },
]

export const TERM_OPTIONS: { value: TermFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'products.filterTermAll' },
  { value: 'up', labelKey: 'products.filterTermUp' },
  { value: 'down', labelKey: 'products.filterTermDown' },
  { value: 'special', labelKey: 'products.filterTermSpecial' },
]

const SCIENCE_CATEGORY_SLUGS = new Set([
  'xiaoxuekexue',
  'jiaokeban',
  'sujiaoban',
  'yjb',
  'dxb',
  'rjb',
  'fzsygj',
])

const COMPANION_LAB_MAP: Record<string, CompanionLabInfo> = {
  jkbxkwsdsdyydhl: {
    unitLabel: '教科版五上《运动和力》',
    lessons: [
      { id: 'gravity-car', title: '用重力驱动小车', url: `${LAB_BASE_URL}/lab/jk/5up/gravity/car/` },
      { id: 'elastic-car', title: '用弹力驱动小车', url: `${LAB_BASE_URL}/lab/jk/5up/elastic/car/` },
      { id: 'measure-force', title: '测量力的大小', url: `${LAB_BASE_URL}/lab/jk/5up/force/measure/` },
      { id: 'friction-comparison', title: '摩擦力的比较', url: `${LAB_BASE_URL}/lab/jk/5up/friction/compare/` },
    ],
  },
  jkbxksskq: {
    unitLabel: '教科版四上《空气》',
    lessons: [
      { id: 'air-compression', title: '空气占据的空间会改变吗', url: `${LAB_BASE_URL}/lab/jk/4up/air/compression/` },
    ],
  },
  jkbxkssdedys: {
    unitLabel: '教科版三上《水》',
    lessons: [
      { id: 'water-dissolve', title: '水能溶解多少物质', url: `${LAB_BASE_URL}/lab/jk/3up/water/dissolve/` },
    ],
  },
  jkbxkysdedywmzi: {
    unitLabel: '教科版一上《我们自己》',
    lessons: [
      { id: 'smell-tells-us', title: '气味告诉我们', url: `${LAB_BASE_URL}/lab/jk/1up/smell/tells-us/` },
    ],
  },
}

/** 从商品标题中提取适用年级列表（支持 "五上" / "五年级" / "3-6年级" 等写法）。 */
export function extractProductGrades(title: string): number[] {
  const grades = new Set<number>()
  const text = String(title || '')

  const rangeMatch = text.match(/([1-6一二三四五六])\s*[-~—–～]\s*([1-6一二三四五六])\s*年级/g)
  if (rangeMatch) {
    for (const seg of rangeMatch) {
      const m = seg.match(/([1-6一二三四五六])\s*[-~—–～]\s*([1-6一二三四五六])/)
      if (!m?.[1] || !m?.[2]) continue
      const start = CN_GRADE_MAP[m[1]]
      const end = CN_GRADE_MAP[m[2]]
      if (start && end && start <= end) {
        for (let g = start; g <= end; g += 1) grades.add(g)
      }
    }
  }

  for (const m of text.matchAll(/(一|二|三|四|五|六)(?=年级|上|下)/g)) {
    const key = m[1]
    const g = key ? CN_GRADE_MAP[key] : undefined
    if (g) grades.add(g)
  }

  return Array.from(grades).sort((a, b) => a - b)
}

/** 从商品标题中提取册别标签，避免「地球上」等课文名误匹配上册。 */
export function extractProductTerms(title: string): ('up' | 'down' | 'special')[] {
  const terms: ('up' | 'down' | 'special')[] = []
  const text = String(title || '')

  if (/(?:[一二三四五六1-6]|年级)上|上册/.test(text)) {
    terms.push('up')
  }
  if (/(?:[一二三四五六1-6]|年级)下|下册/.test(text)) {
    terms.push('down')
  }
  if (/知识手册|复习|期末|开学第一课|模板|工具|下载器|仿真/.test(text)) {
    terms.push('special')
  }

  return terms
}

export function resolveLocalizedTitle(titleField: unknown, locale = 'zh-CN'): string {
  if (!titleField) return ''
  if (typeof titleField === 'string') return titleField
  if (typeof titleField === 'object') {
    const map = titleField as Record<string, string>
    return map[locale] || map['zh-CN'] || map['zh-TW'] || map['en-US'] || Object.values(map).find(Boolean) || ''
  }
  return ''
}

export function matchesCoursewareFilter(
  product: { title?: unknown },
  locale: string,
  grade: GradeFilter,
  term: TermFilter,
): boolean {
  const title = resolveLocalizedTitle(product?.title, locale)
  if (grade !== 'all') {
    const grades = extractProductGrades(title)
    if (!grades.includes(grade)) return false
  }
  if (term !== 'all') {
    const terms = extractProductTerms(title)
    if (!terms.includes(term)) return false
  }
  return true
}

/** 识别「整套 / 全册 / 打包 / 合集」规格（排除单纯的单元复习单件）。 */
export function isBundleSkuLabel(label: string): boolean {
  const text = String(label || '').trim()
  if (!text || /单元复习/.test(text)) return false
  return /整套|全套|打包|全册|合集/.test(text)
}

/** 识别「第X课时 / 课时X」单课规格。 */
export function isLessonSkuLabel(label: string): boolean {
  const text = String(label || '').trim()
  if (!text || isBundleSkuLabel(text)) return false
  return /第?\s*\d+\s*课时|课时\s*\d+/.test(text)
}

/** 将可购买的「整套/全册」SKU 排在规格列表首位，其余保持相对顺序。 */
export function sortSkusWithBundleFirst<T>(
  skus: T[],
  getLabel: (sku: T) => string,
  isPurchasable: (sku: T) => boolean = () => true,
): T[] {
  if (skus.length <= 1) return skus
  const topBundles: T[] = []
  const others: T[] = []
  for (const sku of skus) {
    if (isBundleSkuLabel(getLabel(sku)) && isPurchasable(sku)) {
      topBundles.push(sku)
    } else {
      others.push(sku)
    }
  }
  return [...topBundles, ...others]
}

/** 计算整套 SKU 相比按单课累计购买可省金额；省不足 1 元或缺少单课对照时返回 null。 */
export function computeBundleSavings<T>(
  bundleSku: T,
  allSkus: T[],
  getLabel: (sku: T) => string,
  getUnitPrice: (sku: T) => number,
): BundleSavingsInfo | null {
  const label = getLabel(bundleSku)
  if (!isBundleSkuLabel(label)) return null

  const bundlePrice = getUnitPrice(bundleSku)
  if (!Number.isFinite(bundlePrice) || bundlePrice <= 0) return null

  const lessonSkus = allSkus.filter((sku) => sku !== bundleSku && isLessonSkuLabel(getLabel(sku)))
  if (lessonSkus.length < 2) return null

  const lessonPrices = lessonSkus
    .map((sku) => getUnitPrice(sku))
    .filter((price) => Number.isFinite(price) && price > 0)
  if (lessonPrices.length < 2) return null

  const parsedCountMatch = label.match(/(\d+)\s*课时/)
  const parsedCount = parsedCountMatch?.[1] ? Number.parseInt(parsedCountMatch[1], 10) : 0
  const lessonCount = parsedCount >= 2 ? parsedCount : lessonPrices.length

  let sumPrice = 0
  if (lessonCount === lessonPrices.length) {
    sumPrice = lessonPrices.reduce((acc, p) => acc + p, 0)
  } else {
    const minUnitPrice = Math.min(...lessonPrices)
    sumPrice = minUnitPrice * lessonCount
  }

  const savedAmount = Math.round((sumPrice - bundlePrice) * 10) / 10
  if (!Number.isFinite(savedAmount) || savedAmount < 1) return null

  return {
    lessonCount,
    sumPrice: Math.round(sumPrice * 10) / 10,
    savedAmount,
  }
}

export function formatSavedAmount(amount: number): string {
  const rounded = Math.round(amount * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export function getCompanionLabInfo(slug: string | undefined): CompanionLabInfo | null {
  if (!slug) return null
  return COMPANION_LAB_MAP[slug.trim()] ?? null
}

export function isScienceCoursewareCategory(
  category: PublicCategory | null | undefined,
  categoryTitleFallback = '',
): boolean {
  const slug = String(category?.slug || '').trim().toLowerCase()
  if (slug && SCIENCE_CATEGORY_SLUGS.has(slug)) return true
  if (/(教科|苏教|粤教|大象|人教|小学科学|实验)/.test(categoryTitleFallback)) return true
  return false
}
