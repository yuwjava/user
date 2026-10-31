import { getImageUrl } from './image'

/** 默认商城站点根域名 */
export const DEFAULT_SHOP_BASE_URL = 'https://shop.beikevip.site'

/** 默认横版社交分享图（1200x630） */
export const DEFAULT_OG_IMAGE_URL = 'https://beikevip.site/assets/beikexiang_og_1200x630.png'

/** 商城首页「小学科学」垂直定位兜底标题 */
export const VERTICAL_HOME_TITLE = '备课箱商城｜小学科学课件_教学设计_逐字稿_新课标同步备课资源'

/** 内页标题品牌后缀 */
export const VERTICAL_SITE_SUFFIX = '备课箱'

// 以下文案与 dujiao-next html_shell_service.go 逐字一致；对外口径只写已上架的版本与真实交付物
// （人教版、大象版尚无商品；图片版课件不可编辑）

/** 商城全局「小学科学」垂直定位兜底描述 */
export const VERTICAL_HOME_DESCRIPTION =
  '备课箱商城专注小学科学同步备课资源：教科版、苏教版、粤教版单元课件（含PPT课件与教学设计）、知识手册与开学第一课起始课，扫码购买，自动发货。'

/** 商城全局「小学科学」垂直定位兜底关键词 */
export const VERTICAL_HOME_KEYWORDS =
  '小学科学课件,小学科学教案,科学逐字稿,教科版科学课件,苏教版科学课件,粤教版科学课件,2022新课标科学,备课箱商城'

/** 商品中心描述 */
export const VERTICAL_PRODUCTS_DESCRIPTION =
  '浏览备课箱小学科学同步备课资源：教科版、苏教版、粤教版单元课件（含PPT课件与教学设计）、知识手册与开学第一课起始课。'

/** 分类页描述：分类里也有“小工具”“PPT模板”这类非课件分类，只写对任何分类都成立的内容 */
export const buildCategoryDescription = (categoryName: string): string =>
  `备课箱商城「${categoryName}」分类：浏览该分类下全部在售的小学科学备课资源，扫码购买，自动发货。`

/**
 * 固定页面的完整 <title> 与描述，与 dujiao-next html_shell_service.go 中对应 build*Payload 逐字一致。
 * 前台必须显式传入，否则 usePageSeo 会退回后台站点设置里的首页描述，JS 渲染后覆盖服务端输出。
 */
export const STATIC_PAGE_SEO = {
  blog: {
    title: '小学科学备课教研专栏 - 备课箱',
    description: '备课箱小学科学教研专栏，分享2022版科学新课标教学设计思路、探究实验课堂组织技巧、公开课磨课指南与同步备课经验。',
  },
  notice: {
    title: '商城公告与资源更新通知 - 备课箱',
    description: '备课箱商城最新小学科学课件上架通知、教材版本同步更新动态与平台服务公告。',
  },
  about: {
    title: '关于备课箱商城 - 备课箱',
    description: '备课箱专注小学科学新课标同步教学资源研发，提供教科版、苏教版、粤教版课件、教学设计、逐字稿及免费互动数字实验室。',
  },
  terms: {
    title: '服务条款 - 备课箱',
    description: '备课箱商城数字备课资源购买、自动发货交付及售后服务条款说明。',
  },
  privacy: {
    title: '隐私政策 - 备课箱',
    description: '备课箱商城用户信息保护、订单数据安全与隐私政策说明。',
  },
} as const

/** 商品中心 H1 / 面包屑名称（商城同时有课件、知识手册与工具，不写“课件”“全版本”） */
export const PRODUCTS_CENTER_HEADING = '小学科学备课资源中心'

/** 商品中心完整 <title> */
export const PRODUCTS_CENTER_TITLE = `${PRODUCTS_CENTER_HEADING} - 备课箱`

/**
 * 分类页 H1 / 面包屑名称（与 dujiao-next category_seo_naming.go 的 categoryHeading 一致）：
 * 教材版本（以“版”结尾）→ 教科版小学科学课件；学科父分类（含“小学科学”）→ 小学科学备课资源；其他 → 分类名本身
 */
export const buildCategoryHeading = (categoryName: string): string => {
  const name = categoryName.trim()
  if (name.endsWith('版')) return `${name}小学科学课件`
  if (name.includes('小学科学')) return `${name}备课资源`
  return name
}

/** 分类页完整 <title>（与 dujiao-next categoryPageTitle 一致） */
export const buildCategoryTitle = (categoryName: string): string => {
  const name = categoryName.trim()
  if (name.endsWith('版')) return `${buildCategoryHeading(name)}｜按年级单元选课 - 备课箱`
  if (name.includes('小学科学')) return `${buildCategoryHeading(name)}｜按教材版本选课 - 备课箱`
  return `${name}｜备课箱商城`
}

/** 商品是否被后台标记为“不让搜索引擎收录” */
export const isProductSeoNoIndex = (product: { seo_meta?: Record<string, unknown> | null } | null | undefined): boolean => {
  const flag = product?.seo_meta?.noindex
  return flag === true || flag === 'true' || flag === '1' || flag === 1
}

/**
 * 分类列表页是否应 noindex：与服务端一致，分类下没有可收录商品（空分类，或只有 noindex 商品）时不让搜索引擎收录。
 * 只在加载完成、无搜索词、只有一页时判断，避免加载中或翻页时误判。
 */
export const isEmptyCategoryListing = (opts: {
  isCategoryRoute: boolean
  loading: boolean
  searchQuery: string
  totalPages: number
  products: Array<{ seo_meta?: Record<string, unknown> | null }>
}): boolean => {
  if (!opts.isCategoryRoute || opts.loading || opts.searchQuery.trim() || opts.totalPages > 1) return false
  return opts.products.every((p) => isProductSeoNoIndex(p))
}

