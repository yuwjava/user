<template>
  <div
    v-if="wechatQRCodeUrl"
    data-prepurchase-lead-card
    class="rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-50/50 dark:border-emerald-700/50 dark:bg-emerald-950/20 p-3.5 sm:p-4"
  >
    <button
      type="button"
      data-toggle-lead-card
      class="w-full flex items-center justify-between gap-3 text-left min-h-[40px] cursor-pointer"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <span class="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-200 leading-snug">
        {{ t('productDetail.leadCardTrigger') }}
      </span>
      <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
        <span>{{ expanded ? t('productDetail.leadCardCollapse') : t('productDetail.leadCardExpand') }}</span>
        <svg
          class="h-3.5 w-3.5 transition-transform duration-200"
          :class="expanded ? 'rotate-180' : ''"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>

    <div
      v-if="expanded"
      data-lead-card-body
      class="mt-3 pt-3 border-t border-emerald-200/80 dark:border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <div class="shrink-0 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xs dark:border-white/10">
        <img
          :src="wechatQRCodeUrl"
          :alt="t('footer.officialAccount')"
          class="h-28 w-28 rounded-lg object-contain"
        />
      </div>

      <div class="min-w-0 flex-1 space-y-2">
        <p class="text-xs sm:text-sm font-bold theme-text-primary leading-snug">
          {{ t('productDetail.leadCardTitle') }}
        </p>
        <p class="text-xs leading-relaxed theme-text-secondary">
          {{ t('productDetail.leadCardDesc') }}
        </p>

        <div class="pt-0.5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            data-copy-prepurchase-keyword
            class="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
            :class="copied
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'"
            @click="handleCopyKeyword"
          >
            <span>{{ copied ? t('orderDetail.giftCardCopied') : t('orderDetail.giftCardCopyBtn') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import { copyText } from '../../utils/clipboard'
import { getImageUrl } from '../../utils/image'

const { t } = useI18n()
const appStore = useAppStore()
const expanded = ref(false)
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
