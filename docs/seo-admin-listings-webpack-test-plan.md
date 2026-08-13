# SEO title, admin listings and Webpack regression test plan

## Scope

1. Update the Chinese homepage title and H1 around the approved search phrases:
   `外勞宿舍`, `勞工宿舍`, and `員工宿舍`.
2. Show the website's existing listings in the local admin dashboard without
   reading or writing production Firebase.
3. Prevent `next build` from corrupting an active `next dev` Webpack cache.

## Safety

- Local admin reads fall back to the version-controlled property catalogue.
- Local fallback rows are not silently written back to Firebase.
- When no Firestore emulator is available, admin mutations use an isolated
  browser-local test store seeded from the version-controlled catalogue.
- Browser-local test writes must never be sent to production Firebase.
- Production Firebase remains untouched.
- Keep development and production build artifacts in separate directories.

## Acceptance criteria

### Search wording

- Chinese metadata title contains all three approved phrases.
- Chinese H1 uses the phrases naturally and remains a single H1.
- Description and FAQ copy remain useful to humans; do not repeat keywords
  unnaturally.
- English metadata and H1 remain readable.

### Admin listings

- `/zh-hk/admin/` shows the existing local property catalogue when Firestore is
  unavailable.
- If the production Firebase project has no Firestore database yet, the admin
  page remains renderable after authentication, shows the static catalogue in
  read-only mode, and clearly explains why writes are disabled.
- If an authenticated user's token refresh fails temporarily, an approved
  admin email can still resolve to admin access; the page must not crash from
  an uncaught `getIdTokenResult()` rejection.
- The dashboard no longer reports zero simply because a local Firestore
  emulator is not running.
- No Firestore connection error is logged during the fallback read.
- Add, edit, archive and delete work against the browser-local test store when
  the Firestore emulator is unavailable.
- Reloading the dashboard preserves local test changes.
- A clear notice identifies that changes are local-only and are not published.
- Image uploads in local mode stay in the browser-local test data and enforce a
  conservative size limit.

### Webpack

- `next dev` uses `.next-dev`.
- `next build` uses `.next`.
- Running the production build while the development server is active does not
  produce missing chunk, React Client Manifest, or `reading 'call'` errors.
- The development homepage and admin dashboard still return HTTP 200 after the
  build completes.

## Verification

Run:

```bash
npm run type-check
npm run lint
npm run test:site
```

With local Auth Emulator and `next dev` running:

1. open `/zh-hk/admin/` and confirm existing listing rows;
2. add a uniquely named test listing and confirm it appears;
3. edit that listing, reload, and confirm the edit persists;
4. archive and permanently delete the test listing;
5. confirm the original catalogue remains intact;
6. record browser console errors;
7. run `npm run build`;
8. reload `/zh-hk/` and `/zh-hk/admin/`;
9. confirm both render without a Webpack overlay or console error.

## Homepage and dashboard listing synchronisation

### Acceptance criteria

- The local admin dashboard and public homepage read from the same local test
  catalogue when the Firestore emulator is not enabled.
- The admin dashboard defaults to `全部資料`, so every existing listing stays
  available for editing, republishing, archiving, or deletion. A separate
  `公開房源` option shows the same property set as the public homepage: active
  listings with at least one image.
- After a listing is unpublished from the admin table, it remains visible in
  the default admin view and its edit and republish controls remain available.
- If all public listings are unpublished, the homepage shows zero public
  listings rather than silently falling back to the original static catalogue.
- Each admin row has an accessible one-click publish toggle. Toggling an active
  row changes it to unpublished/draft; toggling an unpublished row changes it
  to published. The row status and published count update immediately after a
  successful save.
- The public homepage reflects the toggle after reload: only active listings
  with images are shown; unpublished or archived listings are not shown.
- The admin dashboard has a `地區` select alongside the text search and status
  select. Its options come from the same property district values used by the
  homepage hero filter, including all 18 Hong Kong districts and any custom
  operational areas already present in property data. Selecting a district
  filters the dashboard rows and selecting `全部地區` restores all matching
  rows.
- The homepage hero no longer renders the `預計入住日` control or calendar
  icon. District, gender, and search submission remain usable.
- No new development-stage action writes to production Firebase.

### Browser verification

With localhost and the local Auth Emulator running:

1. Open `/zh-hk/admin/` and confirm the default `全部資料` view shows all
   existing records and each row has edit and publish controls.
2. Switch the admin scope to `公開房源` and confirm the visible property names
   and count match the public homepage.
3. Select a district in the admin `地區` filter and confirm every visible row
   belongs to that district; select `全部地區` and confirm the list expands.
4. Click one row's publish toggle once. Confirm its status/count changes, open
   `/zh-hk/`, reload, and confirm the listing visibility follows the new
   status. Confirm the row remains in the default admin view, then toggle it
   back and confirm the public listing returns.
5. Open `/zh-hk/` and confirm the hero contains district and gender controls,
   no `預計入住日` control, and the search button still scrolls to filtered
   listings.
6. When all public image-backed listings are unpublished in local test data,
   reload `/zh-hk/` and confirm the result is zero listings; republish one
   from the default admin view and confirm it returns after reload.
7. Check the browser console for errors and record the result.

### Production-without-Firestore regression

With Firebase client configuration enabled but no `(default)` Firestore
database created, sign in with an approved admin account and open
`/zh-hk/admin/`. Confirm:

1. The route does not show Next.js `Application error`.
2. The existing static catalogue is visible.
3. The page identifies the missing production database and disables add, edit,
   publish, archive, and delete controls.
4. A browser refresh remains stable and does not produce an uncaught client
   exception.
5. A missing or unreachable database leaves the loading state within the
   configured read timeout and does not remain stuck indefinitely.
6. If Firebase Auth does not resolve an initial session, the route leaves its
   loading shell within the configured auth timeout and returns to login.

This check is read-only and must not create the Firestore database or write any
production document.
