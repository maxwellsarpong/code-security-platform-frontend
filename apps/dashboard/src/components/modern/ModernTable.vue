<template>
  <div class="modern-table-container">
    <div v-if="title || showSearch" class="table-toolbar">
      <h3 v-if="title" class="table-title">{{ title }}</h3>
      <input 
        v-if="showSearch"
        v-model="searchQuery"
        type="text"
        class="table-search"
        placeholder="Search..."
      >
    </div>
    
    <div class="table-wrap">
      <table class="modern-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" :style="col.style" class="table-header">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in filteredRows" :key="idx" class="table-row">
            <td v-for="col in columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  searchableFields: {
    type: Array,
    default: () => []
  }
})

const searchQuery = ref('')

const filteredRows = computed(() => {
  if (!searchQuery.value) return props.rows
  
  return props.rows.filter(row => {
    const fields = props.searchableFields.length > 0 
      ? props.searchableFields 
      : Object.keys(row)
    
    return fields.some(field => 
      String(row[field]).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})
</script>

<style scoped>
.modern-table-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-elevated);
}

.table-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.table-search {
  padding: 0.65rem 1rem;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: 0.9rem;
  width: 280px;
  transition: all var(--transition-base);
}

.table-search:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.table-wrap {
  overflow-x: auto;
  overflow-y: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table-header {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 2px solid var(--border-light);
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--bg-elevated);
}

.table-row {
  border-bottom: 1px solid var(--border-light);
  transition: background-color var(--transition-fast);
}

.table-row:hover {
  background: rgba(6, 182, 212, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row td {
  padding: 1.25rem 1.5rem;
  color: var(--text-secondary);
}

.table-row:hover td {
  color: var(--text);
}
</style>
