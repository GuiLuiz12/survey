<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  categories: string[]
  scores: number[]
  companyName: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const categoryLabels: Record<string, string> = {
  PO: 'Prepare the Organization',
  PS: 'Protect the Software',
  PW: 'Produce Well-Secured Software',
  RV: 'Respond to Vulnerabilities',
}

const chartOptions = computed(() => ({
  chart: {
    type: 'radar' as const,
    toolbar: { show: false },
    dropShadow: {
      enabled: true,
      blur: 4,
      left: 1,
      top: 1,
      opacity: 0.1,
    },
  },
  xaxis: {
    categories: props.categories.map(c => categoryLabels[c] || c),
    labels: {
      style: {
        fontSize: '13px',
        fontWeight: 600,
        colors: ['#475569', '#475569', '#475569', '#475569'],
      },
    },
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      formatter: (val: number) => val.toFixed(0),
    },
  },
  markers: {
    size: 5,
    strokeWidth: 2,
    strokeColors: '#4f46e5',
    colors: ['#ffffff'],
  },
  fill: {
    opacity: 0.25,
    colors: ['#4f46e5'],
  },
  stroke: {
    width: 2,
    colors: ['#4f46e5'],
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} / 5`,
    },
  },
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: '#e2e8f0',
        connectorColors: '#e2e8f0',
        fill: { colors: ['#f8fafc', '#ffffff'] },
      },
    },
  },
}))

const series = computed(() => [
  {
    name: props.companyName,
    data: props.scores,
  },
])
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-slate-800 text-center mb-2">SDLC Maturity Assessment</h2>
      <p class="text-center text-slate-500 mb-8">{{ companyName }}</p>
      <apexchart
        type="radar"
        height="450"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <!-- Score Cards -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div
        v-for="(cat, idx) in categories"
        :key="cat"
        class="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">{{ cat }}</p>
        <p class="text-3xl font-bold text-slate-800">{{ scores[idx] }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ categoryLabels[cat] }}</p>
      </div>
    </div>

    <div class="flex justify-center">
      <button
        @click="emit('reset')"
        class="rounded-xl border-2 border-indigo-600 px-8 py-3 text-base font-semibold text-indigo-600 transition hover:bg-indigo-50"
      >
        New Assessment
      </button>
    </div>
  </div>
</template>
