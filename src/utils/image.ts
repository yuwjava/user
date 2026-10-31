/**
 * 获取完整的图片 URL
 * 如果传入的是相对路径（如 /uploads/xxx.png），则拼接 API 基础 URL
 * 如果传入的是完整 URL（如 http://...），则直接返回
 */
export function getImageUrl(path: string | undefined | null): string {
    if (!path) return ''

    // 如果已经是完整 URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    // 获取 API 基础 URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

    // 确保路径以 / 开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    return `${apiBaseUrl}${normalizedPath}`
}

/**
 * 上传图额外派生的 WebP 宽度档（文件名 <原图>.w{宽}.webp），
 * 与 dujiao-next internal/service/webp_derivatives.go 的 responsiveWebPWidths 一致。
 * 档位文件缺失时 nginx 回退到原图，不会裂图。
 */
export const RESPONSIVE_IMAGE_WIDTHS = [480, 960, 1440] as const

/**
 * 为 /uploads/ 下的 png/jpg 上传图生成 srcset；其他图片（svg、外链、已是 webp 等）返回空串，按原 src 加载
 */
export function getResponsiveSrcset(url: string | undefined | null): string {
    if (!url || !/\/uploads\/[^?#]+\.(?:png|jpe?g)$/i.test(url)) return ''
    return RESPONSIVE_IMAGE_WIDTHS.map((w) => `${url}.w${w}.webp ${w}w`).join(', ')
}

/** 商品列表卡片的 sizes：移动端 2 列，平板 3 列，桌面 4 列（旁边还有分类侧栏） */
export const PRODUCT_CARD_IMAGE_SIZES = '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw'

/**
 * 从 images 数组中获取第一张图片的完整 URL
 */
export function getFirstImageUrl(images: any): string {
    if (!images) return ''

    let imageUrl = ''

    if (Array.isArray(images)) {
        imageUrl = images[0] || ''
    } else if (images.images && Array.isArray(images.images)) {
        imageUrl = images.images[0] || ''
    }

    return getImageUrl(imageUrl)
}
