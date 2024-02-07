# web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and
disable
Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for
type checking. In editors, we
need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented
a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more
performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Android Development

### Toolkit
[Capacitor](https://capacitorjs.com/solution/vue)

### Environment

Node >= 20

Java = 19

### Build and Run

```sh
# Install dependencies
pnpm install
# Build project for first boot
pnpm build-only
# Connect your android device by ADB and run
npx cap run android
```

### Live(Hot) Reload

Live Reload is useful for debugging both the web portion of an app as well as native functionality on device hardware or
simulators. Rather than deploy a new native binary every time you make a code change, it reloads the browser (or Web
View) when changes in the app are detected.

If running on a device, make sure it is on the same Wi-Fi network as your computer.

On Windows, run "ipconfig" to look for the IPv4 address.

Configure capacitor.config.ts

```js
const config: CapacitorConfig = {
  // ...
  server: {
    // ...
    url: 'http://<YOUR_IPv4_ADDRESS>:5173'
  }
}
```

Run

```sh
# Run Vitest server on 5173
pnpm dev --host
# Sync Capacitor Config
npx cap sync
# Run with live reload
npx cap run android
```