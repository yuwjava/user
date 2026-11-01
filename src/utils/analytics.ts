/**
 * 百度统计（yuwjava/beikexiang#3）。
 * hm.js 由后端页面 HTML 壳按 config.yml 的 web.baidu_tongji_id 注入；没配置时 window._hmt 不存在，这里全部静默跳过。
 * 首屏 PV 由 hm.js 加载时自动上报，路由切换才用 _trackPageview 补报（统计后台不要再开「单页应用自动跟踪」，否则重复）。
 */

type HmtQueue = { push: (command: unknown[]) => void }

declare global {
    interface Window {
        _hmt?: HmtQueue
    }
}

/** 转化漏斗的三个事件，统计后台按「转化 / 动作名」配置转化目标 */
export type ConversionAction = '加购' | '下单' | '支付成功'

const EVENT_CATEGORY = '转化'
const PAID_REPORTED_KEY = 'bk_tongji_paid_orders'
const PAID_REPORTED_LIMIT = 50

function hmt(): HmtQueue | null {
    if (typeof window === 'undefined') return null
    const queue = window._hmt
    return queue && typeof queue.push === 'function' ? queue : null
}

export function trackPageview(path: string) {
    hmt()?.push(['_trackPageview', path])
}

export function trackConversion(action: ConversionAction, label = '') {
    hmt()?.push(['_trackEvent', EVENT_CATEGORY, action, label])
}

/**
 * 支付成功每笔订单只报一次：重新打开已支付订单的支付页同样会跳转到订单详情，不能再算一次转化。
 */
export function trackPaidOnce(orderNo: string) {
    const no = String(orderNo || '').trim()
    if (!no || !hmt()) return
    let reported: string[] = []
    try {
        const parsed = JSON.parse(localStorage.getItem(PAID_REPORTED_KEY) || '[]')
        if (Array.isArray(parsed)) reported = parsed.map(String)
    } catch {
        reported = []
    }
    if (reported.includes(no)) return
    trackConversion('支付成功')
    try {
        localStorage.setItem(PAID_REPORTED_KEY, JSON.stringify([...reported, no].slice(-PAID_REPORTED_LIMIT)))
    } catch {
        // 存不了也不影响下单，最多重复计一次
    }
}
