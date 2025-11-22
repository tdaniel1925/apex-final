# Quality Assurance Guide

This document outlines all quality assurance measures implemented in the Apex Affinity Group MLM Platform.

## Table of Contents

1. [Code Quality Tools](#code-quality-tools)
2. [Testing Infrastructure](#testing-infrastructure)
3. [Pre-Commit Hooks](#pre-commit-hooks)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Error Monitoring](#error-monitoring)
6. [Type Safety](#type-safety)
7. [Security Measures](#security-measures)

## Code Quality Tools

### ESLint

Configured with strict rules for Next.js, TypeScript, and security best practices.

**Run linting:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint -- --fix
```

**Key Rules:**
- No `any` types allowed (`@typescript-eslint/no-explicit-any: error`)
- Console logs are warnings (except `console.warn` and `console.error`)
- Security plugin enabled to catch common vulnerabilities
- React hooks rules enforced

### Prettier

Ensures consistent code formatting across the entire codebase.

**Check formatting:**
```bash
npm run format:check
```

**Auto-format all files:**
```bash
npm run format
```

**Configuration:**
- Single quotes
- No semicolons
- 2-space indentation
- 100 character line width
- Tailwind CSS class sorting enabled

### Type Coverage

Enforces 95% type coverage to ensure TypeScript is used effectively.

**Check type coverage:**
```bash
npm run type-coverage
```

**Configuration:** (see `type-coverage.json`)
- Minimum 95% type coverage required
- Strict mode enabled
- Test files excluded
- Configuration files excluded

### Dependency Management

**Check for outdated dependencies:**
```bash
npm run deps:check
```

**Update dependencies (interactive):**
```bash
npm run deps:update
```

**Configuration:** (see `.ncurc.json`)
- React versions are pinned for stability
- Only minor version updates by default
- Automatic testing after updates (`doctor` mode)

## Testing Infrastructure

### Unit Tests (Vitest)

Fast, modern unit testing with React Testing Library.

**Run unit tests:**
```bash
npm run test:unit
```

**Run tests in watch mode:**
```bash
npm test
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Coverage Requirements:**
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

**Test Files:** `**/*.test.ts`, `**/*.test.tsx`

### Integration Tests

Test how different parts of the system work together.

**Run integration tests:**
```bash
npm run test:integration
```

**Test Files:** `tests/integration/**/*.test.ts`

### E2E Tests (Playwright)

Test complete user workflows across multiple browsers.

**Run E2E tests:**
```bash
npm run test:e2e
```

**Browsers Tested:**
- Desktop: Chrome, Firefox, Safari
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)

**Features:**
- Automatic retry on failure (2 retries in CI)
- Screenshots on failure
- Video recording on first retry
- HTML test report

### Feature Tests

Custom framework for comprehensive feature validation.

**Run all feature tests:**
```bash
npm run test:features
```

**Run critical path tests only:**
```bash
npm run test:features:critical
```

**Watch mode:**
```bash
npm run test:features:watch
```

**Test Categories:**
- Authentication
- User Management
- Matrix Placement
- Commission Calculation
- Payments
- Genealogy
- Reporting

### Security Tests

Specialized tests for security vulnerabilities.

**Run security tests:**
```bash
npm run test:security
```

**Includes:**
- npm audit for dependency vulnerabilities
- Security-specific integration tests
- SQL injection prevention tests
- XSS protection tests
- CSRF token validation
- Authentication/authorization tests

### Load Tests (k6)

Performance testing for critical paths.

**Run load tests:**
```bash
npm run test:load
```

**Scenarios:**
- Commission calculation under load
- Matrix placement concurrency
- Database query performance
- API endpoint stress tests

### Regression Suite

Automated regression testing that runs after every build.

**Files:**
- `tests/regression/regression-suite.ts` - Main suite
- Runs all feature tests automatically
- Compares results with baseline

## Pre-Commit Hooks

Husky is configured to run checks before every commit.

### What Gets Checked:

1. **Staged JavaScript/TypeScript files:**
   - ESLint with auto-fix
   - Prettier formatting

2. **Staged JSON/Markdown files:**
   - Prettier formatting

### Setup:

Hooks are installed automatically when running `npm install`.

**Manual setup:**
```bash
npm run prepare
```

### Bypass Hooks (Emergency Only):

```bash
git commit --no-verify
```

**Note:** Only use this in emergencies. CI will still catch issues.

## CI/CD Pipeline

GitHub Actions workflow runs on every push and pull request.

### Jobs:

#### 1. Lint & Type Check
- ESLint validation
- TypeScript type checking
- Code formatting check
- Type coverage verification

#### 2. Unit Tests
- Run all unit tests
- Generate coverage report
- Upload to Codecov

#### 3. Feature Tests
- Run all feature tests
- Run critical path tests separately

#### 4. E2E Tests
- Install Playwright browsers
- Run E2E tests across all browsers
- Upload test reports

#### 5. Security
- npm audit
- Security-specific tests
- Dependency vulnerability check

#### 6. Build
- Build Next.js application
- Verify environment variables
- Upload build artifacts

#### 7. Deploy Preview (Pull Requests)
- Deploy to Vercel preview environment
- Automatic URL generation

#### 8. Deploy Production (Main Branch)
- Deploy to Vercel production
- Only runs after all tests pass

### Required Secrets:

Add these to your GitHub repository secrets:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### Workflow File:

`.github/workflows/ci.yml`

## Error Monitoring

Sentry is configured for both client and server-side error tracking.

### Setup:

1. **Create Sentry account:** https://sentry.io
2. **Create new project:** Select Next.js
3. **Add environment variables:**
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
   SENTRY_AUTH_TOKEN=your_token_here
   ```

### Features:

**Client-side** (`sentry.client.config.ts`):
- Automatic error capture
- Performance monitoring
- Session replay
- PII filtering (passwords, SSNs, tax IDs)

**Server-side** (`sentry.server.config.ts`):
- API error tracking
- Database query monitoring
- Sensitive environment variable filtering

### Privacy Protection:

Automatically filters:
- Passwords
- SSNs
- Tax IDs
- API keys
- Database credentials

## Type Safety

### TypeScript Configuration

**Strict mode enabled** with additional checks:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

**Check types:**
```bash
npm run type-check
```

### Zod Schemas

Runtime validation for all data:
- Form inputs
- API requests/responses
- Database queries
- Environment variables

**Example:**
```typescript
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive()
})

type User = z.infer<typeof UserSchema>
```

## Security Measures

### 1. Input Validation

- All user inputs validated with Zod schemas
- SQL injection prevention with parameterized queries
- XSS prevention with React's built-in escaping

### 2. Authentication

- Supabase Auth with Row Level Security (RLS)
- JWT tokens with short expiration
- Secure cookie handling
- Session management

### 3. Authorization

- Role-based access control (RBAC)
- Resource-level permissions
- Database-level RLS policies

### 4. Data Protection

- Passwords hashed with bcrypt
- Sensitive data encrypted at rest
- HTTPS-only in production
- Secure headers configured

### 5. Payment Security

- PCI compliance via Stripe
- No credit card data stored locally
- Stripe Connect for secure payouts
- Webhook signature verification

### 6. Dependency Security

- Regular npm audit runs
- Automated vulnerability scanning
- Dependency update checks
- Security patch monitoring

## Quick Reference

### Daily Development:

```bash
# Start development
npm run dev

# Run tests while coding
npm test

# Check everything before pushing
npm run lint && npm run type-check && npm run test:unit
```

### Pre-Deployment:

```bash
# Run full test suite
npm run test:unit
npm run test:integration
npm run test:features
npm run test:e2e

# Verify build
npm run build

# Check security
npm run test:security
```

### Continuous Monitoring:

```bash
# Check dependency health
npm run deps:check

# Verify type coverage
npm run type-coverage

# Check database status
npm run db:status
```

## Best Practices

1. **Write tests first** - TDD helps catch bugs early
2. **Keep coverage high** - Aim for >80% on all metrics
3. **Update dependencies regularly** - Security patches are critical
4. **Monitor Sentry** - Review errors daily
5. **Run CI locally** - Don't rely solely on GitHub Actions
6. **Document security decisions** - Make threat models explicit
7. **Review audit logs** - Track sensitive operations
8. **Test edge cases** - Don't just test the happy path

## Troubleshooting

### Tests Failing in CI but Passing Locally:

1. Check Node version (`.nvmrc` specifies 18.17.0)
2. Clear npm cache: `npm ci`
3. Check environment variables
4. Review test isolation issues

### Type Coverage Below 95%:

1. Run `npm run type-coverage` to see details
2. Add explicit types to untyped code
3. Use `unknown` instead of `any`
4. Add JSDoc types for `.js` files

### Pre-Commit Hook Failing:

1. Run manually: `npm run lint -- --fix`
2. Run manually: `npm run format`
3. Stage fixed files: `git add .`
4. Commit again

### Sentry Not Capturing Errors:

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check Sentry project settings
3. Review `beforeSend` filters
4. Test with manual error: `throw new Error('test')`

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [ESLint Rules](https://eslint.org/docs/rules)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
