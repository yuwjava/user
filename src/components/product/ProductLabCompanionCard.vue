<template>
  <section
    v-if="companionInfo || isScienceCategory"
    data-lab-companion-card
    class="mb-6 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/35 dark:via-zinc-900/90 dark:to-zinc-900 p-4 sm:p-5"
  >
    <template v-if="companionInfo">
      <div class="flex flex-wrap items-center gap-2 mb-2">
        <span class="inline-flex items-center rounded-full border border-emerald-300/80 bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-900/50 dark:text-emerald-200">
          {{ t('productDetail.labCardBadge') }}
        </span>
        <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {{ companionInfo.unitLabel }}
        </span>
      </div>

      <h3 class="text-sm sm:text-base font-bold theme-text-primary leading-snug">
        {{ t('productDetail.labCardTitle') }}
      </h3>
      <p class="mt-1 text-xs sm:text-sm theme-text-secondary leading-relaxed">
        {{ t('productDetail.labCardDesc') }}
      </p>

      <div class="mt-3 flex flex-wrap gap-2">
        <a
          v-for="lesson in companionInfo.lessons"
          :key="lesson.id"
          :href="lesson.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-emerald-600/35 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-700/60 dark:bg-zinc-800/90 dark:text-emerald-200 dark:hover:bg-emerald-700"
        >
          <span>🔬 {{ lesson.title }}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-sm font-bold theme-text-primary">
            {{ t('productDetail.labGeneralTitle') }}
          </div>
          <p class="mt-0.5 text-xs theme-text-secondary">
            {{ t('productDetail.labGeneralDesc') }}
          </p>
        </div>
        <a
          href="https://beikevip.site/lab/"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-emerald-600/35 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white dark:border-emerald-700/60 dark:bg-zinc-800 dark:text-emerald-300 dark:hover:bg-emerald-700"
        >
          <span>{{ t('productDetail.labGeneralCta') }}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PublicCategory } from '../../utils/category'
import { getCompanionLabInfo, isScienceCoursewareCategory } from '../../utils/courseware'

const props = withDefaults(defineProps<{
  slug?: string
  category?: PublicCategory | null
  categoryName?: string
}>(), {
  slug: '',
  category: null,
  categoryName: '',
})

const { t } = useI18n()

const companionInfo = computed(() => getCompanionLabInfo(props.slug))
const isScienceCategory = computed(() =>
  isScienceCoursewareCategory(props.category, props.categoryName),
)
</script>