/** 备课箱主站生态互链 */
export const BEIKE_ECOSYSTEM_LINKS = [
  {
    name: '备课箱官网',
    description: '小学科学新课标同步备课门户',
    url: 'https://beikevip.site/',
  },
  {
    name: '免费数字实验室',
    description: '小学科学互动探究虚拟实验大屏',
    url: 'https://beikevip.site/lab/',
  },
  {
    name: '教研组简介',
    description: '备课箱小学科学教研团队与研发标准',
    url: 'https://beikevip.site/about/',
  },
] as const

const trimSlashEnd = (value: string) => value.replace(/\/+$/, '')

/**
 * 解析商城绝对根域名：
 * 优先取后台配置的 brand.site_url，其次取非本地开发环境的当前域名，最终兜底 https://shop.beikevip.site
 */
export const resolveShopBaseUrl = (configuredSiteUrl?: string | null): string => {
  const fromConfig = trimSlashEnd(String(configuredSiteUrl || '').trim())
  if (fromConfig) {
    return fromConfig
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = trimSlashEnd(window.location.origin)
    if (origin && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
      return origin
    }
  }
  return DEFAULT_SHOP_BASE_URL
}

/**
 * 将相对图片路径或上传文件路径统一转换为带站点根域名的绝对 URL
 */
export const resolveAbsoluteImageUrl = (
  rawPath?: string | null,
  configuredSiteUrl?: string | null,
): string => {
  const trimmed = String(rawPath || '').trim()
  if (!trimmed) {
    return DEFAULT_OG_IMAGE_URL
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  const resolved = String(getImageUrl(trimmed) || trimmed).trim()
  if (!resolved) {
    return DEFAULT_OG_IMAGE_URL
  }
  if (/^https?:\/\//i.test(resolved)) {
    return resolved
  }
  const base = resolveShopBaseUrl(configuredSiteUrl)
  return resolved.startsWith('/') ? `${base}${resolved}` : `${base}/${resolved}`
}

/** 判断后台标题是否为空、仅“备课箱”3字、系统默认名或含遗留泛学科词 */
export const isGenericOrLegacyHomeTitle = (rawTitle?: string | null): boolean => {
  const trimmed = String(rawTitle || '').trim()
  if (!trimmed || trimmed === '备课箱' || /^dujiao-next$/i.test(trimmed)) {
    return true
  }
  return containsLegacyBroadSubjectCopy(trimmed)
}

/** 判断文案是否残留“小初高”或“全学科”等旧泛化定位表述 */
export const containsLegacyBroadSubjectCopy = (text?: string | null): boolean => {
  const normalized = String(text || '')
  return normalized.includes('小初高') || normalized.includes('全学科')
}

/** 提取富文本 HTML 的纯文本内容，用于摘要去重与截断展示 */
export const extractPlainTextFromHtml = (rawHtml?: string | null): string => {
  const input = String(rawHtml || '').trim()
  if (!input) return ''
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** 判断文章 summary 是否与正文提取纯文本后的开头重复 */
export const isSummaryDuplicatedInContent = (
  summary?: string | null,
  rawHtmlContent?: string | null,
): boolean => {
  const normSummary = String(summary || '').replace(/\s+/g, '').trim()
  if (!normSummary) return false
  const plainContent = extractPlainTextFromHtml(rawHtmlContent)
  const normContent = plainContent.replace(/\s+/g, '').trim()
  if (!normContent) return false
  return normContent.startsWith(normSummary)
}

/**
 * 过滤未配置国内场景时残留的海外默认占位联系方式（如 dujiaoka / 1234567890），
 * 仅在管理员显式填写有效自定义链接时才展示
 */
export const isConfiguredOverseasContactUrl = (rawUrl?: unknown): rawUrl is string => {
  if (typeof rawUrl !== 'string') return false
  const trimmed = rawUrl.trim()
  if (!trimmed) return false
  const lower = trimmed.toLowerCase()
  if (
    lower.includes('t.me/dujiaoka') ||
    lower.includes('wa.me/1234567890') ||
    lower === 'https://t.me/' ||
    lower === 'https://wa.me/'
  ) {
    return false
  }
  return /^https?:\/\//i.test(trimmed)
}

export interface BreadcrumbSchemaItem {
  name: string
  url: string
}

/** 首屏加载时的路径：服务端注入的 JSON-LD 只对应这个路径（站内跳转后不再适用） */
const SSR_INITIAL_PATH = typeof window !== 'undefined' ? window.location.pathname : ''

/**
 * 服务端（dujiao-next HTML 壳，带 data-ssr 标记）是否已在当前页输出了指定 @type 的 JSON-LD。
 * 前台据此跳过同类型的重复注入；站内跳转到其他路径后返回 false，由前台照常注入。
 */
export const hasServerJsonLd = (schemaType: string): boolean => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false
  if (window.location.pathname !== SSR_INITIAL_PATH) return false
  const scripts = document.querySelectorAll('script[type="application/ld+json"][data-ssr]')
  for (const el of Array.from(scripts)) {
    try {
      const data = JSON.parse(el.textContent || '')
      if (data && data['@type'] === schemaType) return true
    } catch {
      // 忽略无法解析的结构化数据
    }
  }
  return false
}

/** 构造标准 Schema.org BreadcrumbList JSON-LD */
export const buildBreadcrumbJsonLd = (items: BreadcrumbSchemaItem[]): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url,
  })),
})
