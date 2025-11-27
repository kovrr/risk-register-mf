# Risk-register-mf Microfrontend

A comprehensive Module Federation template built with Rsbuild, React, and TypeScript for micro-frontend architecture.

## 🚀 Features

- **Module Federation 2.0** - Modern micro-frontend architecture
- **React 18** with TypeScript support
- **Extensible Authentication Hooks** - ready for SSO integration
- **TanStack Query** - Powerful data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Cypress Testing** - Component and E2E testing
- **Biome** - Fast linting and formatting
- **NPM Package** - Publishable as a reusable micro-frontend module
- **GitHub Actions CI/CD** - Automated testing, building, and publishing

## 📋 Prerequisites

- Node.js 18+
- Yarn 4.6.0+
- Docker (optional, for local development)

## 🛠️ Setup

1. **Clone the template**
   ```bash
   git clone https://github.com/kovrr/mf-rspack-template.git
   cd mf-rspack-template
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Install Biome (Required)**

   **Option 1: Install Biome extension in VS Code**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Biome" by Biome
   - Install the extension

   **Option 2: Install Biome globally**
   ```bash
   npm install -g @biomejs/biome
   # or
   yarn global add @biomejs/biome
   ```

4. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start development server**
   ```bash
   yarn dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Development
RUNNING_IN_CYPRESS=false

# API Configuration
API_BASE_URL=https://api.your-domain.com

# Module Federation
REMOTE_ENTRY_URL=http://localhost:3003/remoteEntry.js
```

### Biome Configuration

The project includes a pre-configured `biome.json` with:
- Tab indentation
- Single quotes for strings
- Automatic import organization
- Recommended linting rules
- Format on save (VS Code extension)

### shadcn/ui Configuration

The template includes shadcn/ui components with:
- New York style variant
- Neutral color scheme
- CSS variables for theming
- Lucide React icons
- Pre-configured component aliases

### Module Federation Configuration

The template exposes two modules:
- `./Provider` - Main component with authentication wrapper
- `./remoteRoutes` - Route configuration for the shell app

## 📦 Available Scripts

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn start        # Start production server on port 3003

# Code Quality
yarn lint         # Run linter
yarn lint:fix     # Fix linting issues
yarn lint:ci      # CI linting with warnings as errors
yarn format       # Format code
yarn format:check # Check code formatting

# Testing
yarn test         # Run all Cypress tests
yarn test:open    # Open Cypress UI
yarn test:component # Run component tests
yarn test:e2e     # Run E2E tests
yarn test:ci      # Run tests in CI mode

# Utilities
yarn clean        # Clean build artifacts
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── atoms/           # Basic components (Button, Card)
│   ├── molecules/       # Composite components
│   └── wrappers/        # Context providers and wrappers
├── exposes/             # Module Federation exposed components
├── services/            # API and business logic
├── state/               # Global state management
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🔌 Module Federation

### Exposed Modules

1. **Provider Component** (`./Provider`)
   - Includes authentication wrapper
   - Ready-to-use component for shell apps

2. **Remote Routes** (`./remoteRoutes`)
   - Route configuration for integration
   - Supports dynamic routing

### Shared Dependencies

The following dependencies are shared across the federation:
- `react` & `react-dom`
- `react-router-dom`

## 🧪 Testing

### Component Testing
```bash
yarn test:component
```

### E2E Testing
```bash
yarn test:e2e
```

### Test Structure
- `cypress/component/` - Component tests
- `cypress/e2e/` - End-to-end tests
- `cypress/support/` - Test utilities and commands

## 🎨 UI Components

The template includes shadcn/ui components with:
- **Button** - Versatile button component with variants
- **Card** - Container component for content
- **ProviderComponent** - Main component with authentication

### Adding New Components

To add new shadcn/ui components:
```bash
npx shadcn@latest add <component-name>
```

## 📚 Integration Guide

### For Shell Applications

1. **Install the micro-frontend module**
   ```bash
   npm install risk-register-mf
   ```

2. **Configure Module Federation**
   ```typescript
   // In your shell app's webpack config
   new ModuleFederationPlugin({
     remotes: {
       'mf-template': 'mfTemplate@https://storage.googleapis.com/sme-shared-mf-assets/mf-rspack-template/latest/remoteEntry.js',
     },
   })
   ```

3. **Use the remote component**
   ```typescript
   import RemoteProvider from 'mf-template/Provider';
   import remoteRoutes from 'mf-template/remoteRoutes';
   ```

### Development Setup

For local development, you can link the package:
```bash
# In the template directory
npm link

