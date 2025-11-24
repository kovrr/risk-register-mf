# Risk Register Microfrontend Setup Guide

## Overview

This is a microfrontend application for Risk Register management, built with React, TypeScript, and Module Federation. It provides standalone risk scenario management functionality that can be integrated into larger applications.

## Architecture

### Key Components
- **RemoteApp**: Main microfrontend component exposed via Module Federation
- **Risk Register**: Core risk scenario management interface
- **Scenario Management**: View and edit individual risk scenarios
- **Mock Service Worker (MSW)**: API mocking for development

### Technology Stack
- **React 18** with TypeScript
- **Module Federation** for microfrontend architecture
- **React Query** (@tanstack/react-query) for data fetching
- **Chakra UI** for component library
- **MSW** for API mocking
- **Rsbuild** for build tooling
- **Cypress** for testing

## Setup Instructions

### Prerequisites
- Node.js 20.18.x
- Yarn 4.0.0+

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd risk-register-mf
   yarn install
   ```

2. **Environment Configuration:**
   Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

   Key environment variables:
   ```env
   # Mock Configuration
   VITE_USE_MOCKS=true
   NEXT_PUBLIC_USE_MOCKS=true

   # Development Configuration
   VITE_DEV_ROCI_STATE=company_exists
   VITE_DEV_APPLICATION_TYPE=FOQUS
   VITE_DEV_APPLICATION_SUBTYPE=FOQUS
   VITE_DEV_RISK_REGISTER_GUEST_USER=false

   # Feature Toggles
   VITE_FEATURE_CRQ=false
   VITE_FEATURE_TEMPLATE=false
   VITE_FEATURE_REORGANIZE=false
   VITE_FEATURE_PRODUCT_TOUR=false
   ```

3. **Start Development Server:**
   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:3004`

### Mock Service Worker (MSW) Setup

The application uses MSW for API mocking in development. MSW is automatically enabled in development mode.

**Mock Configuration:**
- Mock handlers are defined in `src/mocks/data-handlers.ts` and `src/mocks/frontegg-handlers.ts`
- MSW intercepts API calls to `http://localhost:8000` and returns mock responses
- Mock data includes tenant information, risk register scenarios, and user authentication

**Key Mock Endpoints:**
- `GET /api/tenant` - Tenant information
- `GET /api/risk-scenarios` - Risk register scenarios
- `POST /api/risk-scenarios` - Create new scenarios
- `PUT /api/risk-scenarios/:id` - Update scenarios

## Application Structure

### Core Components

#### RemoteApp (`src/exposes/RemoteApp.tsx`)
Main microfrontend component with all necessary providers:
- **ChakraProvider**: Theme and UI components
- **QueryClientProvider**: React Query data fetching
- **ErrorBoundary**: Error handling
- **DemoExperienceContextProvider**: Demo mode functionality
- **InstanceWrapper**: HTTP client configuration
- **DefaultLayout**: Application layout wrapper

#### Risk Register Pages
- **RiskRegister** (`src/_pages/RiskRegister/index.tsx`): Main table view
- **ScenarioView** (`src/_pages/RiskRegister/ScenarioView`): Scenario details
- **ScenarioEdit** (`src/_pages/RiskRegister/ScenarioEdit`): Scenario editing

#### Wrappers and Providers
- **InstanceWrapper**: Configures Axios HTTP client with JWT authentication
- **ErrorBoundary**: Catches and handles React errors
- **DemoExperienceContextProvider**: Manages demo mode restrictions

### Services

#### React Query Configuration (`src/services/initQueryClient.tsx`)
- Configures retry logic (3 retries in development, disabled in Cypress)
- Disables refetch on window focus
- Provides consistent error handling

#### HTTP Client (`src/services/configureAxiosInstance.ts`)
- Configures Axios with base URL and authentication
- Handles JWT token management
- Provides interceptors for request/response handling

#### Mock Handlers (`src/mocks/`)
- **data-handlers.ts**: Main API endpoints (tenant, scenarios, etc.)
- **frontegg-handlers.ts**: Authentication-related endpoints
- **integrationHandlers.ts**: Third-party integration endpoints

## Module Federation Configuration

### Exposed Components
The microfrontend exposes:
- **RemoteApp**: Main application component
- **RemoteRoutes**: Route definitions for integration

### Integration
To integrate this microfrontend into a host application:

```typescript
// In host application
import RemoteApp from 'risk-register-mf/RemoteApp';

// Use in your application
<RemoteApp />
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: `Access to XMLHttpRequest at 'http://localhost:8000' has been blocked by CORS policy`

**Solution**:
- Ensure MSW is properly initialized
- Check that `VITE_USE_MOCKS=true` is set
- Verify mock handlers are correctly configured

#### 2. QueryClient Provider Error
**Problem**: `Uncaught Error: No QueryClient set, use QueryClientProvider to set one`

**Solution**:
- Ensure all React Query imports use `@tanstack/react-query` (not `react-query`)
- Verify QueryClientProvider wraps the application
- Check that `initQueryClient()` is called correctly

#### 3. Build Errors
**Problem**: Syntax errors with nullish coalescing operators

**Solution**:
- Add parentheses around mixed operators: `(a || b) ?? c`
- Ensure proper TypeScript configuration

#### 4. Mock Service Worker Not Working
**Problem**: Real API calls instead of mocks

**Solution**:
- Check console for MSW initialization logs
- Verify `mockServiceWorker.js` exists in `public/` directory
- Ensure MSW handlers match the API endpoints being called

### Debugging

#### Enable Debug Logging
Add to your `.env`:
```env
VITE_DEBUG_MOCKS=true
```

#### Check MSW Status
Open browser DevTools and look for:
- `🚀 Initializing MSW mocks...`
- `✅ MSW worker started`
- `[MSW] Mocking enabled.`

#### Verify Mock Handlers
Check Network tab in DevTools:
- Requests should show `(from ServiceWorker)`
- Status should be `200 OK`
- Response should contain mock data

### Development Commands

```bash
# Start development server
yarn dev

# Start with MSW explicitly enabled
yarn dev:msw

# Build for production
yarn build

# Run tests
yarn test

# Run component tests
yarn test:component

# Run E2E tests
yarn test:e2e

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Type checking
yarn type-check
```

## Environment Variables Reference

### Mock Configuration
- `VITE_USE_MOCKS`: Enable MSW mocks (default: true in development)
- `NEXT_PUBLIC_USE_MOCKS`: Alternative MSW flag for Next.js compatibility

### Development State
- `VITE_DEV_ROCI_STATE`: ROCI company state (`company_exists` or `no_company`)
- `VITE_DEV_APPLICATION_TYPE`: Application type (`FOQUS` or `ROCI`)
- `VITE_DEV_APPLICATION_SUBTYPE`: Application subtype
- `VITE_DEV_RISK_REGISTER_GUEST_USER`: Enable guest user mode

### Feature Toggles
- `VITE_FEATURE_CRQ`: Enable CRQ features
- `VITE_FEATURE_TEMPLATE`: Enable template features
- `VITE_FEATURE_REORGANIZE`: Enable reorganization features
- `VITE_FEATURE_PRODUCT_TOUR`: Enable product tour

### Testing
- `RUNNING_IN_CYPRESS`: Disable retries in Cypress tests

## API Integration

### Mock Data Structure

#### Tenant Response
```typescript
{
  id: string;
  name: string;
  feature_toggles: string[];
}
```

#### Risk Register Scenarios
```typescript
{
  data: RiskRegisterScenario[];
  pagination: {
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
}
```

### Real API Integration

When connecting to real APIs:
1. Update `src/services/configureAxiosInstance.ts` with correct base URL
2. Configure authentication headers
3. Disable MSW by setting `VITE_USE_MOCKS=false`
4. Update API endpoints in `src/services/hooks.ts`

## Contributing

### Code Style
- Use Biome for linting and formatting
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries

### Testing
- Write unit tests for utilities and hooks
- Use Cypress for E2E testing
- Mock external dependencies appropriately

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Run `yarn lint:fix` and `yarn type-check`
4. Submit PR with clear description

## Support

For issues and questions:
1. Check this documentation
2. Review console logs and error messages
3. Verify environment configuration
4. Check MSW status in DevTools
5. Contact the development team

## Changelog

### Recent Updates
- Fixed React Query import issues (migrated from `react-query` to `@tanstack/react-query`)
- Enhanced MSW configuration for better development experience
- Added comprehensive error handling and debugging
- Improved mock data structure and handlers
- Added proper TypeScript configuration and linting
