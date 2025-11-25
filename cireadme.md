# CI/CD & Settings README

Single source of truth for every automation, formatting, and configuration file that powers GitHub Actions, CI/CD, linting, and build settings in `/Users/admin/Projects/self-assessment-mf`.

---

## 1. Daily Workflow Checklist

1. `yarn install --immutable` — install dependencies exactly as CI.
2. `cp env.example .env` and fill secrets for local runs.
3. `yarn dev` for local development, `yarn build && yarn preview` to mimic production bundle.
4. Let Husky run `yarn lint-staged` before each commit (or run manually).
5. Push feature branches; `ci.yml` validates, tests, and builds automatically.
6. Merge to `main` to trigger semantic version tagging via `release.yml`.

---

## 2. Scripts & Tooling (`/Users/admin/Projects/self-assessment-mf/package.json`)

Contains all npm scripts (dev, build, lint, format, Cypress suites, semantic-release), dependency pins, and lint-staged rules. Use these scripts locally to replicate CI behaviour.

```json
{
  "name": "self-assessment-mf",
  "version": "1.0.0",
  "scripts": {
    "dev": "rsbuild dev --open",
    "dev:msw": "USE_MOCKS=true rsbuild dev --open",
    "build": "rsbuild build",
    "preview": "rsbuild preview",
    "lint": "biome check",
    "lint:fix": "biome check --write",
    "lint:ci": "biome ci --error-on-warnings",
    "test": "cypress run",
    "test:open": "cypress open",
    "test:component": "cypress run --component",
    "test:e2e": "cypress run --e2e",
    "test:ci": "cypress run --headless",
    "format": "biome format --write",
    "format:check": "biome format",
    "clean": "rm -rf dist node_modules/.cache",
    "start": "rsbuild preview --port 3003",
    "start:ci": "rsbuild preview --port 3003 --host 0.0.0.0",
    "prepare": "husky install",
    "release": "semantic-release",
    "commitlint": "commitlint"
  },
  "dependencies": {
    "@frontegg/react": "7.0.13",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-toast": "^1.2.15",
    "@tanstack/react-query": "^5.83.0",
    "@tanstack/react-table": "^8.21.3",
    "axios": "^1.10.0",
    "chart.js": "^4.5.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.525.0",
    "mixpanel-browser": "^2.45.0",
    "msw": "^2.10.5",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.62.0",
    "react-is": "^19.1.1",
    "react-router-dom": "6.25.0",
    "recharts": "^3.1.2",
    "resolver": "^0.1.12",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@biomejs/biome": "2.1.2",
    "@commitlint/cli": "^19.8.1",
    "@commitlint/config-conventional": "^19.8.1",
    "@module-federation/rsbuild-plugin": "^0.16.0",
    "@rsbuild/core": "^1.2.15",
    "@rsbuild/plugin-react": "^1.1.1",
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/git": "^10.0.1",
    "@semantic-release/github": "^11.0.4",
    "@semantic-release/npm": "^12.0.2",
    "@tanstack/react-query-devtools": "^5.83.0",
    "@types/chart.js": "^4.0.1",
    "@types/cypress": "^1.1.6",
    "@types/mixpanel-browser": "^2.38.1",
    "@types/react": "^18.3.23",
    "@types/react-dom": "~18.3.1",
    "@types/react-is": "^19",
    "autoprefixer": "^10.4.21",
    "cypress": "^14.5.2",
    "cypress-rspack-dev-server": "^1.1.0",
    "cypress-split": "^1.24.21",
    "husky": "^9.1.7",
    "lint-staged": "^16.1.5",
    "postcss": "^8.5.6",
    "postcss-loader": "^8.1.1",
    "semantic-release": "^24.2.7",
    "tailwindcss": "^3",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.7.2",
    "webpack": "^5.100.2"
  },
  "lint-staged": {
    "src/**/*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
      "biome check --files-ignore-unknown=true",
      "biome check --write --no-errors-on-unmatched",
      "biome check --write --unsafe --no-errors-on-unmatched",
      "biome format --write --no-errors-on-unmatched",
      "biome lint --write --no-errors-on-unmatched"
    ],
    "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
      "biome check --no-errors-on-unmatched --files-ignore-unknown=true"
    ]
  },
  "packageManager": "yarn@4.6.0+sha512.5383cc12567a95f1d668fbe762dfe0075c595b4bfff433be478dbbe24e05251a8e8c3eb992a986667c1d53b6c3a9c85b8398c35a960587fbd9fa3a0915406728",
  "msw": {
    "workerDirectory": [
      "public"
    ]
  }
}
```

---

## 3. Local Quality Gates

### Husky Hooks (`/Users/admin/Projects/self-assessment-mf/.husky/pre-commit`)

```sh
yarn lint-staged
```

### Commit Message Guard (`/Users/admin/Projects/self-assessment-mf/.husky/commit-msg`)

```sh
#!/usr/bin/env sh
```

### Conventional Commit Rules (`/Users/admin/Projects/self-assessment-mf/commitlint.config.js`)

```javascript
module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat',
				'fix',
				'docs',
				'style',
				'refactor',
				'perf',
				'test',
				'build',
				'ci',
				'chore',
				'revert',
			],
		],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'subject-case': [2, 'always', 'lower-case'],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'header-max-length': [2, 'always', 72],
	},
};
```

