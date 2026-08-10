# Homepage organic-traffic and UI enhancement test plan

## Scope

This plan covers the Labour Dorm homepage changes requested on 2026-07-31:

1. Add an indexable bilingual FAQ/toggle section with useful accommodation-search content.
2. Replace the current Hero glass/gradient treatment with a clearer Uiverse Galaxy-inspired design.
3. Make the Hero primary action perform an on-page property search/filter, with WhatsApp as a secondary follow-up action.
4. Restore property results when Firebase is unavailable, empty, or not configured during local development.
5. Restore the old promotional banner format with the current Chinese month and an emphasized `HK$2,800` price.
6. Install the approved Google Ads tag `AW-11323045023` once across each
   localized page.

## Development safety

- Work only on `codex/labour-dorm-optimization`.
- Do not write to production Firebase.
- Local verification uses static property data and Firebase failure/empty-result fallbacks.
- Do not deploy, push, or merge to `main` as part of this work.

## Acceptance criteria

### FAQ and organic-search content

- Homepage contains at least eight useful FAQ entries in both `zh-hk` and `en`.
- Questions cover monthly worker accommodation, districts, pricing, deposits/fees, gender, minimum stay, move-in timing, employers/group bookings, and how availability is confirmed.
- FAQ answers are visible in server-rendered HTML, even when collapsed.
- Exactly one `FAQPage` JSON-LD block is present on the homepage.
- Toggle buttons expose `aria-expanded` and are keyboard operable.
- Copy does not invent guarantees, availability, ratings, government approval, or unsupported prices beyond the explicitly approved `HK$2,800` promotional starting price.

### Hero and search

- Hero uses a scoped Uiverse Galaxy adaptation with source attribution in code comments.
- Hero has one stable H1; no blurred or disappearing animated word.
- Primary CTA says `搜尋房源` / `Search listings`, applies the selected district, gender and move-in date, and scrolls to `#listings`.
- WhatsApp remains available as a secondary enquiry action after results.
- Desktop and mobile have no horizontal overflow.
- Reduced-motion mode disables decorative motion.

### Property retrieval

- Local homepage initially shows the static indexable property catalogue.
- A successful non-empty Firebase response replaces the static catalogue.
- An empty Firebase response does not erase a valid static fallback during local/static operation.
- Firebase errors do not remove the static catalogue.
- Filtering still returns the expected matching subset.

### Complete district filter

- The public homepage district select includes all 18 Hong Kong districts,
  even when a district currently has no published listing.
- Any additional operational area names already present in property data,
  such as 旺角, 北角 or 荃灣, remain available in the same select.
- Selecting a district with no current listing keeps the option selected and
  shows `0 個房源符合目前篩選` rather than removing the option or falling back
  to unrelated listings.
- `全部地區` remains the default and continues to show every public listing.
- The admin district select uses the same complete option set and still
  filters admin rows by the selected property district.

### Promotion banner

- Chinese banner derives the current month at runtime, e.g. `八月`.
- Banner visibly emphasizes `HK$2,800`.
- Banner remains fixed at the top while scrolling and does not cover the Header.
- English banner has equivalent meaning without Chinese UI leakage.

### Google Ads tag

- Each localized page includes one `gtag.js` loader for `AW-11323045023`.
- Each localized page includes one matching `gtag('config', 'AW-11323045023')`
  initialization.
- The tag is attached through the shared locale layout, so public pages and
  localized admin/auth pages do not need duplicated snippets.
- The tag is not duplicated during client navigation or by separate page
  components.

## Automated checks

Run:

```bash
npm run type-check
npm run lint
npm run test:site
```

Static-output verification must additionally check:

- bilingual FAQ headings and `FAQPage` JSON-LD;
- `搜尋房源` / `Search listings`;
- at least one property card in both localized homepage outputs;
- promotional `HK$2,800`;
- exactly one Google Ads loader and one matching Google Ads config per
  localized homepage;
- every sitemap URL maps to a generated page.

## Visual and interaction checks

Check at 375px, 768px, 1024px and 1440px:

- no page-level horizontal overflow;
- fixed banner and sticky Header do not overlap;
- Hero text and search controls keep safe edge margins;
- FAQ toggles open/close and retain visible focus;
- search CTA updates result count and moves focus/scroll toward listings;
- property cards are visible without requiring Firebase credentials.
- district select contains the complete Hong Kong district list and preserves
  custom operational areas from the property catalogue.
