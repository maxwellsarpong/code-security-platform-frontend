# Dashboard Style Guide

## 🎨 Color Palette

### Primary Colors
```
Background:      #0a0e14
Elevated BG:     #151b28
Card BG:         #1f2937
Hover BG:        #2a3548
Glass BG:        rgba(31, 41, 55, 0.5)
```

### Text Colors
```
Primary:         #f3f4f6
Secondary:       #d1d5db
Muted:           #9ca3af
```

### Accent Colors
```
Accent:          #06b6d4 (Cyan)
Accent Hover:    #0ea5e9
Accent Dim:      #0891b2
Accent Light:    rgba(6, 182, 212, 0.15)
Accent Glow:     rgba(6, 182, 212, 0.4)
```

### Status Colors
```
Success:         #10b981
Warning:         #f59e0b
Critical/Error:  #ef4444
High:            #f97316
```

---

## 🔤 Typography

### Font Families
```
Sans Serif:      DM Sans, system-ui, -apple-system, sans-serif
Monospace:       JetBrains Mono, Monaco, monospace
```

### Font Sizes & Weights
```
H1:  2rem       (700 weight)
H2:  1.5rem     (700 weight)
H3:  1.25rem    (700 weight)
H4:  1.1rem     (700 weight)
Body: 0.9rem    (400 weight)
Small: 0.85rem  (500 weight)
Tiny: 0.75rem   (700 weight)
```

---

## 📐 Spacing Scale

```
xs:   0.25rem
sm:   0.5rem
md:   1rem
lg:   1.5rem
xl:   2rem
2xl:  2.5rem
```

### Utility Classes
```css
/* Flex */
.flex              { display: flex; }
.flex-center       { display: flex; align-items: center; justify-content: center; }
.flex-between      { display: flex; align-items: center; justify-content: space-between; }

/* Gap */
.gap-sm { gap: 0.5rem; }
.gap-md { gap: 1rem; }
.gap-lg { gap: 1.5rem; }

/* Margin */
.mt-sm, .mt-md, .mt-lg
.mb-sm, .mb-md, .mb-lg

/* Padding */
.px-sm, .px-md

/* Text */
.text-center, .text-right
.text-sm, .text-xs
.font-bold, .font-semibold
.opacity-50, .opacity-75
```

---

## 🎯 Border Radius

```
sm:   6px
md:   10px   (default)
lg:   14px
xl:   18px
```

---

## 💫 Shadows

```
sm:  0 1px 3px 0 rgba(0, 0, 0, 0.3)
md:  0 4px 12px -2px rgba(0, 0, 0, 0.4)
lg:  0 10px 25px -5px rgba(0, 0, 0, 0.5)
xl:  0 20px 40px -10px rgba(0, 0, 0, 0.6)
glow: 0 0 20px rgba(6, 182, 212, 0.2)
```

---

## ⏱️ Transitions