### Biome Formatter & Linter (`/Users/admin/Projects/self-assessment-mf/biome.json`)

```json
{
	"$schema": "https://biomejs.dev/schemas/2.1.2/schema.json",
	"vcs": {
		"enabled": false,
		"clientKind": "git",
		"useIgnoreFile": false
	},
	"files": {
		"ignoreUnknown": false,
		"includes": ["./src/**/*", "*.js", "*.ts", "*.jsx", "*.tsx", "!biome.json"],
		"experimentalScannerIgnores": ["nist_csf_2_0_questionnaire_instance*.json"],
		"maxSize": 4194304
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"suspicious": {
				"noExplicitAny": "off"
			}
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "single",
			"jsxQuoteStyle": "single"
		}
	},
	"assist": {
		"enabled": true,
		"actions": {
			"source": {
				"organizeImports": "on"
			}
		}
	}
}
```

---

## 4. Build, Bundling, and Frontend Settings

### Rsbuild (`/Users/admin/Projects/self-assessment-mf/rsbuild.config.ts`)

```typescript
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import moduleFederationConfig from './module-federation.config';

export default defineConfig({
	plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig, {})],
	output: {
		assetPrefix: '/mf',
	},
	server: {
		port: 3003,
	},
	dev: {
		hmr: process.env.NODE_ENV === 'development',
	},
	source: {
		// Enable environment variable injection
		define: {
			// This allows you to use process.env variables in your code
			'import.meta.env.FRONTEGG_AUTH_URL': JSON.stringify(
				process.env.FRONTEGG_AUTH_URL,
			),
			'import.meta.env.NEXT_PUBLIC_FRAMEWORKS_API_URL': JSON.stringify(
				process.env.NEXT_PUBLIC_FRAMEWORKS_API_URL,
			),
			'import.meta.env.FRONTEGG_APPLICATION_ID': JSON.stringify(
				process.env.FRONTEGG_FOQUS_APPLICATION_ID,
			),
			'import.meta.env.RUNNING_IN_CYPRESS': JSON.stringify(
				process.env.RUNNING_IN_CYPRESS,
			),
			'import.meta.env.USE_MOCKS': JSON.stringify(process.env.USE_MOCKS),
			'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		},
	},
});
```

### Module Federation (`/Users/admin/Projects/self-assessment-mf/module-federation.config.ts`)

```typescript
import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
	name: 'self_assessment_mf',
	exposes: {
		// './remoteRoutes': './src/exposes/remoteRoutes.tsx',
		'./RemoteApp': './src/exposes/RemoteApp.tsx',
	},
	shared: {
		// Frontegg is optional - app works with mocks if not available
		'@frontegg/react': {
			singleton: true,
			requiredVersion: '7.0.13',
			eager: false, // Optional dependency - only loaded if host provides it
		},
		react: {
			singleton: true,
			requiredVersion: false,
			eager: true,
		},
		'react-dom': {
			singleton: true,
			requiredVersion: false,
			eager: true,
		},
		'react-router-dom': {
			singleton: true,
			requiredVersion: false,
			eager: true,
		},
	},
});
```

### TypeScript (`/Users/admin/Projects/self-assessment-mf/tsconfig.json`)

```json
{
  "compilerOptions": {
    "lib": [
      "DOM",
      "ES2020"
    ],
    "jsx": "react-jsx",
    "target": "ES2020",
    "noEmit": true,
    "skipLibCheck": true,
    "useDefineForClassFields": true,
    /* modules */
    "module": "ESNext",
    "isolatedModules": true,
    "resolveJsonModule": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    /* type checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "src",
    "cypress",
    "@mf-types/*/lib",
  ]
}
```

