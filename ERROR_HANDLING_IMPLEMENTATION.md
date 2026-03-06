# Error Handling Implementation

## Overview
Implementasi custom error page untuk menggantikan whitelabel error page default React Router, memberikan user experience yang lebih baik saat terjadi error.

## Changes Implemented

### 1. New Component: ErrorPage
**File:** `src/pages/ErrorPage.tsx`

**Features:**
- ✅ Custom error page dengan design yang konsisten dengan aplikasi
- ✅ User-friendly error messages
- ✅ Different UI based on error type (404, JavaScript error, etc.)
- ✅ Action buttons: Go Home, Go Back, Reload
- ✅ Error details display (development mode only)
- ✅ Gradient background dengan BRI branding
- ✅ Animated UI dengan Framer Motion
- ✅ Responsive design

**Error Types Handled:**
1. **Route Errors (404, etc.)**
   - Displays status code and status text
   - Custom message for 404 errors
   
2. **JavaScript Errors**
   - Displays error message
   - Shows stack trace in development mode
   
3. **Generic Errors**
   - Fallback error message
   - Helpful suggestions

**UI Structure:**
```
┌─────────────────────────────────────┐
│  Gradient Header (Red to Orange)   │
│  - Alert Icon                       │
│  - Error Title                      │
│  - Error Message                    │
├─────────────────────────────────────┤
│  Content                            │
│  - Error Details (dev only)         │
│  - Helpful Message                  │
│  - Action Buttons:                  │
│    • Go Home (Dashboard)            │
│    • Go Back (Previous page)        │
│    • Reload (Refresh)               │
├─────────────────────────────────────┤
│  Footer                             │
│  - Support message                  │
└─────────────────────────────────────┘
│  BRI Logo + App Name                │
└─────────────────────────────────────┘
```

### 2. Modified: Router Configuration
**File:** `src/routes/index.tsx`

**Changes:**
- ✅ Added `ErrorPage` import
- ✅ Added `errorElement` to root route
- ✅ Added `errorElement` to all child routes
- ✅ Error boundary at multiple levels for better error isolation

**Error Boundary Hierarchy:**
```
Root Route (/)
├─ errorElement: <ErrorPage />
└─ Children
   ├─ Dashboard
   │  └─ errorElement: <ErrorPage />
   ├─ Territorial Intelligence
   │  └─ errorElement: <ErrorPage />
   ├─ Market Intelligence
   │  └─ errorElement: <ErrorPage />
   ├─ Performance
   │  └─ errorElement: <ErrorPage />
   ├─ Intelligence Assistant
   │  └─ errorElement: <ErrorPage />
   ├─ Reporting
   │  └─ errorElement: <ErrorPage />
   ├─ Data Management
   │  └─ errorElement: <ErrorPage />
   └─ Campaign
      └─ errorElement: <ErrorPage />
```

## Technical Details

### Error Detection
Uses React Router's `useRouteError()` hook to capture errors:

```typescript
const error = useRouteError();

if (isRouteErrorResponse(error)) {
  // Route error (404, etc.)
  errorTitle = `Error ${error.status}`;
  errorMessage = error.statusText;
} else if (error instanceof Error) {
  // JavaScript error
  errorMessage = error.message;
  errorDetails = error.stack;
}
```

### Navigation Actions
Three action buttons provided:

1. **Go Home**
   ```typescript
   navigate('/dashboard');
   ```
   - Returns user to dashboard
   - Primary action (indigo color)

2. **Go Back**
   ```typescript
   navigate(-1);
   ```
   - Returns to previous page
   - Secondary action

3. **Reload**
   ```typescript
   window.location.reload();
   ```
   - Refreshes current page
   - Useful for transient errors

### Development Mode Features
Error details (stack trace) only shown in development:

```typescript
{errorDetails && process.env.NODE_ENV === 'development' && (
  <div>
    <pre>{errorDetails}</pre>
  </div>
)}
```

### Styling
- Gradient background: `from-slate-50 to-slate-100`
- Error header: `from-red-500 to-orange-500`
- White card with shadow and border
- Consistent with app design system
- Responsive grid for action buttons

## User Experience

### Error Flow
1. Error occurs in application
2. React Router catches error
3. ErrorPage component renders
4. User sees friendly error message
5. User can take action:
   - Go to dashboard
   - Go back to previous page
   - Reload the page

### Benefits Over Whitelabel Error
1. **Branded Experience:** Maintains BRI branding
2. **User-Friendly:** Clear, non-technical language
3. **Actionable:** Provides clear next steps
4. **Informative:** Shows helpful context
5. **Professional:** Polished UI with animations
6. **Consistent:** Matches app design system

## Error Scenarios Covered

### 1. Route Not Found (404)
- User navigates to non-existent route
- Shows "Page not found" message
- Suggests going home or back

### 2. Component Error
- Error in component render
- Shows error message
- Stack trace in development
- Suggests reload or go home

### 3. Data Loading Error
- API call fails
- Component throws error
- Caught by error boundary
- User can retry or go back

### 4. Import Error
- Lazy-loaded component fails
- Shows loading error
- User can reload to retry

## Testing Checklist
- [ ] 404 error shows custom error page
- [ ] Component error shows custom error page
- [ ] Error page displays correct error message
- [ ] "Go Home" button navigates to dashboard
- [ ] "Go Back" button returns to previous page
- [ ] "Reload" button refreshes the page
- [ ] Error details shown in development mode
- [ ] Error details hidden in production
- [ ] Responsive design works on mobile
- [ ] Animations work smoothly
- [ ] BRI logo displays correctly
- [ ] No whitelabel error page appears

## Migration Notes

### Before
- Whitelabel React Router error page
- Generic error messages
- No branding
- No clear actions
- Technical error details exposed

### After
- Custom branded error page
- User-friendly messages
- BRI branding maintained
- Clear action buttons
- Error details only in development

## Future Enhancements
- [ ] Error logging to monitoring service
- [ ] Different error pages for different error types
- [ ] Error recovery suggestions based on error type
- [ ] Contact support button with pre-filled error info
- [ ] Error analytics tracking
