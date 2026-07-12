# Store Checkout

React Native app shell for the mobile checkout challenge.

## What is in this branch

- Responsive shell that stays usable on iPhone SE sized screens.
- Custom navigation without an external navigation library.
- Five screens in the flow: home, catalog, cart, checkout and confirmation.
- Reusable UI pieces for cards, buttons, stepper, empty states and tab navigation.
- Local reducer-based state so the shell is ready for later Redux integration.

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
- The reducer and screen layout are intentionally kept small so task 2 can add
  data, task 3 can connect stock, and the later tasks can wire payment and
  fulfillment without changing the shell.