### Tailwind (`/Users/admin/Projects/self-assessment-mf/tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))',
				},
				fill: {
					base: {
						0: 'var(--fill-base-0)',
						1: 'var(--fill-base-1)',
						2: 'var(--fill-base-2)',
						3: 'var(--fill-base-3)',
						4: 'var(--fill-base-4)',
						5: 'var(--fill-base-5)',
						n1: 'var(--fill-base-n1)',
					},
					brand: {
						primary: 'var(--fill-brand-primary)',
						'primary-transparent': 'var(--fill-brand-primary-transparent)',
						secondary: 'var(--fill-brand-secondary)',
						success: 'var(--fill-brand-success)',
					},
					specific: {
						tooltip: 'var(--fill-specific-tooltip)',
						background: 'var(--fill-specific-background)',
						divider: 'var(--fill-specific-divider)',
						'sidebar-primary': 'var(--fill-specific-sidebar-primary)',
						'sidebar-child': 'var(--fill-specific-sidebar-child)',
						'icon-default': 'var(--fill-specific-icon-default)',
						'icon-hover': 'var(--fill-specific-icon-hover)',
						'icon-onpress': 'var(--fill-specific-icon-onpress)',
					},
					information: {
						error: 'var(--fill-information-error)',
						warning: 'var(--fill-information-warning)',
						success: 'var(--fill-information-success)',
						info: 'var(--fill-information-info)',
					},
				},
				text: {
					base: {
						primary: 'var(--text-base-primary)',
						secondary: 'var(--text-base-secondary)',
						tertiary: 'var(--text-base-tertiary)',
						invert: 'var(--text-base-invert)',
					},
					brand: {
						primary: 'var(--text-brand-primary)',
						secondary: 'var(--text-brand-secondary)',
					},
					specific: {
						'sidebar-idle': 'var(--text-specific-sidebar-idle)',
						'sidebar-hover': 'var(--text-specific-sidebar-hover)',
						'sidebar-active': 'var(--text-specific-sidebar-active)',
						'external-scan-score': 'var(--text-specific-external-scan-score)',
					},
					information: {
						error: 'var(--text-information-error)',
						success: 'var(--text-information-success)',
						info: 'var(--text-information-info)',
					},
					functional: {
						0: 'var(--text-functional-0)',
						m1: 'var(--text-functional-m1)',
					},
				},
				stroke: {
					base: {
						0: 'var(--stroke-base-0)',
						1: 'var(--stroke-base-1)',
						2: 'var(--stroke-base-2)',
					},
					brand: {
						primary: 'var(--stroke-brand-primary)',
						secondary: 'var(--stroke-brand-secondary)',
					},
					information: {
						error: 'var(--stroke-information-error)',
					},
				},
				viz: {
					base: {
						primary: 'var(--viz-base-primary)',
						secondary: 'var(--viz-base-secondary)',
						tertiary: 'var(--viz-base-tertiary)',
						market: 'var(--viz-base-market)',
					},
					event: {
						attritional: 'var(--viz-event-attritional)',
						databreach: 'var(--viz-event-databreach)',
						interruption: 'var(--viz-event-interruption)',
						ransomware: 'var(--viz-event-ransomware)',
					},
					impact: {
						ransomware: 'var(--viz-impact-ransomware)',
						interruption: 'var(--viz-impact-interruption)',
						provider: 'var(--viz-impact-provider)',
						liability: 'var(--viz-impact-liability)',
						databreach: 'var(--viz-impact-databreach)',
						regulation: 'var(--viz-impact-regulation)',
						tags: {
							severe: 'var(--viz-impact-tags-severe)',
							significant: 'var(--viz-impact-tags-significant)',
							moderate: 'var(--viz-impact-tags-moderate)',
							minor: 'var(--viz-impact-tags-minor)',
							negligible: 'var(--viz-impact-tags-negligible)',
						},
					},
					likelihood: {
						tags: {
							expected: 'var(--viz-likelihood-tags-expected)',
							likely: 'var(--viz-likelihood-tags-likely)',
							possible: 'var(--viz-likelihood-tags-possible)',
							unlikely: 'var(--viz-likelihood-tags-unlikely)',
							rare: 'var(--viz-likelihood-tags-rare)',
						},
					},
					priority: {
						tags: {
							low: 'var(--viz-priority-tags-low)',
							medium: 'var(--viz-priority-tags-medium)',
							high: 'var(--viz-priority-tags-high)',
							critical: 'var(--viz-priority-tags-critical)',
						},
					},
					maturity: {
						levels: {
							0: 'var(--viz-maturity-levels-0)',
							1: 'var(--viz-maturity-levels-1)',
							2: 'var(--viz-maturity-levels-2)',
							3: 'var(--viz-maturity-levels-3)',
							4: 'var(--viz-maturity-levels-4)',
						},
					},
				},
			},
			spacing: {
				xs: '10px',
				sm: '20px',
				md: '32px',
				lg: '48px',
				xl: '64px',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
```

### PostCSS (`/Users/admin/Projects/self-assessment-mf/postcss.config.mjs`)

```javascript
export default {
  plugins: {
    tailwindcss: {},
  },
};
```

### Cypress + Rsbuild (`/Users/admin/Projects/self-assessment-mf/cypress.config.ts`)

```typescript
import { createRsbuild } from '@rsbuild/core';
import { defineConfig } from 'cypress';
import { devServer } from 'cypress-rspack-dev-server';
import config from './rsbuild.config';

async function rspackDevServer(devServerConfig) {
	const rsbuild = await createRsbuild({ rsbuildConfig: config });
	const rsbuildConfigs = await rsbuild.initConfigs();

	const rspackConfig = rsbuildConfigs[0];

	return devServer({
		...devServerConfig,
		framework: 'react',
		rspackConfig: rspackConfig,
	});
}

export default defineConfig({
	component: {
		supportFile: './cypress/support/component.ts',
		specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
		devServer(devServerConfig) {
			return rspackDevServer({
				...devServerConfig,
			});
		},
	},

	e2e: {
		setupNodeEvents(_on, _config) {
			// implement node event listeners here
		},
		baseUrl: 'http://localhost:3003',
	},
});
```

### Environment Template (`/Users/admin/Projects/self-assessment-mf/env.example`)

```dotenv
# Frontegg Authentication Configuration
FRONTEGG_AUTH_URL=https://your-tenant.frontegg.com
FRONTEGG_APPLICATION_ID=your-application-id
# Development Configuration
RUNNING_IN_CYPRESS=false

# API Configuration
API_BASE_URL=https://api.your-domain.com

# Module Federation Configuration
REMOTE_ENTRY_URL=http://localhost:3003/remoteEntry.js
```

---

## 5. GitHub Actions Workflows (`/Users/admin/Projects/self-assessment-mf/.github/workflows`)

### 5.1 `ci.yml`

Validates branch naming, runs lint-staged, pulls Cypress timing artifacts, fans out component/E2E tests through `cypress-split.yml`, uploads artifacts to GCS, and publishes build outputs.

```yaml
name: CI

on:
  pull_request:
    branches: [master, dev, main]
  release:
    types:
      - published

# https://stackoverflow.com/questions/66335225/how-to-cancel-previous-runs-in-the-pr-when-you-push-new-commitsupdate-the-curre/67939898#67939898
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  package_name: kovrr-mf-template-rspack

jobs:
  check-branch:
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout Private Kovrr Action Repo
        uses: actions/checkout@v4
        with:
          repository: Kovrr/kovrr_github_actions
          ref: v3.1.0
          token: ${{ secrets.SA_TOKEN }}
          path: .github/actions/kovrr_actions
      - name: Check Branch Name Action Step
        uses: ./.github/actions/kovrr_actions/check_branch_name
        if: startsWith(github.ref, 'refs/tags/') != true
        with:
          head_ref: ${{ github.head_ref }}
          ref: ${{ github.ref }}
          event_name: ${{ github.event_name }}

  pre-commit-checks:
    runs-on: ubuntu-24.04
    needs: [check-branch]
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
      - name: Enable corepack
        run: corepack enable
      - name: Set yarn version
        run: yarn set version stable
      - name: Install dependencies
        run: yarn install --immutable
      - name: Run lint-staged
        run: yarn lint-staged
      # - name: Check formatting
      #   run: yarn format:check
      # - name: Run linting
      #   run: yarn lint:ci

  download_cypress_timings_file:
    runs-on: ubuntu-24.04
    needs: [check-branch, pre-commit-checks]
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          sparse-checkout: "self_assessment_mf_cypress_timings.json"
          sparse-checkout-cone-mode: false
          path: foqus_fe_cypress_timings
          repository: Kovrr/foqus_fe_cypress_timings
          ref: main
          token: ${{ secrets.SA_TOKEN }}
      - uses: actions/upload-artifact@v4
        with:
          name: self_assessment_mf_cypress_timings.json
          path: |
            foqus_fe_cypress_timings/self_assessment_mf_cypress_timings.json
          if-no-files-found: ignore

  test_e2e_and_component:
    # https://github.com/bahmutov/cypress-workflows
    needs: [download_cypress_timings_file]
    uses: ./.github/workflows/cypress-split.yml
    with:
      nE2E: 1
      nComponent: 1
      # use timings to split E2E specs across N machines efficiently
      split-file: "self_assessment_mf_cypress_timings.json"
      browser: chrome
      build: yarn build
      start: yarn start:ci
      install-command: yarn install --immutable

  test_results:
    if: ${{ always() }}
    runs-on: ubuntu-24.04
    name: Final Results
    needs: [test_e2e_and_component]
    steps:
      - run: exit 1
        if: >-
          ${{
                contains(needs.*.result, 'failure')
            || contains(needs.*.result, 'cancelled')
          }}

  # this job grab the output for the `split` workflow
  # and writes it into a JSON file "timings.json"
  # and then commits the updated file to the repository
  commit-updated-timings:
    runs-on: ubuntu-24.04
    needs: [test_e2e_and_component, test_results]
    steps:
      - name: Checkout 🛎
        uses: actions/checkout@v4
        with:
          repository: Kovrr/foqus_fe_cypress_timings
          ref: main
          path: foqus_fe_cypress_timings
          token: ${{ secrets.SA_TOKEN }}
      - name: Show merged timings 🖨️
        run: |
          echo '${{ needs.test_e2e_and_component.outputs.merged-timings }}'
      - name: Write updated timings 💾
        # pretty-print json string into a file
        run: echo '${{ needs.test_e2e_and_component.outputs.merged-timings }}' > foqus_fe_cypress_timings/self_assessment_mf_cypress_timings.json
      - name: Commit changed spec timings ⏱️
        uses: EndBug/add-and-commit@v9
        with:
          add: "self_assessment_mf_cypress_timings.json"
          default_author: user_info
          message: "ci: automated update of self_assessment_mf_cypress_timings.json"
          tag_push: "--force"
          cwd: foqus_fe_cypress_timings

  build:
    needs: [check-branch]
    # needs: [test_results]
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
      - name: Enable corepack
        run: corepack enable
      - name: Set yarn version
        run: yarn set version stable
      - name: Install dependencies
        run: yarn install --immutable
      - name: Build application
        run: yarn build
        env:
          NODE_ENV: production
      - name: Set environment variables
        run: |
          if [[ $GITHUB_REF == refs/tags/v* ]]; then
            echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_ENV
            echo "BUCKET_PATH=mf-builds/self-assessment-mf/${GITHUB_REF#refs/tags/v}" >> $GITHUB_ENV
          else
            echo "VERSION=sha-${GITHUB_SHA::7}" >> $GITHUB_ENV
            echo "BUCKET_PATH=mf-builds/self-assessment-mf/sha-${GITHUB_SHA::7}" >> $GITHUB_ENV
          fi
      - name: Login to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: "${{ secrets.GCP_SHARED_KEY }}"
      - name: Upload build to GCS bucket
        uses: google-github-actions/upload-cloud-storage@v2
        with:
          path: dist
          destination: ${{ env.BUCKET_PATH }}
      - name: Create version file
        run: |
          echo '{"version": "${{ env.VERSION }}", "timestamp": "${{ github.event.head_commit.timestamp }}", "commit": "${{ github.sha }}"}' > version.json
      - name: Upload version file to GCS
        uses: google-github-actions/upload-cloud-storage@v2
        with:
          path: version.json
          destination: ${{ env.BUCKET_PATH }}/version.json
```

### 5.2 Reusable Cypress Workflow (`/Users/admin/Projects/self-assessment-mf/.github/workflows/cypress-split.yml`)

Defines the reusable matrix strategy, caching, artifact handling, and timing merge consumed by `ci.yml`.

```yaml
# reusable workflow to install NPM dependencies
# and run Cypress tests across N machines in using cypress-split
# https://github.com/bahmutov/cypress-split
name: split
on:
  workflow_call:
    inputs:
      nE2E:
        description: "Number of parallel containers for running E2E specs"
        type: number
        required: false
        default: 0
      nComponent:
        description: "Number of parallel containers for running Component specs"
        type: number
        required: false
        default: 0
      # a common command to run before parallel jobs
      before-run:
        description: "A command to run once before all parallel jobs"
        type: string
        required: false
      # standard parameters
      config:
        description: "Set configuration values. Separate multiple values with a comma. The values set here override any values set in your configuration file."
        type: string
        required: false
      config-file:
        description: "Path to a JSON file where configuration values are set."
        type: string
        required: false
      env:
        description: "Sets Cypress environment variables"
        type: string
        required: false
      browser:
        description: "Name of the browser to use"
        type: string
        required: false
      command:
        description: "Command that overrides cypress run"
        type: string
        required: false
      start:
        description: "Command for starting local server in the background"
        type: string
        required: false
      start-windows:
        description: "A different start command on Windows"
        type: string
        required: false
      build:
        description: "Command to run in build step before starting tests"
        type: string
        required: false
      install-command:
        description: "Custom install command to use"
        type: string
        required: false
      runTests:
        description: "Whether or not to run tests"
        type: boolean
        required: false
        default: true
      wait-on:
        description: "Local server URL to wait for"
        type: string
        required: false
      wait-on-timeout:
        description: "Amount of time to wait for wait-on url to be available"
        type: number
        required: false
        # default is 60 seconds
        default: 60
      working-directory:
        description: "Working directory containing Cypress folder"
        type: string
        required: false
      headed:
        description: "Whether or not to use headed mode"
        type: boolean
        required: false
      spec:
        description: "Provide a specific specs to run"
        type: string
        required: false
      skip-spec:
        description: "Provide a list of specs to NOT run"
        type: string
        required: false
      project:
        description: "Path of project to run"
        type: string
        required: false
      command-prefix:
        description: "You can prefix the default test command using the command-prefix option."
        type: string
        required: false
      quiet:
        description: "Whether or not to silence any Cypress specific output from stdout"
        type: boolean
        required: false
        default: false
      # custom input parameters
      debug-inputs:
        description: "Print the workflow inputs"
        type: boolean
        required: false
        default: false
      debug:
        description: "Set the environment variable DEBUG"
        type: string
        required: false
        default: ""
      store-artifacts:
        description: "Store screenshots and videos from the cypress folder"
        type: boolean
        required: false
        default: true
      marge:
        description: |
          Download the Mochawesome results from all test jobs
          and merge into a single report
        type: boolean
        required: false
        default: false
      coverage:
        description: |
          Download all coverage results from all test jobs
          and merge into a single coverage report
        type: boolean
        required: false
        default: false
      # we are setting it true by default for the split workflow
      # since this workflow has its own GHA summary via cypress-split plugin
      publish-summary:
        description: "Whether or not to publish job summary"
        type: boolean
        required: false
        default: false
      # use the following split configuration/timings file
      split-file:
        description: "E2E split timings file to use and merge back"
        type: string
        required: false
    outputs:
      merged-timings:
        description: "Combined timings JSON from split files"
        value: ${{ jobs.merge-split-timings.outputs.timings }}

env:
  FRONTEGG_AUTH_URL: https://auth.kov-test.notprod.me
  FRONTEGG_APPLICATION_ID: your-application-id
  RUNNING_IN_CYPRESS: true
  HOTJAR_ENABLED: false
  ELASTIC_APM_ENABLED: false

jobs:
  prepare:
    runs-on: ubuntu-24.04
    # explicitly set the output of this job
    # so that other jobs can use it
    outputs:
      matrixE2E: ${{ steps.prepareE2E.outputs.matrix }}
      matrixComponent: ${{ steps.prepareComponent.outputs.matrix }}
    steps:
      # generate the list using a bash script
      - name: Create E2E container matrix ⊹
        id: prepareE2E
        # for reusable workflow, must use the full action reference
        uses: bahmutov/gh-build-matrix@main
        with:
          # number of containers to use for running E2E tests
          n: ${{ inputs.nE2E }}

      - name: Create component container matrix ⊹
        id: prepareComponent
        # for reusable workflow, must use the full action reference
        uses: bahmutov/gh-build-matrix@main
        with:
          # number of containers to use for running component tests
          n: ${{ inputs.nComponent }}

      - name: Print result 🖨
        run: echo '${{ steps.prepareE2E.outputs.matrix }}'

      # by installing dependencies once
      # we cache them
      - name: Checkout 🛎
        uses: actions/checkout@v4
      - name: enable corepack
        run: corepack enable
      - name: set yarn version
        run: yarn set version stable
      - uses: actions/cache@v4
        with:
          path: |
            ~/.cache/Cypress
            node_modules
          key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - run: yarn add cypress@13.14.2
      - name: Install deps 📦
        uses: cypress-io/github-action@v6
        with:
          install: true
          runTests: false
          build: yarn build
          cache-key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: Save build folder
        uses: actions/upload-artifact@v4
        with:
          name: build
          if-no-files-found: error
          path: dist
          include-hidden-files: true
      - name: Before run 🧺
        if: ${{ inputs.before-run }}
        run: ${{ inputs.before-run }}

  # the N parallel E2E testing jobs we create
  e2eTests:
    if: ${{ inputs.nE2E > 0 }}
    needs: prepare
    runs-on: ubuntu-24.04
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.prepare.outputs.matrixE2E) }}
    steps:
      - name: Debug inputs 🐞
        if: ${{ inputs.debug-inputs }}
        env:
          WORKFLOW_INPUTS: ${{ toJson(inputs) }}
        run: echo "$WORKFLOW_INPUTS"

      - name: Checkout 🛎
        uses: actions/checkout@v4
      - name: Download the cypress timings file
        uses: actions/download-artifact@v4
        with:
          name: self_assessment_mf_cypress_timings.json
          path: .
      - name: enable corepack
        run: corepack enable
      - name: set yarn version
        run: yarn set version stable
      - name: Download the build folder
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist
      # these containers will load balance all found tests among themselves
      - uses: actions/cache@v4
        with:
          path: |
            ~/.cache/Cypress
            node_modules
          key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: Cypress tests 🧪
        uses: cypress-io/github-action@v6
        # pass the machine index and the total number
        # https://github.com/bahmutov/cypress-split
        env:
          SPLIT: ${{ strategy.job-total }}
          SPLIT_INDEX: ${{ strategy.job-index }}
          SPLIT_FILE: "${{ inputs.split-file }}"
          # pass the custom list of specs if needed
          SPEC: "${{ inputs.spec }}"
          SKIP_SPEC: "${{ inputs.skip-spec }}"
          # pass the DEBUG environment variable
          DEBUG: ${{ inputs.debug }}
        # pass the rest of the commands via Cypress GH Action
        with:
          config: ${{ inputs.config }}
          config-file: ${{ inputs.config-file }}
          # Cypress.env values
          env: "${{ inputs.env }}"
          browser: ${{ inputs.browser }}
          # build: ${{ inputs.build }}
          command: ${{ inputs.command }}
          start: ${{ inputs.start }}
          start-windows: ${{ inputs.start-windows }}
          install: true
          install-command: ${{ inputs.install-command }}
          runTests: ${{ inputs.runTests }}
          wait-on: ${{ inputs.wait-on }}
          wait-on-timeout: ${{ inputs.wait-on-timeout }}
          working-directory: ${{ inputs.working-directory }}
          headed: ${{ inputs.headed }}
          spec: ${{ inputs.spec }}
          project: ${{ inputs.project }}
          command-prefix: ${{ inputs.command-prefix }}
          cache-key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
          quiet: ${{ inputs.quiet }}
          publish-summary: ${{ inputs.publish-summary }}

      # capture screenshots, videos, Mochawesome reports
      # in a single test artifact so that relative paths work
      # capture screenshots, videos, Mochawesome reports, coverage folder
      # https://github.com/actions/upload-artifact
      - uses: actions/upload-artifact@v4
        if: ${{ inputs.store-artifacts && always() }}
        with:
          name: cypress-split-results-e2e-${{ strategy.job-index }}
          path: |
            cypress/results
            ${{ inputs.split-file }}
          if-no-files-found: ignore

      - name: Extract branch name
        if: failure()
        shell: bash
        run: |
          # Short name for current branch. For PRs, use target branch (base ref)
          GIT_BRANCH=${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}
          echo "##[set-output name=branch;]$(echo ${GIT_BRANCH})"
        id: extract_branch
      - name: Get current time
        uses: josStorer/get-current-time@v2.1.2
        id: current-time
        with:
          format: YYYYMMDD-HH:mm
          utcOffset: "+08:00"
      - name: log in to gcp
        if: failure()
        uses: "google-github-actions/auth@v2"
        with:
          credentials_json: "${{ secrets.GCP_SHARED_KEY }}"
      - name: upload tests screenshots to bucket
        if: failure()
        uses: "google-github-actions/upload-cloud-storage@v2"
        with:
          path: "/home/runner/work/self-assessment-mf/self-assessment-mf/cypress/screenshots"
          destination: "self_assessment_mf_integration_tests_cypress_outputs-kov-test/${{ steps.extract_branch.outputs.branch }}/${{ steps.current-time.outputs.formattedTime }}"
      - name: upload tests videos to bucket
        if: failure()
        uses: "google-github-actions/upload-cloud-storage@v2"
        with:
          path: "/home/runner/work/self-assessment-mf/self-assessment-mf/cypress/videos"
          destination: "self_assessment_mf_integration_tests_cypress_outputs-kov-test/${{ steps.extract_branch.outputs.branch }}/${{ steps.current-time.outputs.formattedTime }}"
      - name: link to the tests
        if: failure()
        run: |
          # The pr tests should be in the following link.
          # The link structure is https://console.cloud.google.com/storage/browser/self_assessment_mf_integration_tests_cypress_outputs-kov-test/{{ ###BRANCH_NAME### }}
          echo The pr tests are in:
          echo https://console.cloud.google.com/storage/browser/self_assessment_mf_integration_tests_cypress_outputs-kov-test/${{ steps.extract_branch.outputs.branch }}/${{ steps.current-time.outputs.formattedTime }}

  # the N parallel Component testing jobs we create
  componentTests:
    if: ${{ inputs.nComponent > 0 }}
    needs: prepare
    runs-on: ubuntu-24.04
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.prepare.outputs.matrixComponent) }}
    env:
      FRONTEGG_AUTH_URL: https://auth.kov-test.notprod.me
      FRONTEGG_APPLICATION_ID: your-application-id
      RUNNING_IN_CYPRESS: true
      HOTJAR_ENABLED: false
      NODE_ENV: production
    steps:
      - name: Debug inputs 🐞
        if: ${{ inputs.debug-inputs }}
        env:
          WORKFLOW_INPUTS: ${{ toJson(inputs) }}
        run: echo "$WORKFLOW_INPUTS"

      - name: Checkout 🛎
        uses: actions/checkout@v4
      - name: enable corepack
        run: corepack enable
      - name: set yarn version
        run: yarn set version stable
      - name: Download the build folder
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist
      - uses: actions/cache@v4
        with:
          path: |
            ~/.cache/Cypress
            node_modules
          key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      # these containers will load balance all found tests among themselves
      - name: Cypress tests 🧪
        uses: cypress-io/github-action@v6
        # pass the machine index and the total number
        # https://github.com/bahmutov/cypress-split
        env:
          SPLIT: ${{ strategy.job-total }}
          SPLIT_INDEX: ${{ strategy.job-index }}
          # pass the custom list of specs if needed
          SPEC: "${{ inputs.spec }}"
          SKIP_SPEC: "${{ inputs.skip-spec }}"
          # pass the DEBUG environment variable
          DEBUG: ${{ inputs.debug }}
        # pass the rest of the commands via Cypress GH Action
        with:
          config: ${{ inputs.config }}
          config-file: ${{ inputs.config-file }}
          # Cypress.env values
          env: "${{ inputs.env }}"
          browser: ${{ inputs.browser }}
          # build: ${{ inputs.build }}
          command: ${{ inputs.command }}
          install: true
          install-command: ${{ inputs.install-command }}
          runTests: ${{ inputs.runTests }}
          working-directory: ${{ inputs.working-directory }}
          headed: ${{ inputs.headed }}
          spec: ${{ inputs.spec }}
          project: ${{ inputs.project }}
          command-prefix: ${{ inputs.command-prefix }}
          cache-key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
          quiet: ${{ inputs.quiet }}
          component: true

      # capture screenshots, videos, Mochawesome reports
      # in a single test artifact so that relative paths work
      # capture screenshots, videos, Mochawesome reports, coverage folder
      # https://github.com/actions/upload-artifact
      - uses: actions/upload-artifact@v4
        if: ${{ inputs.store-artifacts && always() }}
        with:
          name: cypress-split-results-component-${{ strategy.job-index }}
          path: cypress/results
          if-no-files-found: ignore

      - name: Extract branch name
        if: failure()
        shell: bash
        run: |
          # Short name for current branch. For PRs, use target branch (base ref)
          GIT_BRANCH=${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}
          echo "##[set-output name=branch;]$(echo ${GIT_BRANCH})"
        id: extract_branch
      - name: Get current time
        uses: josStorer/get-current-time@v2.1.2
        id: current-time
        with:
          format: YYYYMMDD-HH:mm
          utcOffset: "+08:00"
      - name: log in to gcp
        if: failure()
        uses: "google-github-actions/auth@v2"
        with:
          credentials_json: "${{ secrets.GCP_SHARED_KEY }}"
      - name: upload tests screenshots to bucket
        if: failure()
        uses: "google-github-actions/upload-cloud-storage@v2"
        with:
          path: "/home/runner/work/self-assessment-mf/self-assessment-mf/cypress/screenshots"
          destination: "self_assessment_mf_integration_tests_cypress_outputs-kov-test/${{ steps.extract_branch.outputs.branch }}/${{ steps.current-time.outputs.formattedTime }}"
      - name: upload tests videos to bucket
        if: failure()
        uses: "google-github-actions/upload-cloud-storage@v2"
        with:
          path: "/home/runner/work/self-assessment-mf/self-assessment-mf/cypress/videos"
          destination: "self_assessment_mf_integration_tests_cypress_outputs-kov-test/${{ steps.extract_branch.outputs.branch }}/${{ steps.current-time.outputs.formattedTime }}"
      - name: link to the tests
        if: failure()
        run: |
          # The pr tests should be in the following link.
          # The link structure is https://console.cloud.google.com/storage/browser/self_assessment_mf_integration_tests_cypress_outputs-kov-test/{{ ###BRANCH_NAME### }}
          echo The pr tests are in:
          echo https://console.cloud.google.com/storage/browser/self_assessment_mf_integration_tests_cypress_outputs-kov-test/${{ steps.extract_branch.outputs.branch }}/${{ steps.current-time.outputs.formattedTime }}

  merge-split-timings:
    # only merge timings if E2E specs were successful
    if: ${{ inputs.split-file }}
    needs: [e2eTests]
    outputs:
      timings: ${{ steps.merge.outputs.merged-timings }}
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout 🛎
        uses: actions/checkout@v4
      - name: enable corepack
        run: corepack enable
      - name: set yarn version
        run: yarn set version stable
      - uses: actions/cache@v4
        with:
          path: |
            ~/.cache/Cypress
            node_modules
          key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: Install dependencies 🧪
        uses: cypress-io/github-action@v6
        with:
          install: true
          runTests: false
          cache-key: cypress-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      # https://github.com/actions/download-artifact
      - uses: actions/download-artifact@v4
        # download all test results artifacts from the previous jobs
        # it would be nice to download only the split jobs test artifacts
        # but cannot specify the pattern of the test artifacts yet
        # https://github.com/actions/download-artifact/issues/103
        with:
          path: split-results
      - name: Display structure of downloaded files
        run: ls -R split-results

      # to merge timings you need v1.13+ of cypress-split
      - name: Merge split timings
        id: merge
        run: |
          npx cypress-split-merge \
            --parent-folder split-results \
            --split-file ${{ inputs.split-file }} \
            --output ${{ inputs.split-file }} \
            --set-gha-output merged-timings
        env:
          # pass the DEBUG environment variable
          DEBUG: ${{ inputs.debug }}

      - name: Print timings 🖨️
        run: |
          echo off
          echo Merged timings
          echo '${{ steps.merge.outputs.merged-timings }}'

      - uses: actions/upload-artifact@v4
        with:
          name: merged-split-file
          path: "${{ inputs.split-file }}"