# In your shell application
npm link risk-register-mf
```

### Production Usage

For production, the micro-frontend is automatically deployed to GCS bucket:
- **Latest version**: `https://storage.googleapis.com/sme-shared-mf-assets/mf-rspack-template/latest/remoteEntry.js`
- **Specific version**: `https://storage.googleapis.com/sme-shared-mf-assets/mf-rspack-template/{version}/remoteEntry.js`
- **Version info**: `https://storage.googleapis.com/sme-shared-mf-assets/mf-rspack-template/latest/version.json`

## 🔒 Security

- Environment variables for sensitive configuration
- Shared JWT token management utilities for host/remote apps
- Secure API communication with axios interceptors

## 🚀 Publishing

### Build for Production
```bash
yarn build
```

### Semantic Versioning

The project uses semantic versioning with automatic releases based on commit messages:

#### Commit Message Format
```bash
# Patch release (1.0.0 -> 1.0.1)
fix: resolve authentication issue

# Minor release (1.0.0 -> 1.1.0)
feat: add new component

# Major release (1.0.0 -> 2.0.0)
feat!: breaking change in API

# No release
docs: update README
```

#### Automatic Release Process
- **Main branch** - Automatically releases on push
- **Version bump** - Based on commit message prefixes
- **Changelog** - Automatically generated
- **NPM publish** - Automatic publishing to NPM
- **GitHub release** - Automatic GitHub release creation

### Manual Release
```bash
yarn release
```

### Install in Other Projects
```bash
npm install risk-register-mf
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions CI/CD pipeline with the following features:

### Pipeline Stages

1. **Branch Check** - Validates branch naming conventions
2. **Pre-commit Checks** - Runs lint-staged, formatting, and linting checks
3. **Cypress Testing** - Parallel E2E and component testing with timing optimization
4. **Build & Deploy** - Builds the application and uploads to GCS bucket for Module Federation
5. **Semantic Release** - Automatic versioning and NPM publishing based on commit messages
6. **Quality Assurance** - Comprehensive code quality checks

### Required Secrets

Configure the following secrets in your GitHub repository:

```bash
# Authentication
SA_TOKEN=your-service-account-token
GCP_SHARED_KEY=your-gcp-service-account-key

# NPM Publishing
NPM_TOKEN=your-npm-auth-token

# Testing Environment
MF_RSPACK_TEMPLATE_TESTING_USER_EMAIL=test@example.com
MF_RSPACK_TEMPLATE_TESTING_USER_PASSWORD=test-password

# Notifications
SLACK_WEBHOOK=your-slack-webhook-url
```

### Workflow Files

- `.github/workflows/ci.yml` - Main CI/CD pipeline
- `.github/workflows/cypress-split.yml` - Parallel Cypress testing with timing optimization
- `.github/workflows/slack-notify.yml` - Slack notifications for test failures

### Local Development

For local development without the full CI pipeline:

```bash
# Run tests
yarn test:ci

# Build and start for CI
yarn build
yarn start:ci

# Lint and format
yarn lint:ci
yarn format:check

# Install pre-commit hooks (requires Node.js 18+)
yarn install
yarn prepare
```

### Pre-commit Hooks

The project includes pre-commit hooks that automatically:
- ✅ **Lint staged files** using `yarn lint:fix`
- ✅ **Format code** using `yarn format`
- ✅ **Validate commit messages** for semantic versioning
- ✅ **Check for errors** before commits

**Note**: Pre-commit hooks require Node.js 18+ for local development. The CI pipeline runs these checks automatically using the existing yarn commands.

## 🤝 Contributing

1. Follow the existing code style (Biome configuration)
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

[Your Company License]

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki
