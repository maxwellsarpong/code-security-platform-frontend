<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, default: () => [] },
  height: { type: Number, default: 220 },
  horizontal: { type: Boolean, default: false },
})

const canvasRef = ref(null)
let chart = null

function getOptions() {
  return {
    indexAxis: props.horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: '#1a2332',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#2d3a4f',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(45, 58, 79, 0.5)' },
        ticks: { color: '#94a3b8', maxTicksLimit: 8, font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(45, 58, 79, 0.5)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
        beginAtZero: true,
      },
    },
  }
}

function init() {
  if (!canvasRef.value || !props.labels.length) return
  chart = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: props.datasets.map((d) => ({
        label: d.label,
        data: d.data,
        backgroundColor: d.backgroundColor ?? 'rgba(34, 211, 238, 0.6)',
        borderColor: d.borderColor ?? '#22d3ee',
        borderWidth: 1,
        borderRadius: 4,
      })),
    },
    options: getOptions(),
  })
}

function destroy() {
  if (chart) {
    chart.destroy()
    chart = null
  }
}

onMounted(() => init())

watch(
  () => [props.labels, props.datasets, props.horizontal],
  () => {
    destroy()
    init()
  },
  { deep: true }
)

onBeforeUnmount(destroy)
</script>

<template>
  <div class="chart-wrap" :style="{ height: height + 'px' }">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.chart-wrap {
  width: 100%;
  min-height: 120px;
}
</style>
