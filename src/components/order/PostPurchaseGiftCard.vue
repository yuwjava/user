<template>
  <section
    v-if="visible && wechatQRCodeUrl"
    data-post-purchase-gift-card
    class="theme-panel rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 dark:from-emerald-950/30 dark:via-zinc-900/80 dark:to-zinc-900 p-5 sm:p-6"
  >
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <div class="shrink-0 rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-white/10">
        <img
          :src="wechatQRCodeUrl"
          :alt="t('footer.officialAccount')"
          class="h-32 w-32 sm:h-28 sm:w-28 rounded-lg object-contain"
        />
      </div>

      <div class="min-w-0 flex-1 space-y-2.5">
        <span
          class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-900/40 dark:text-emerald-200"
        >
          {{ t('orderDetail.giftCardBadge') }}
        </span>

        <h3 class="text-base sm:text-lg font-bold leading-snug theme-text-primary">
          {{ t('orderDetail.giftCardTitle') }}
        </h3>

        <p class="text-xs sm:text-sm leading-relaxed theme-text-secondary">
          {{ t('orderDetail.giftCardDesc') }}
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            data-copy-gift-keyword
            class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors shadow-sm"
            :class="copied
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'"
            @click="handleCopyKeyword"
          >
            <svg v-if="!copied" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ copied ? t('orderDetail.giftCardCopied') : t('orderDetail.giftCardCopyBtn') }}</span>
          </button>

          <a
            href="https://beikevip.site/lab/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700/50 dark:bg-zinc-800/80 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
          >
            <span>{{ t('orderDetail.giftCardLabLink') }}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import { copyText } from '../../utils/clipboard'
import { getImageUrl } from '../../utils/image'

const props = withDefaults(defineProps<{
  visible?: boolean
}>(), {
  visible: true,
})

const { t } = useI18n()
const appStore = useAppStore()
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const wechatQRCodeUrl = computed(() => {
  const qrcode = String(appStore.config?.contact?.wechat_qrcode || '').trim()
  return qrcode ? getImageUrl(qrcode) : ''
})

const handleCopyKeyword = async () => {
  try {
    await copyText(t('orderDetail.giftCardKeyword'))
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch {
    copied.value = false
  }
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>
