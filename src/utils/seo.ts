import { getImageUrl } from './image'

/** 默认商城站点根域名 */
export const DEFAULT_SHOP_BASE_URL = 'https://shop.beikevip.site'

/** 默认横版社交分享图（1200x630） */
export const DEFAULT_OG_IMAGE_URL = 'https://beikevip.site/assets/beikexiang_og_1200x630.png'

/** 商城首页「小学科学」垂直定位兜底标题 */
export const VERTICAL_HOME_TITLE = '备课箱商城｜小学科学课件_教学设计_逐字稿_新课标同步备课资源'

/** 内页标题品牌后缀 */
export const VERTICAL_SITE_SUFFIX = '备课箱'

/** 商城全局「小学科学」垂直定位兜底描述 */
export const VERTICAL_HOME_DESCRIPTION =
  '备课箱商城专注小学科学同步备课资料，覆盖教科版、苏教版、粤教版、人教版、大象版1-6年级可编辑PPT课件、教学设计、课堂逐字稿与同步练习，支持微信支付宝免注册自动发货。'

/** 商城全局「小学科学」垂直定位兜底关键词 */
export const VERTICAL_HOME_KEYWORDS =
  '小学科学课件,小学科学教案,科学逐字稿,教科版科学课件,苏教版科学课件,粤教版科学课件,人教版科学课件,大象版科学课件,2022新课标科学,备课箱商城'

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

/**
 * 商品详情智能结构化描述兜底（与 Go 后端 BuildStructuredProductDescription 保持一致）：
 * 当 seo_meta.description 为空、长度 <= 15 字符或与商品标题相同时，自动合成四件套完整描述
 */
export const buildStructuredProductDescription = (
  rawSeoDescription?: string | null,
  productTitle?: string | null,
  categoryName?: string | null,
): string => {
  const trimmedSeo = String(rawSeoDescription || '').trim()
  const trimmedTitle = String(productTitle || '').trim()
  if (trimmedSeo && Array.from(trimmedSeo).length > 15 && trimmedSeo !== trimmedTitle) {
    return trimmedSeo
  }
  const trimmedCat = String(categoryName || '').trim()
  if (trimmedCat) {
    return `${trimmedCat}《${trimmedTitle}》小学科学同步备课资源包，内含可编辑PPT课件、教学设计、课堂逐字稿与同步练习源文件，对齐2022版科学新课标，支持微信/支付宝免注册扫码购买、秒级自动发货。`
  }
  return `《${trimmedTitle}》小学科学同步备课资源包，内含可编辑PPT课件、教学设计、课堂逐字稿与同步练习源文件，对齐2022版科学新课标，支持微信/支付宝免注册扫码购买、秒级自动发货。`
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