```

### 5.3 PR Agent Automation (`/Users/admin/Projects/self-assessment-mf/.github/workflows/pr_agent.yml`)

```yaml
on:
  pull_request:
    types: [opened, reopened, ready_for_review]
  issue_comment:
jobs:
  pr_agent_job:
    if: ${{ github.event.sender.type != 'Bot' }}
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
      contents: write
    name: Run pr agent on every pull request, respond to user comments
    steps:
      - name: PR Agent action step
        id: pragent
        uses: qodo-ai/pr-agent@main
        env:
          OPENAI_KEY: ${{ secrets.OPENAI_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          github_action_config.auto_review: "true"
          github_action_config.auto_describe: "true"
```

### 5.4 Release Tagging (`/Users/admin/Projects/self-assessment-mf/.github/workflows/release.yml`)

```yaml
name: Release

on:
  pull_request:
    branches:
      - main
    types:
      - closed

jobs:
  build:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-24.04
    steps:
      - name: Tag
        uses: krogon/semver-release-action@master
        with:
          release_branch: main
          default_increment: patch
        env:
          GITHUB_TOKEN: ${{ secrets.SA_TOKEN }}
```

### 5.5 Slack Notifications (`/Users/admin/Projects/self-assessment-mf/.github/workflows/slack-notify.yml`)

```yaml
name: "Slack Notify"
on:
  workflow_call:
    inputs:
      message:
        type: string
      color:
        type: string
      icon:
        type: string
      repo-url:
        type: string
      repo-name:
        type: string
    secrets:
      slack-webhook:
        required: true

jobs:
  send-notification:
    name: Slack Notification
    runs-on: ubuntu-24.04
    steps:
      - name: Integration Test Failed
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_WEBHOOK: ${{ secrets.slack-webhook }}
          SLACK_CHANNEL: "platform-integration-tests"
          SLACK_USERNAME: Kingtegration Tests
          SLACK_ICON_EMOJI: ${{inputs.icon}}
          SLACK_FOOTER: <${{ inputs.repo-url }}|${{ inputs.repo-name }}>
          SLACK_MESSAGE: ${{ inputs.message }}
          SLACK_COLOR: ${{ inputs.color }}
```

---

## 6. Quick Reference

- Run `yarn lint-staged && yarn test:ci` before pushing.
- Keep `.env` aligned with `env.example`; CI expects the same keys as GitHub Secrets (`SA_TOKEN`, `GCP_SHARED_KEY`, `OPENAI_KEY`, `slack-webhook`, etc.).
- Update `cypress-split.yml` if test parallelism or envs change; `ci.yml` imports it directly.
- Use `yarn release` only when triggering semantic-release locally; normally `release.yml` handles tagging on merges to `main`.

This file now contains every relevant path plus the full source for each automation/config artifact so you can onboard quickly or audit CI/CD behaviour without hunting through the repo.