```
Fast:   150ms cubic-bezier(0.4, 0, 0.2, 1)
Base:   250ms cubic-bezier(0.4, 0, 0.2, 1)
Slow:   400ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🧩 Component Variants

### Buttons

#### Primary
```
Background: Linear gradient (accent → light cyan)
Shadow: 0 0 20px rgba(6, 182, 212, 0.4)
Hover: Elevated + enhanced glow
Animation: Shimmer effect on hover
```

#### Secondary
```
Background: Elevated gray
Border: 1.5px solid
Hover: Accent border + soft glow
```

#### Ghost
```
Background: Transparent
Border: 1.5px solid
Hover: Accent text + soft bg
```

#### Soft
```
Background: Accent light
Border: Accent border
Hover: Darker accent bg + glow
```

#### Danger
```
Background: Critical light
Color: Critical red
Border: Critical border
Hover: Enhanced critical effect
```

### Cards

#### Default
```
Background: bg-card
Border: 1px solid
Shadow: md shadow
Hover: Accent border + lift + glow
```

#### Glass
```
Background: Semi-transparent
Border: Accent-tinted
Backdrop: blur(20px)
Effect: Frosted glass appearance
```

#### Flat
```
Background: bg-card
Left border: 3px accent
Effect: Subtle side highlight
```

#### Gradient
```
Background: Gradient (bg → accent tint)
Border: Accent border
Shadow: Glow effect
```

---

## 📊 Badge Styles

### Status Types
```
Success:  Green bg + border
Warning:  Yellow bg + border
Critical: Red bg + border
High:     Orange bg + border
Muted:    Gray bg + border
```

All badges use semi-transparent backgrounds with matching borders.

---

## 🎭 Interactive States

### Default State
```
Cursor: default
Opacity: 1.0
Transform: scale(1)
```

### Hover State
```
Cursor: pointer
Elevation: +2px or +4px
Glow: Color-specific
Shadow: Enhanced
Transform: translateY(-2px)
```

### Active State
```
Cursor: pointer
Transform: scale(0.98)
Immediate feedback
```

### Focus State
```
Outline: 2px solid accent
Outline-offset: 2px
Visible for accessibility
```

### Disabled State
```
Opacity: 0.5
Cursor: not-allowed
No hover effects
No interactivity
```

---

## 🎬 Motion Guidelines

### Fade Transitions
```
Duration: 250ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Used for: Page changes, overlays
```

### Lift Effects
```
Hover: translateY(-2px)
Active: translateY(0)
Duration: 250ms
```

### Scale Effects
```
Active: scale(0.98)
Duration: 150ms
Used for: Button press feedback
```

### Shimmer Animation
```
Direction: Left to right
Duration: 250ms
Opacity: 20% white gradient
Used for: Primary buttons
```

---

## 🔍 Layout Patterns

### Grid Systems
```
Stats Grid:    repeat(auto-fit, minmax(260px, 1fr))
Charts Row:    1.5fr 1fr (responsive to 1 col on mobile)
Overview Grid: 1fr 1fr (responsive to 1 col)
```

### Spacing Patterns
```
Section Gap:   1.75rem
Padding:       1.75rem
Border Gap:    1.25rem
Compact Gap:   0.875rem
```

---

## ♿ Accessibility

### Color Contrast
- Text on bg: >= 4.5:1 ratio
- UI components: >= 3:1 ratio

### Focus Management
- All interactive elements have focus styles
- Focus visible on tab key press
- Clear focus order

### Semantic HTML
- Proper heading hierarchy
- Label elements with inputs
- ARIA attributes where needed

---

## 📱 Responsive Breakpoints

```
Mobile:   < 768px  (collapsed sidebar)
Tablet:   768px - 1024px
Desktop:  > 1024px (full layout)
```

### Responsive Classes
```css
@media (max-width: 1024px) {
  /* Stack layouts */
}

@media (max-width: 768px) {
  /* Collapse sidebar */
}
```

---

## 🎯 Usage Examples

### Common Patterns

**Metric Display**
```vue
<StatCard 
  label="Total Revenue"
  value="$45,231"
  change="↑ 12% from last month"
  trend="up"
/>
```

**Primary Action**
```vue
<ModernButton variant="primary">
  Create New
</ModernButton>
```

**Data Table**
```vue
<ModernTable 
  title="Recent Activity"
  :columns="columns"
  :rows="data"
  show-search
/>
```

**Content Container**
```vue
<ModernCard variant="gradient">
  <h3>Featured Section</h3>
  <p>Important information here</p>
</ModernCard>
```

---

## 🚀 Implementation Checklist

- [x] Color system modernized
- [x] Typography hierarchy improved
- [x] Spacing system implemented
- [x] Shadow system enhanced
- [x] Components created
- [x] Utilities added
- [ ] Icon system added (consider Heroicons)
- [ ] Animation library (consider Framer Motion)
- [ ] Form validation styling
- [ ] Dark mode toggle (optional)

---

**Last Updated**: February 22, 2026  
**Status**: Complete & Ready for Use
