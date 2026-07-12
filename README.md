# Store Checkout

React Native app shell for the mobile checkout challenge.

## What is in this branch

- Responsive shell that stays usable on iPhone SE sized screens.
- Custom navigation without an external navigation library.
- Six screens in the flow: home, catalog, product detail, cart, checkout and confirmation.
- Reusable UI pieces for cards, buttons, stepper, empty states and tab navigation.
- Redux store with Flux-style slices for catalog, cart, checkout and transaction.
- Sensitive transaction data is encrypted before it is persisted to AsyncStorage.
- Remote catalog sync through a centralized backend API client with loading,
  success and error states.

## Requirements

- Node.js 22 or newer.
- npm 10 or newer.
- Android Studio or an Android device/emulator for Android runs.
- Xcode and CocoaPods only if you want to run iOS on macOS.

## Install

```bash
npm install
```

## Run locally

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS on macOS:

```bash
bundle install
bundle exec pod install
npm run ios
```

## Quality checks

Run unit tests:

```bash
npm test -- --runInBand
```

Run test coverage:

```bash
npm run test:coverage
```

Run lint:

```bash
npm run lint
```

Run TypeScript typecheck:

```bash
npx tsc --noEmit
```

## Coverage

Current coverage for this branch:

- Statements: 91.7%
- Branches: 83.33%
- Functions: 81.87%
- Lines: 91.47%

The coverage target is enforced through Jest so regressions below 80% fail locally.

## Notes

- The catalog, cart and checkout flow are currently powered by demo data.
- The catalog now syncs from the deployed backend by default. If you need to
  point the app to a different backend, update
  [`src/infrastructure/backend/backendConfig.ts`](./src/infrastructure/backend/backendConfig.ts).
- The checkout workflow creates a pending transaction before the final result
  screen resolves the order status.
- The Redux slices and workflow helpers are intentionally small so task 4 can
  extend the checkout path without rewriting the shell navigation.
