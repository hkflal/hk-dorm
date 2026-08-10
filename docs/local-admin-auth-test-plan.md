# Local admin authentication test plan

## Scope

Restore the localhost admin login flow without creating users or writing data in
the production Firebase project.

## Safety

- Run authentication against the Firebase Auth Emulator at `127.0.0.1:9099`.
- Never store the administrator password in source control, scripts, fixtures,
  exported emulator data, or documentation.
- Automatic test-user creation is allowed only when
  `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` and only for
  `arrivals@hkflal.com`.
- Production Firebase configuration and production data must remain untouched.
- Firestore and Storage operations remain unavailable until their emulators are
  running; do not fall back to production services.

## Acceptance criteria

1. Local development reports a clear configuration error when the emulator flag
   is missing.
2. With the Auth Emulator running, the approved admin email can sign in with the
   password entered in the form.
3. If the approved emulator user does not exist, the first sign-in creates that
   emulator-only user and continues to `/zh-hk/admin/`.
4. An unapproved email is never auto-created and receives a useful error.
5. A wrong password for an existing emulator user receives a useful error.
6. Refreshing the admin page preserves the authenticated emulator session.
7. No source-controlled file contains the administrator password.

## Regression checks

Run:

```bash
node scripts/check-local-auth-emulator.mjs
npm run type-check
npm run lint
npm run test:site
```

Browser verification:

- submit the approved email and user-supplied password;
- confirm navigation to `/zh-hk/admin/`;
- refresh and confirm the admin dashboard remains visible;
- sign out and confirm the login page returns.
