<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, default: () => [] },
  height: { type: Number, default: 220 },
})

const canvasRef = ref(null)
let chart = null

const defaultOptions = {
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

function init() {
  if (!canvasRef.value || !props.labels.length) return
  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets.map((d) => ({
        label: d.label,
        data: d.data,
        borderColor: d.color ?? '#22d3ee',
        backgroundColor: d.fill ? (d.fillColor ? d.fillColor + '40' : 'rgba(34, 211, 238, 0.1)') : undefined,
        fill: d.fill ?? true,
        tension: 0.35,
        pointRadius: 2.5,
        pointHoverRadius: 4,
      })),
    },
    options: defaultOptions,
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
  () => [props.labels, props.datasets],
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
