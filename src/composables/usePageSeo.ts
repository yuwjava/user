import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useAppStore } from '../stores/app'
import {
  DEFAULT_OG_IMAGE_URL,
  VERTICAL_HOME_DESCRIPTION,
  VERTICAL_HOME_TITLE,
  VERTICAL_SITE_SUFFIX,
  containsLegacyBroadSubjectCopy,
  hasServerJsonLd,
  isGenericOrLegacyHomeTitle,
  resolveAbsoluteImageUrl,
  resolveShopBaseUrl,
} from '../utils/seo'

export interface PageSeoOptions {
  /** 页面专属标题；缺省时采用商城首页小学科学垂直定位标题 */
  title?: () => string | undefined | null
  /** 页面描述；缺省时回落到站点小学科学全局描述 */
  description?: () => string | undefined | null
  /** 分享图：可填绝对 URL、相对路径或上传图路径（自动转绝对 URL，缺省兜底横版分享图） */
  image?: () => string | undefined | null
  /** 规范化路径（如 /products/foo），缺省时取当前 location.pathname */
  canonicalPath?: () => string | undefined | null
  /** og:type，默认 website */
  type?: () => string | undefined | null
  /** 标识页面不该被索引（私密页/动态查询页） */
  noindex?: () => boolean
  /** 页面级结构化数据 Schema.org JSON-LD 列表 */
  jsonLd?: () => Array<Record<string, unknown>>
}

export function usePageSeo(options: PageSeoOptions = {}) {
  const appStore = useAppStore()

  const baseUrl = computed(() => resolveShopBaseUrl(appStore.config?.brand?.site_url))

  const configuredHomeTitle = computed(() => {
    const lang = appStore.locale
    const seo = appStore.config?.seo
    const localized = seo?.title?.[lang]
    if (localized && String(localized).trim()) return String(localized).trim()
    return String(appStore.config?.brand?.site_name || '').trim()
  })

  const homeTitle = computed(() => {
    if (isGenericOrLegacyHomeTitle(configuredHomeTitle.value)) {
      return VERTICAL_HOME_TITLE
    }
    return configuredHomeTitle.value
  })

  const siteBrandName = computed(() => {
    const rawName = String(appStore.config?.brand?.site_name || '').trim()
    if (!rawName || /^dujiao-next$/i.test(rawName) || containsLegacyBroadSubjectCopy(rawName)) {
      return VERTICAL_SITE_SUFFIX
    }
    return rawName
  })

  const siteDescription = computed(() => {
    const lang = appStore.locale
    const seo = appStore.config?.seo
    const localized = seo?.description?.[lang] ? String(seo.description[lang]).trim() : ''
    if (!localized || containsLegacyBroadSubjectCopy(localized)) {
      return VERTICAL_HOME_DESCRIPTION
    }
    return localized
  })

  const configuredOgImage = computed(() => {
    const seo = appStore.config?.seo as { og_image?: string; default_og_image?: string } | undefined
    const candidate = seo?.og_image || seo?.default_og_image || ''
    return candidate ? String(candidate).trim() : ''
  })

  const pageTitle = computed(() => {
    const raw = options.title?.()
    return raw ? String(raw).trim() : ''
  })

  const fullTitle = computed(() => {
    if (!pageTitle.value) {
      return homeTitle.value
    }
    if (pageTitle.value.includes('备课箱') || pageTitle.value === siteBrandName.value) {
      return pageTitle.value
    }
    return `${pageTitle.value} - ${siteBrandName.value}`
  })

  const fullDescription = computed(() => {
    const pageDesc = options.description?.()
    if (pageDesc && String(pageDesc).trim()) return String(pageDesc).trim()
    return siteDescription.value
  })

  const fullCanonical = computed(() => {
    const explicit = options.canonicalPath?.()
    let path = explicit && String(explicit).trim() ? String(explicit).trim() : ''
    if (!path && typeof window !== 'undefined') path = window.location.pathname
    if (!path) path = '/'
    if (!path.startsWith('/')) path = '/' + path
    return `${baseUrl.value}${path}`
  })

  const fullImage = computed(() => {
    const raw = options.image?.()
    if (raw && String(raw).trim()) {
      return resolveAbsoluteImageUrl(String(raw), appStore.config?.brand?.site_url)
    }
    if (configuredOgImage.value) {
      return resolveAbsoluteImageUrl(configuredOgImage.value, appStore.config?.brand?.site_url)
    }
    return DEFAULT_OG_IMAGE_URL
  })

  useHead({
    title: () => fullTitle.value,
    link: () => {
      if (options.noindex?.() || !fullCanonical.value) return []
      return [{ key: 'canonical', rel: 'canonical', href: fullCanonical.value }]
    },
    meta: () => {
      const tags: Array<{ name?: string; property?: string; content: string }> = []

      if (options.noindex?.()) {
        tags.push({ name: 'robots', content: 'noindex, nofollow' })
      }

      if (fullDescription.value) {
        tags.push({ name: 'description', content: fullDescription.value })
      }

      const ogType = (options.type?.() && String(options.type()).trim()) || 'website'
      tags.push({ property: 'og:type', content: ogType })
      if (fullTitle.value) tags.push({ property: 'og:title', content: fullTitle.value })
      if (fullDescription.value) tags.push({ property: 'og:description', content: fullDescription.value })
      if (!options.noindex?.() && fullCanonical.value) {
        tags.push({ property: 'og:url', content: fullCanonical.value })
      }
      if (fullImage.value) tags.push({ property: 'og:image', content: fullImage.value })
      tags.push({ property: 'og:site_name', content: '备课箱商城' })

      tags.push({ name: 'twitter:card', content: 'summary_large_image' })
      if (fullTitle.value) tags.push({ name: 'twitter:title', content: fullTitle.value })
      if (fullDescription.value) tags.push({ name: 'twitter:description', content: fullDescription.value })
      if (fullImage.value) tags.push({ name: 'twitter:image', content: fullImage.value })

      return tags
    },
    script: () => {
      const items = options.jsonLd?.() || []
      return items
        .filter((item) => item && typeof item === 'object')
        // 服务端已输出同类型 JSON-LD 时跳过，避免重复
        .filter((item) => !hasServerJsonLd(String(item['@type'] ?? '')))
        .map((item, idx) => ({
          key: `page-jsonld-${idx}`,
          type: 'application/ld+json',
          innerHTML: JSON.stringify(item),
        }))
    },
  })
}
