# Filter Sheet Implementation

## Overview
Implementasi filter sheet yang muncul dari sebelah kanan untuk halaman Dashboard, menggantikan filter inline yang sebelumnya.

## Changes Implemented

### 1. New Component: FilterSheet
**File:** `src/components/FilterSheet.tsx`

**Features:**
- ✅ Slides in from right side dengan smooth animation
- ✅ Backdrop overlay dengan opacity transition
- ✅ Portal rendering untuk proper z-index (9999)
- ✅ Responsive design (max-width: 28rem / 448px)
- ✅ Keyboard support (ESC to close)
- ✅ Body scroll lock saat sheet terbuka
- ✅ Filter controls: Date Range, Territory, Branch, Product
- ✅ Active filter count indicator
- ✅ Reset all filters button
- ✅ Apply filters button

**Props:**
```typescript
interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  showTerritoryFilter?: boolean;
  showDateRangeFilter?: boolean;
  showBranchFilter?: boolean;
  showProductFilter?: boolean;
}
```

**Layout Structure:**
- Header: Title, active count, close button
- Content: Scrollable filter controls
- Footer: Reset and Apply buttons

### 2. Modified Component: PageLayout
**File:** `src/components/PageLayout.tsx`

**Changes:**
- ✅ Added `filterButton` prop untuk render filter button di header
- ✅ Filter button positioned di sebelah kanan judul (same row)
- ✅ Backward compatible dengan prop `filters` (legacy)
- ✅ Flexbox layout untuk alignment yang proper

**New Props:**
```typescript
interface PageLayoutProps {
  // ... existing props
  filterButton?: ReactNode;  // NEW
}
```

**Header Layout:**
```
[Title + Subtitle]  [Filter Button] [Actions]
```

### 3. Modified Page: DashboardPage
**File:** `src/pages/DashboardPage.tsx`

**Changes:**
- ✅ Removed `PageFilters` component usage
- ✅ Added `FilterSheet` component
- ✅ Added state management untuk sheet open/close
- ✅ Added filter button dengan active count badge
- ✅ Filter button positioned di header bersama judul

**Implementation:**
```typescript
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

const activeFilterCount = useMemo(() => {
  return filters.territory.length + 
         filters.branch.length + 
         filters.product.length;
}, [filters]);

// Filter button in PageLayout
filterButton={
  <button onClick={() => setIsFilterSheetOpen(true)}>
    <Filter /> Filters
    {activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
  </button>
}

// Filter sheet at bottom
<FilterSheet
  isOpen={isFilterSheetOpen}
  onClose={() => setIsFilterSheetOpen(false)}
/>
```

## Technical Details

### Animation
- **Sheet slide:** Spring animation dengan damping 30, stiffness 300
- **Backdrop fade:** 0.2s duration
- **Exit animations:** Smooth reverse of entry animations

### Z-Index Hierarchy
- Backdrop: 9998
- Sheet: 9999
- Ensures sheet appears above all other content

### Portal Rendering
Sheet uses `createPortal` to render directly to `document.body`, avoiding:
- Parent overflow clipping
- Z-index stacking context issues
- Transform/filter parent constraints

### Accessibility
- ✅ ESC key to close
- ✅ Backdrop click to close
- ✅ Focus management
- ✅ ARIA labels
- ✅ Keyboard navigation support

### Responsive Design
- Mobile: Full width sheet
- Desktop: Max width 28rem (448px)
- Scrollable content area
- Fixed header and footer

## User Experience

### Opening Filter Sheet
1. User clicks "Filters" button in page header
2. Backdrop fades in (0.2s)
3. Sheet slides in from right (spring animation)
4. Body scroll is locked
5. Focus moves to sheet

### Interacting with Filters
1. User selects/deselects filter options
2. Active count updates in real-time
3. Changes are immediately reflected in FilterContext
4. Badge shows active filter count

### Closing Filter Sheet
1. User clicks "Apply Filters" button, close button, backdrop, or presses ESC
2. Sheet slides out to right
3. Backdrop fades out
4. Body scroll is restored
5. Focus returns to trigger button

## Benefits

### Compared to Inline Filters
1. **Space Efficiency:** Doesn't take up vertical space on page
2. **Better UX:** Dedicated space for filter controls
3. **Cleaner Layout:** Page header is more compact
4. **Mobile Friendly:** Better experience on small screens
5. **Consistent Pattern:** Can be reused across all pages

### Technical Benefits
1. **Portal Rendering:** No z-index or overflow issues
2. **Reusable:** Single component for all pages
3. **Maintainable:** Centralized filter logic
4. **Performant:** Lazy rendering (only when open)

## Migration Guide

### For Other Pages
To migrate other pages to use FilterSheet:

1. Import FilterSheet and useState:
```typescript
import FilterSheet from '../components/FilterSheet';
import { useState } from 'react';
```

2. Add state for sheet:
```typescript
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
```

3. Replace `filters` prop with `filterButton`:
```typescript
<PageLayout
  filterButton={
    <button onClick={() => setIsFilterSheetOpen(true)}>
      <Filter /> Filters
    </button>
  }
>
```

4. Add FilterSheet component:
```typescript
<FilterSheet
  isOpen={isFilterSheetOpen}
  onClose={() => setIsFilterSheetOpen(false)}
/>
```

## Testing Checklist
- [ ] Filter button muncul di header sebelah kanan judul
- [ ] Sheet slides in dari kanan saat button diklik
- [ ] Backdrop muncul dengan opacity transition
- [ ] Body scroll terkunci saat sheet terbuka
- [ ] ESC key menutup sheet
- [ ] Backdrop click menutup sheet
- [ ] Close button menutup sheet
- [ ] Apply button menutup sheet
- [ ] Filter selections tersimpan di FilterContext
- [ ] Active filter count badge update real-time
- [ ] Reset all button menghapus semua filter
- [ ] Responsive di mobile dan desktop
- [ ] Tidak ada z-index issues
- [ ] Smooth animations
