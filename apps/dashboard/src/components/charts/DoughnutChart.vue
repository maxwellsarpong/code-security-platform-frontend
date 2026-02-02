<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  colors: { type: Array, default: () => ['#22d3ee', '#0891b2', '#facc15', '#94a3b8'] },
  height: { type: Number, default: 200 },
})

const canvasRef = ref(null)
let chart = null

function init() {
  if (!canvasRef.value || !props.labels.length) return
  const bgColors = props.colors.length >= props.data.length
    ? props.colors
    : [...props.colors, ...Array(props.data.length - props.colors.length).fill('#64748b')]
  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels: props.labels,
      datasets: [{
        data: props.data,
        backgroundColor: bgColors,
        borderColor: '#0a0f1a',
        borderWidth: 2,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 },
        },
        tooltip: {
          backgroundColor: '#1a2332',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: '#2d3a4f',
          borderWidth: 1,
        },
      },
    },
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
  () => [props.labels, props.data, props.colors],
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
