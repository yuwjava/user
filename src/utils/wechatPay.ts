export interface WechatJSAPIParams {
  appId: string
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
}

type WeixinJSBridgeCallback = (res: { err_msg?: string }) => void

declare global {
  interface Window {
    WeixinJSBridge?: {
      invoke: (name: 'getBrandWCPayRequest', params: WechatJSAPIParams, callback: WeixinJSBridgeCallback) => void
    }
  }
}

const WECHAT_OPENID_STORAGE_KEY = 'wechat_openid'

export const normalizeWechatOpenID = (value: unknown) => String(value || '').trim()

export const readWechatOpenIDFromQuery = (query: Record<string, unknown>) => {
  const raw = query.openid
  const value = Array.isArray(raw) ? raw[0] : raw
  return normalizeWechatOpenID(value)
}

export const saveWechatOpenID = (openid: string) => {
  const normalized = normalizeWechatOpenID(openid)
  if (!normalized) return
  try {
    localStorage.setItem(WECHAT_OPENID_STORAGE_KEY, normalized)
  } catch {}
}

export const getStoredWechatOpenID = () => {
  try {
    return normalizeWechatOpenID(localStorage.getItem(WECHAT_OPENID_STORAGE_KEY))
  } catch {
    return ''
  }
}

export const resolveWechatOpenID = (query?: Record<string, unknown>) => {
  const fromQuery = query ? readWechatOpenIDFromQuery(query) : ''
  if (fromQuery) {
    saveWechatOpenID(fromQuery)
    return fromQuery
  }
  return getStoredWechatOpenID()
}

export const isWechatJSAPIReady = () => typeof window !== 'undefined' && Boolean(window.WeixinJSBridge)

export const invokeWechatJSAPIPay = (params: WechatJSAPIParams) => new Promise<void>((resolve, reject) => {
  const invoke = () => window.WeixinJSBridge?.invoke('getBrandWCPayRequest', params, (res) => {
    const message = String(res?.err_msg || '').toLowerCase()
    if (message.includes(':ok')) {
      resolve()
      return
    }
    reject(new Error(res?.err_msg || 'WeChat payment was not completed'))
  })

  if (window.WeixinJSBridge) {
    invoke()
    return
  }

  const timer = window.setTimeout(() => {
    document.removeEventListener('WeixinJSBridgeReady', handleReady)
    reject(new Error('WeixinJSBridge is not ready'))
  }, 5000)
  const handleReady = () => {
    window.clearTimeout(timer)
    invoke()
  }
  document.addEventListener('WeixinJSBridgeReady', handleReady, { once: true })
})
