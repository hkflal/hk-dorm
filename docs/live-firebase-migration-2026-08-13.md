# Labour Dorm live Firebase migration — 2026-08-13

## Completed

- Firebase project: `hk-dormitory-hub`
- Default Firestore database: created in `asia-east2` (Hong Kong)
- Firestore edition: Standard
- Delete protection: enabled
- Firestore rules: deployed from `firestore.rules`
- Firestore indexes: deployed from `firestore.indexes.json`
- Migrated properties: 15/15
- Migrated status: 12 active, 3 inactive
- Firebase Hosting: deployed to `https://hk-dormitory-hub.web.app`
- Production source-of-truth: Firestore `properties` collection
- Approved admin emails in rules and client: `arrivals@hkflal.com`, `hkdl902@gmail.com`

## Backup and read-back

- Preflight catalogue backup: `backups/2026-08-13-production-preflight.json`
- Post-migration read-back manifest: `backups/2026-08-13-production-post-migration.json`
- The preflight confirmed that the production Firestore database did not exist
  before creation; no previous production documents were overwritten.
- The read-back confirmed every migrated document ID and property ID.

## Verified behavior

- Public homepage reads active, image-backed listings from Firestore after the
  client refreshes.
- Hidden or inactive listings are excluded from the public query.
- The admin service supports create, edit, publish, hide, archive and delete;
  emulator tests cover these operations, image upload and audit logs.
- A reachable empty Firestore collection remains writable for the first listing.
- Optional blank form fields are omitted before Firestore writes.

## Outstanding infrastructure blocker

Firebase Storage is not yet provisioned for this project. Creating the default
bucket was rejected because the project has no linked billing account:
`The billing account for the owning project is disabled in state absent`.

Therefore:

- Existing static image paths continue to render.
- New admin image upload is not yet available in production.
- `storage.rules` has been reviewed and tested in the emulator but has not been
  deployed to production because the bucket does not exist.

After the owner links an approved billing account in Firebase, run:

```bash
npx firebase deploy --only storage --project hk-dormitory-hub
```

Then perform one approved admin image-upload smoke test and verify the saved
Storage URL. Do not upload a test image before the bucket and rules are ready.
