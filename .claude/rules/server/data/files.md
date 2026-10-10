---
paths:
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules, loaded automatically when a server file is edited. -->
<!-- The full reasoning is docs/guides/server/data.md and docs/architecture/images.md; keep them in sync. -->

# Server — files and images

- Uploads go to `UPLOADS_DIR` through `saveUpload` (atomic: temp file + rename) and are served `immutable` under `UPLOADS.route`; keys are UUIDs, avatar URLs carry `?v=`.
- Images are normalised on upload with the `src/lib` helpers (`optimizeAvatar`, `processChatImage`) and resized on demand by `GET /images`; never call `sharp()` on user input directly — `openImage` caps the pixel count.
- Any URL a user supplied is fetched with `safeFetch` / `fetchImage` (SSRF-safe, pinned IP, size and time caps), never a raw `fetch`.
- Disk caches are swept by `@nestjs/schedule` jobs with `listFileStats` + `selectEvictions` + `removeFiles`; data folders resolve through `resolveDataDir`.
