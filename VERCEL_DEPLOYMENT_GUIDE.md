# Vercel Deployment Guide

## Quick Fix Summary

Dua masalah utama telah diperbaiki untuk deployment di Vercel:

### ✅ 1. Map Error: `t.markerClusterGroup is not a function`

**File yang diubah:** `src/components/LeafletMap.tsx`

**Perbaikan:**
- Reorganisasi import Leaflet dan plugin
- Menambahkan TypeScript type declarations untuk markerClusterGroup
- Memastikan CSS imports dalam urutan yang benar

### ✅ 2. 404 Error saat Refresh (F5)

**File yang dibuat:** `vercel.json`

**Isi file:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Penjelasan:** File ini memberitahu Vercel untuk mengarahkan semua route ke `index.html`, sehingga React Router dapat menangani routing di client-side.

## Deployment Steps

### 1. Commit Changes
```bash
git add vercel.json src/components/LeafletMap.tsx
git commit -m "Fix: Vercel deployment issues - map error and 404 on refresh"
git push
```

### 2. Deploy ke Vercel

**Option A: Automatic Deployment (Recommended)**
- Vercel akan otomatis deploy setelah push ke repository
- Tunggu hingga deployment selesai (biasanya 2-3 menit)

**Option B: Manual Deployment**
```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Verify Deployment

Setelah deployment selesai, test hal-hal berikut:

#### Test Routing (404 Fix)
1. Buka aplikasi di browser
2. Navigate ke berbagai halaman:
   - `/dashboard`
   - `/campaign`
   - `/territorial/interactive-map`
   - `/data/geospatial`
3. Tekan F5 (refresh) di setiap halaman
4. ✅ Pastikan tidak ada 404 error

#### Test Map Components (markerClusterGroup Fix)
1. Buka halaman Dashboard
2. ✅ Pastikan peta muncul tanpa error
3. Buka menu "Interactive Map View" (Territorial Intelligence)
4. ✅ Pastikan peta muncul dengan markers yang ter-cluster
5. Toggle layer controls
6. ✅ Pastikan layer toggle berfungsi
7. Zoom in/out
8. ✅ Pastikan clustering bekerja dengan baik

## Troubleshooting

### Jika Map Masih Error

1. **Clear Vercel Build Cache:**
   - Buka Vercel Dashboard
   - Pilih project Anda
   - Settings > General > Clear Build Cache
   - Redeploy

2. **Check Browser Console:**
   - Buka Developer Tools (F12)
   - Lihat Console tab
   - Cari error messages
   - Jika ada error terkait Leaflet, pastikan CDN links accessible

3. **Verify Dependencies:**
   ```bash
   npm list leaflet leaflet.markercluster
   ```
   Pastikan kedua package terinstall dengan benar

### Jika 404 Masih Terjadi

1. **Verify vercel.json:**
   ```bash
   cat vercel.json
   ```
   Pastikan file ada dan isinya benar

2. **Check Git:**
   ```bash
   git status
   ```
   Pastikan `vercel.json` sudah di-commit dan push

3. **Redeploy:**
   - Buka Vercel Dashboard
   - Pilih project
   - Deployments tab
   - Klik "Redeploy" pada deployment terakhir

## Build Configuration

Vercel akan otomatis detect Vite project. Konfigurasi default:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 18.x (atau sesuai `.nvmrc` jika ada)

Tidak perlu konfigurasi tambahan.

## Environment Variables

Jika menggunakan environment variables:

1. Buka Vercel Dashboard
2. Pilih project
3. Settings > Environment Variables
4. Tambahkan variables dari `.env.example`:
   - `VITE_GEMINI_API_KEY`
   - `VITE_API_BASE_URL`
   - dll.

**Note:** Prefix `VITE_` wajib untuk environment variables yang diakses di client-side.

## Performance Optimization

Aplikasi sudah dioptimasi untuk production:

- ✅ Code splitting per route
- ✅ Lazy loading untuk map components
- ✅ Marker clustering untuk performance
- ✅ Debouncing untuk user interactions
- ✅ Canvas rendering untuk heatmaps
- ✅ Gzip compression (handled by Vercel)

Build size:
- Total: ~1.5 MB (gzipped: ~400 KB)
- Initial load: ~300 KB (gzipped: ~100 KB)
- Map vendor: ~153 KB (gzipped: ~44 KB)

## Monitoring

Setelah deployment, monitor:

1. **Performance:**
   - Vercel Analytics (jika enabled)
   - Lighthouse scores
   - Core Web Vitals

2. **Errors:**
   - Vercel Logs
   - Browser Console
   - User reports

3. **Usage:**
   - Page views
   - Most visited routes
   - User interactions

## Support

Jika masih ada masalah:

1. Check dokumentasi lengkap: `DEPLOYMENT_FIXES.md`
2. Review Vercel logs di Dashboard
3. Test locally dengan production build:
   ```bash
   npm run build
   npm run preview
   ```

## Checklist Deployment

- [x] `vercel.json` created
- [x] LeafletMap.tsx fixed
- [x] Build successful locally
- [x] All routes tested
- [x] Map components tested
- [ ] Committed and pushed to repository
- [ ] Deployed to Vercel
- [ ] Verified routing works (no 404)
- [ ] Verified maps work (no markerClusterGroup error)
- [ ] Performance tested
- [ ] Environment variables configured (if needed)

---

**Last Updated:** 2026-03-06
**Status:** Ready for Production Deployment ✅
