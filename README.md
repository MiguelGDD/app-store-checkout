# Store Checkout

React Native app shell for the mobile checkout challenge.

## What is in this branch

- Responsive shell that stays usable on iPhone SE sized screens.
- Custom navigation without an external navigation library.
- Five screens in the flow: home, catalog, cart, checkout and confirmation.
- Reusable UI pieces for cards, buttons, stepper, empty states and tab navigation.
- Redux store with Flux-style slices for catalog, cart, checkout and transaction.
- Sensitive transaction data is encrypted before it is persisted to AsyncStorage.

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

Run lint:

```bash
npm run lint
```

Run TypeScript typecheck:

```bash
npx tsc --noEmit
```

## Notes

- The catalog, cart and checkout flow are currently powered by demo data.
- The Redux slices and workflow helpers are intentionally small so task 3 can
  connect stock, task 4 can wire payment, and the later tasks can reuse the
  same shell without changing the navigation structure.
