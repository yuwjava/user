<template>
  <section
    class="mb-6 rounded-2xl border theme-panel p-3.5 sm:p-4 space-y-2.5"
    data-courseware-filter-bar
    :aria-label="t('products.filterBarAria')"
  >
    <!-- 年级筛选行 -->
    <div class="flex items-start sm:items-center gap-2 sm:gap-3">
      <span class="shrink-0 pt-1.5 sm:pt-0 text-xs font-bold theme-text-muted min-w-[3.25rem]">
        {{ t('products.filterGradeLabel') }}
      </span>
      <div class="flex flex-wrap items-center gap-1.5 flex-1">
        <button
          v-for="opt in GRADE_OPTIONS"
          :key="String(opt.value)"
          type="button"
          :data-grade-filter="String(opt.value)"
          class="inline-flex min-h-[36px] items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer"
          :class="selectedGrade === opt.value
            ? 'theme-btn-primary border-transparent shadow-sm'
            : 'theme-btn-secondary hover:-translate-y-0.5'"
          :aria-pressed="selectedGrade === opt.value"
          @click="$emit('selectGrade', opt.value)"
        >
          {{ t(opt.labelKey) }}
        </button>
      </div>
    </div>

    <!-- 册别筛选行 + 结果统计 -->
    <div class="flex flex-wrap items-center justify-between gap-2 pt-0.5">
      <div class="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <span class="shrink-0 pt-1.5 sm:pt-0 text-xs font-bold theme-text-muted min-w-[3.25rem]">
          {{ t('products.filterTermLabel') }}
        </span>
        <div class="flex flex-wrap items-center gap-1.5 flex-1">
          <button
            v-for="opt in TERM_OPTIONS"
            :key="opt.value"
            type="button"
            :data-term-filter="opt.value"
            class="inline-flex min-h-[36px] items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer"
            :class="selectedTerm === opt.value
              ? 'theme-btn-primary border-transparent shadow-sm'
              : 'theme-btn-secondary hover:-translate-y-0.5'"
            :aria-pressed="selectedTerm === opt.value"
            @click="$emit('selectTerm', opt.value)"
          >
            {{ t(opt.labelKey) }}
          </button>
        </div>
      </div>

      <div v-if="hasActiveFilter" class="flex items-center gap-2.5 ml-auto shrink-0">
        <span class="text-xs font-medium theme-text-muted" data-filter-result-count>
          {{ t('products.filterResultCount', { count: resultCount }) }}
        </span>
        <button
          type="button"
          data-reset-courseware-filter
          class="inline-flex min-h-[34px] items-center rounded-full border border-emerald-600/30 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 cursor-pointer"
          @click="$emit('reset')"
        >
          {{ t('products.resetCoursewareFilters') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GRADE_OPTIONS, TERM_OPTIONS, type GradeFilter, type TermFilter } from '../utils/courseware'

const props = withDefaults(defineProps<{
  selectedGrade: GradeFilter
  selectedTerm: TermFilter
  resultCount?: number
}>(), {
  resultCount: 0,
})

defineEmits<{
  (e: 'selectGrade', grade: GradeFilter): void
  (e: 'selectTerm', term: TermFilter): void
  (e: 'reset'): void
}>()

const { t } = useI18n()

const hasActiveFilter = computed(() => props.selectedGrade !== 'all' || props.selectedTerm !== 'all')
</script>
