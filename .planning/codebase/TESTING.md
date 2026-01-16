# Testing Patterns

**Analysis Date:** 2026-01-16

## Test Framework

**Runner:**
- Not configured
- No test framework installed

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test scripts defined in package.json
```

## Current State

**Status:** No testing infrastructure exists

This is a fresh Next.js project created with `create-next-app`. No test files, test configuration, or testing dependencies are present.

## Recommended Setup

### Option 1: Jest + React Testing Library (Stable)

**Install:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

**Configure (`jest.config.ts`):**
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

**Setup file (`jest.setup.ts`):**
```typescript
import '@testing-library/jest-dom'
```

**Add to package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Option 2: Vitest (Modern, Fast)

**Install:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

**Configure (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
})
```

**Add to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Test File Organization

**Recommended Location:**
- Co-located with source: `app/page.test.tsx` next to `app/page.tsx`
- Or separate directory: `__tests__/app/page.test.tsx`

**Naming Convention:**
- `*.test.ts` or `*.test.tsx` for test files
- `*.spec.ts` or `*.spec.tsx` as alternative

**Recommended Structure:**
```
app/
├── page.tsx
├── page.test.tsx      # Co-located test
├── layout.tsx
└── layout.test.tsx
components/
├── Button.tsx
└── Button.test.tsx
__tests__/             # Alternative: separate test directory
├── integration/
└── e2e/
```

## Test Structure

**Recommended Suite Organization:**
```typescript
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('renders the Next.js logo', () => {
    render(<Home />)
    expect(screen.getByAltText('Next.js logo')).toBeInTheDocument()
  })
})
```

**Patterns:**
- Use `describe` blocks to group related tests
- Use `it` or `test` for individual test cases
- Descriptive test names: "renders X when Y"
- Arrange-Act-Assert pattern

## Mocking

**Recommended Framework:** Jest mocks or Vitest mocks (built-in)

**Patterns:**
```typescript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))
```

**What to Mock:**
- External API calls
- Next.js router/navigation
- Environment variables
- Date/time for deterministic tests

**What NOT to Mock:**
- React components under test
- Simple utility functions
- React Testing Library queries

## Fixtures and Factories

**Recommended Pattern:**
```typescript
// test/fixtures/user.ts
export const createUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
})
```

**Location:**
- `test/fixtures/` for shared test data
- Inline for simple, one-off test data

## Coverage

**Requirements:** Not enforced (no tests exist)

**Recommended Targets:**
- Statements: 70%+
- Branches: 60%+
- Functions: 70%+
- Lines: 70%+

**View Coverage:**
```bash
npm run test:coverage  # Once configured
```

## Test Types

**Unit Tests:**
- Test individual components in isolation
- Mock external dependencies
- Fast execution

**Integration Tests:**
- Test component interactions
- Test API routes with handlers
- May use real dependencies

**E2E Tests:**
- Playwright recommended for Next.js
- Test full user flows
- Run against actual app

**Playwright Setup (for E2E):**
```bash
npm install -D @playwright/test
npx playwright install
```

## Common Patterns

**Async Testing:**
```typescript
it('loads data and displays it', async () => {
  render(<AsyncComponent />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

**Error Testing:**
```typescript
it('displays error message on failure', async () => {
  // Mock API to return error
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.error()
    })
  )

  render(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

**Testing Server Components (Next.js 13+):**
```typescript
// Server components require async render
import { render } from '@testing-library/react'

it('renders server component', async () => {
  const Component = await ServerComponent()
  render(Component)

  expect(screen.getByText('Expected content')).toBeInTheDocument()
})
```

---

*Testing analysis: 2026-01-16*
