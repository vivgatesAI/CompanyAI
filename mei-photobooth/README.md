# MEI Photo Booth (Venice API)

iPhone-first web photo booth for Boston Medical Engagement & Impact events.

## Features
- Safari camera capture + photo upload
- Portrait/landscape-aware processing
- 6 presets (including MEI in Massachusetts, Lobster Harbor, Custom)
- Venice image editing integration with strict likeness-preservation instruction
- Processing animations + smooth UX states
- Download and local save (browser local storage)

## Local run
```bash
npm install
cp .env.example .env
npm run dev
```

## Railway Deployment
Deploy this `mei-photobooth` folder as its own Railway service.

### Required variables
- `VENICE_API_KEY`
- `PORT` (Railway usually injects)

### Optional variables
- `VENICE_IMAGE_EDIT_MODEL` (default: `qwen-edit`)
- `MAX_UPLOAD_MB` (default: 12)
- `PUBLIC_BASE_URL`

## Important disclaimers in UX
- Pre-camera permission consent text shown before camera usage.
- Post-processing reminder shown in footer.
- Clear fallback to upload if Safari camera permission denied.

## Notes
- For event scale, consider Redis/object storage and server-side session records.
- Current local save is device/browser-specific.
