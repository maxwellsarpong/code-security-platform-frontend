# Modern Components - Quick Start

## 📍 Component Locations

All new modern components are located in:
```
src/components/modern/
├── ModernButton.vue    # Versatile button component
├── ModernCard.vue      # Flexible card wrapper
├── ModernTable.vue     # Data table with search
└── StatCard.vue        # Statistics display card
```

## 🔧 Installation & Usage

### 1. Import Components
Each component can be imported individually:

```vue
<script setup>
import ModernButton from '@/components/modern/ModernButton.vue'
import ModernCard from '@/components/modern/ModernCard.vue'
import StatCard from '@/components/modern/StatCard.vue'
import ModernTable from '@/components/modern/ModernTable.vue'
</script>
```

### 2. Quick Examples

#### StatCard - Metrics Display
```vue
<template>
  <StatCard 
    label="Revenue"
    value="$12,450"
    change="↑ 8% from last month"
    trend="up"
  />
</template>
```

#### ModernButton - Actions
```vue
<template>
  <div class="actions">
    <!-- Primary action -->
    <ModernButton variant="primary" size="lg">
      Start Scan
    </ModernButton>
    
    <!-- Secondary -->
    <ModernButton variant="secondary">
      Cancel
    </ModernButton>
    
    <!-- Danger action -->
    <ModernButton variant="danger">
      Delete
    </ModernButton>
  </div>
</template>
```

#### ModernCard - Content Containers
```vue
<template>
  <div class="layout">
    <!-- Standard card -->
    <ModernCard>
      <h3>Standard Card</h3>
      <p>Regular content with border and shadow</p>
    </ModernCard>
    
    <!-- Glass effect -->
    <ModernCard variant="glass">
      <h3>Glass Effect</h3>
      <p>Frosted glass appearance with blur</p>
    </ModernCard>
    
    <!-- Gradient background -->
    <ModernCard variant="gradient">
      <h3>Gradient Card</h3>
      <p>Subtle gradient with accent border</p>
    </ModernCard>
  </div>
</template>
```

#### ModernTable - Data Display
```vue
<template>
  <ModernTable 
    title="Security Scans"
    :columns="[
      { key: 'repo', label: 'Repository' },
      { key: 'status', label: 'Status' },
      { key: 'issues', label: 'Issues' },
      { key: 'time', label: 'Time' }
    ]"
    :rows="scans"
    show-search
    :searchable-fields="['repo', 'status']"
  >
    <!-- Custom cell rendering -->
    <template #cell-status="{ value }">
      <span class="badge" :class="`badge--${value}`">
        {{ value }}
      </span>
    </template>
  </ModernTable>
</template>

<script setup>
const scans = [
  { repo: 'acme-api', status: 'passed', issues: 0, time: '2 min ago' },
  { repo: 'acme-web', status: 'failed', issues: 2, time: '15 min ago' },
]
</script>
```

## 🎨 Customization

All components use CSS variables defined in `src/assets/main.css`. Customize these variables:

```css
:root {
  /* Change accent color */
  --accent: #06b6d4;
  
  /* Change background */
  --bg: #0a0e14;
  
  /* Change radius */
  --radius-md: 14px;
}
```

## 🎯 Props Reference

### StatCard
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | String | required | Card label |
| value | String/Number | required | Main numeric value |
| change | String | '' | Change description |
| trend | String | null | 'up' or 'down' for indicator |

### ModernButton
| Prop | Type | Options | Default |
|------|------|---------|---------|
| variant | String | primary, secondary, ghost, soft, danger | primary |
| size | String | sm, md, lg | md |
| disabled | Boolean | - | false |

### ModernCard
| Prop | Type | Options | Default |
|------|------|---------|---------|
| variant | String | default, glass, flat, gradient | default |
| elevated | Boolean | - | false |

### ModernTable
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | Array | [] | Column definitions |
| rows | Array | [] | Data rows |
| title | String | '' | Table title |
| showSearch | Boolean | false | Enable search |
| searchableFields | Array | [] | Fields to search (all by default) |

## 🚀 Migration Checklist

- [x] CSS system enhanced with modern variables
- [x] AppLayout updated with modern styling
- [x] OverviewView updated with StatCard components
- [x] Modern component library created
- [ ] ScansView - update to use ModernTable
- [ ] ReposView - update to use ModernTable
- [ ] BillingView - update components
- [ ] SettingsView - update to modern components
- [ ] Create modular dialog/modal components
- [ ] Add pagination to tables
- [ ] Create form components

## 💡 Best Practices

1. **Use StatCard for metrics** - Always display numeric values with context
2. **Use ModernButton** - Consistent action styling
3. **Use ModernCard** - Remove old `.card` class styling
4. **Use ModernTable** - For data-heavy views
5. **Maintain consistency** - Follow established patterns

## 📚 Additional Resources

- [MODERNIZATION.md](./MODERNIZATION.md) - Full modernization details
- [src/assets/main.css](./src/assets/main.css) - CSS variables and utilities
- [OverviewView.vue](./src/views/OverviewView.vue) - Example implementation

---

**Last Updated**: February 22, 2026
