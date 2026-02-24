# TaskManager

TaskManager is a React Native app with offline-first task management using local SQLite plus Firebase Auth/Firestore sync.

## Architecture choice

- `Client architecture`: feature-based React Native app (`modules/auth`, `modules/app/Tasks`, `modules/app/Settings`) with shared `components`, `hooks`, `utils`, and `navigation`.
- `Pattern`: MVVM (Model-View-ViewModel) is used across features.
  - `View`: `*.view.tsx` files render UI.
  - `ViewModel`: `*.viewModal.ts` files handle state, validation, and UI actions.
  - `Model`: `*.modal.ts` interfaces plus service/repository/database layers for business/data logic.
- `State management`: Redux Toolkit stores auth/session state; Firebase auth listener (`App.tsx`) keeps Redux user state in sync.
- `Data architecture`: SQLite (`react-native-nitro-sqlite`) is the local store for tasks to support offline usage and fast reads.
- `Cloud architecture`: Firebase Auth for login/signup and Firestore for cross-device persistence.
- `Sync strategy`: user-scoped bidirectional sync in `sync.service.ts`.
  - Local updates are marked `sync_status = pending` (or `deleted`) and pushed to Firestore.
  - Firestore documents use stable IDs to prevent duplicates.
  - On login/user change, local data from other users is cleared, pending local records are pushed, and current user records are pulled from Firestore into SQLite.

## Libraries used

- `react-native`, `react`: mobile app runtime/UI.
- `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`: app navigation.
- `@reduxjs/toolkit`, `react-redux`: global auth state and async auth actions.
- `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`: Firebase integration.
- `react-native-nitro-sqlite`: local SQLite database.
- `@react-native-community/netinfo`: connectivity detection for sync triggers.
- `react-native-dotenv`: environment variable injection (`@env` module).
- `react-native-safe-area-context`, `react-native-gesture-handler`, `react-native-screens`, `react-native-reanimated`, `react-native-keyboard-controller`: core RN UI/runtime support.
- `dayjs`: date parsing/formatting.

## How to run the app in each environment

### 1. Prerequisites

- Node.js `>= 22.11.0`
- npm
- React Native environment setup: https://reactnative.dev/docs/set-up-your-environment
- Android Studio + Android SDK (for Android)
- Enable long path support in windows for react native keyboard controller by refering to this doc: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/troubleshooting

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create these files in the project root:

- `.env.development`
- `.env.staging`
- `.env.production`

Use this shape in each file:

```env
API_KEY=...
AUTH_DOMAIN=...
PROJECT_ID=...
STORAGE_BUCKET=...
MESSAGING_SENDER_ID=...
APP_ID=...
API_BASE_URL=...
ENV=development
```

For `ENV`, set the value per file:

- `.env.development` -> `ENV=development`
- `.env.staging` -> `ENV=staging`
- `.env.production` -> `ENV=production`

### 4. Configure Firebase native files

- `android/app/google-services.json`
- `ios/GoogleService-Info.plist`

### 5. Run app by environment

Development:

```sh
npm run start:dev
npm run android:dev
# or
npm run ios:dev
```

Staging:

```sh
npm run start:staging
npm run android:staging
# or
npm run ios:staging
```

Production:

```sh
npm run start:prod
npm run android:prod
# or
npm run ios:prod
```

## Known limitations

- Sync conflict handling is currently basic (`last write wins` via `updated_at`), without per-field conflict resolution.
- No Firestore realtime listener is used; pull sync runs on user/session events and explicit refresh points.
- If there are unsynced local records and a cloud pull runs, behavior depends on sync order and timestamps; advanced merge policies are not implemented.
- Background sync when the app is fully closed is not implemented.
- iOS app could not be fully developed/tested because I do not have a personal MacBook. I added the iOS dependencies/configuration, but iOS runtime behavior is unverified.
- For forgot-password flow, reset emails may arrive in `Spam`/`Junk`; users should check those folders if the email is not visible in Inbox.
