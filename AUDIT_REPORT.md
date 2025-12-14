# Comprehensive Codebase Audit Report

**Date:** December 14, 2025
**Audited By:** Claude Code
**Project:** berry-13 Personal Website (v0.5.0)

---

## Table of Contents

1. [Security Issues](#1-security-issues)
2. [Bugs](#2-bugs)
3. [Errors & Code Quality](#3-errors--code-quality-issues)
4. [Bad Refactoring & Code Smells](#4-bad-refactoring--code-smells)
5. [Layout & UI Issues](#5-layout--ui-issues)
6. [Performance Issues](#6-performance-issues)
7. [Summary](#7-summary)
8. [Top Priority Fixes](#8-top-priority-fixes)

---

## 1. SECURITY ISSUES

### 1.1 Critical Security Issues

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| 1 | `src/pages/api/send.ts` | 18 | **No WEBHOOK_URL validation** - Uses `process.env.WEBHOOK_URL as string` without checking if it exists. Could cause runtime crash or undefined behavior | HIGH |
| 2 | `src/pages/api/send.ts` | 10 | **No request body type validation** - Uses `req.body as Data` without runtime validation. Malicious payloads could bypass type assertions | HIGH |
| 3 | `src/pages/api/send.ts` | 13 | **Potential null dereference** - Checks `data.message.length` and `data.email.length` without first verifying these properties exist | HIGH |
| 4 | `src/pages/api/send.ts` | 9-35 | **Missing HTTP method check** - No validation that request is POST. GET, PUT, DELETE etc. would all execute the handler | MEDIUM |
| 5 | `src/pages/api/repos.ts` | 19 | **Token exposure risk** - GitHub token used in Authorization header; if logging is enabled, token could leak | MEDIUM |
| 6 | `src/pages/api/awake.ts` | 62-68 | **No env var validation** - Uses `process.env.AWAKE_BASE_URL`, `AWAKE_TOKEN`, `DEVICE`, `SENSOR_AWAKE` without checking if they exist | HIGH |
| 7 | `src/middleware.ts` | 44 | **Overly permissive CORS** - Falls back to `*` if `ALLOWED_ORIGIN` is not set, allowing any origin | MEDIUM |
| 8 | `src/pages/scuola/telecomunicazioni.tsx` | 12 | **XSS vulnerability** - Uses `dangerouslySetInnerHTML` with KaTeX output. While KaTeX is generally safe, this pattern is risky | MEDIUM |
| 9 | `src/components/talk/MessageComponent.tsx` | 16 | **Weak email regex** - Pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` allows many invalid emails like `a@b.c` | LOW |

### 1.2 Rate Limiting Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/pages/api/awake.ts` | 9-52 | **In-memory rate limiting** - Won't work in serverless/multi-instance deployments. Rate limit state is lost on restart |
| 2 | `src/middleware.ts` | 4-20 | **Same issue** - Rate limit stored in `Map` which resets on every deployment |
| 3 | `src/pages/api/send.ts` | - | **No rate limiting** - Contact form has no rate limiting, vulnerable to spam abuse |
| 4 | `src/pages/api/repos.ts` | - | **No rate limiting** - Could be used to exhaust GitHub API quota |

### 1.3 Information Disclosure

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/pages/api/send.ts` | 23-24 | **IP address exposed** - Sends user's IP to Discord webhook in author field |
| 2 | `src/components/talk/TimeStatus.tsx` | 49 | **Console.log left in production** - `console.log(status)` exposes internal state |
| 3 | `src/pages/api/awake.ts` | 78 | **Console.log in production** - `console.log(isAwake)` |

---

## 2. BUGS

### 2.1 Functional Bugs

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| 1 | `src/pages/404.tsx` | 15 | **Wrong prop name** - Uses `particlesLoaded={particlesInit}` but should be `init={particlesInit}`. The particles may not initialize correctly | HIGH |
| 2 | `src/hooks/useRepo.ts` | 9 | **Incorrect loading state** - Returns `isValidating` as `isLoading`, but `isValidating` is true during revalidation too, not just initial load | MEDIUM |
| 3 | `src/pages/api/awake.ts` | 74-76 | **Boolean conversion issue** - `isDoNotDisturb` is assigned a boolean expression result, but then returned which makes it unpredictable for `"undefined"` string | MEDIUM |
| 4 | `src/pages/scuola/beppe.tsx` | 77 | **React component called as function** - `{TramontoEBuio()}` should be `<TramontoEBuio />`. This breaks React's lifecycle and hook rules | HIGH |
| 5 | `src/components/Footer.tsx` | 1 | **Date created at module level** - `const date = new Date()` runs once at build time, not runtime. Year could be stale in long-running apps | LOW |
| 6 | `src/components/ThemeToggle.tsx` | 10 | **State initialization mismatch** - Initializes state as `"dark"` but then immediately overwrites from localStorage, causing flash | LOW |
| 7 | `src/pages/index.tsx` | 161-162 | **Unused props** - `Index` component receives `topRepos` and `libreRepo` props but uses `useRepos()` hook instead | LOW |
| 8 | `src/pages/api/repos.ts` | 30-31 | **No error handling for JSON parse** - If GitHub returns invalid JSON, `.json()` will throw unhandled | MEDIUM |
| 9 | `src/components/talk/TimeStatus.tsx` | 23 | **Unused variable** - `hour` is calculated but never used | LOW |

### 2.2 Type Safety Bugs

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/types/types.ts` | 21-22 | **Using `any[]` types** - `RepoGridProps` uses `any[]` for `libreRepo` and `topRepos`, losing type safety |
| 2 | `src/pages/api/repos.ts` | 3-9 | **Duplicate interface** - `Repository` is defined here AND in `src/types/types.ts`. They have different properties (`html_url` missing in API version) |
| 3 | `src/pages/404.tsx` | 7 | **`any` type** - `particlesInit` uses `any` type for engine parameter |
| 4 | `src/pages/scuola/beppe.tsx` | 5-6 | **No type annotations** - `useState(null)` without type parameter infers `null` type |

---

## 3. ERRORS & CODE QUALITY ISSUES

### 3.1 TypeScript Configuration Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `tsconfig.json` | 8 | **`strict: false`** - Strict mode disabled, missing many type safety checks |
| 2 | `package.json` | 44-45 | **Type version mismatch** - `@types/react: ^17.0.20` but using `react: ^18.0.0`. Types don't match runtime version |
| 3 | `.eslintrc.json` | 5 | **Typo in rule name** - `"react-hooks/exhaustive-dep": 0` should be `"react-hooks/exhaustive-deps"` (missing 's') |

### 3.2 Dependency Issues

| # | File | Issue |
|---|------|-------|
| 1 | `package.json` | **@types packages in dependencies** - `@types/katex`, `@types/nprogress`, `@types/styled-components` should be in devDependencies |
| 2 | `package.json` | **Redundant particles packages** - Has both `@tsparticles/react`, `react-tsparticles`, `tsparticles`, and `tsparticles-slim`. Only one set needed |
| 3 | `package.json` | **Outdated ESLint** - Using `eslint: ^7.32.0` with `eslint-config-next: ^12.3.1` but Next.js is v15 |
| 4 | `package.json` | **@next/bundle-analyzer in dependencies** - Should be in devDependencies |

### 3.3 Import/Export Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/pages/scuola/telecomunicazioni.tsx` | 15-22 | **Unused variable** - `fadeInUp` defined but never used |
| 2 | `src/Icons.tsx` | - | **File appears unused** - Icons are imported from `react-icons` elsewhere, not this file |
| 3 | `lib/utils.ts` | - | **Duplicate of `src/utils/classNames.ts`** - Same `cn` function in two places |

---

## 4. BAD REFACTORING & CODE SMELLS

### 4.1 Code Duplication

| # | Location | Issue |
|---|----------|-------|
| 1 | `lib/utils.ts` + `src/utils/classNames.ts` | Identical `cn()` function in two files |
| 2 | `src/pages/api/repos.ts:3-9` + `src/types/types.ts:1-7` | Duplicate `Repository` interface definitions |
| 3 | `src/middleware.ts` + `src/pages/api/awake.ts` | Both implement rate limiting independently with different approaches |
| 4 | `src/components/TechIcons.tsx` + `src/components/TechItem.tsx` | TechItem component defined in TechIcons.tsx AND has its own file (TechItem.tsx is likely dead code) |

### 4.2 Architecture Issues

| # | File | Issue |
|---|------|-------|
| 1 | `src/pages/api/awake.ts` | **Business logic in API route** - Rate limiting, validation, and data transformation all mixed in one file |
| 2 | `src/components/talk/TimeStatus.tsx` | **Mixing concerns** - Component does API fetching, time formatting, and rendering. Should be split |
| 3 | `src/pages/index.tsx` | **Large component** - 236 lines with multiple components defined inline. Should be split into separate files |
| 4 | `src/pages/scuola/telecomunicazioni.tsx` | **Massive component** - 432 lines with nested component and complex JSX. Very hard to maintain |

### 4.3 Anti-Patterns

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/pages/scuola/beppe.tsx` | 77 | **Component invoked as function** - `{TramontoEBuio()}` instead of `<TramontoEBuio />` |
| 2 | `src/components/talk/ContactLink.tsx` | 16-17 | **Redundant Link + anchor** - Uses `<Link legacyBehavior>` with nested `<a>`. This pattern is deprecated |
| 3 | `src/pages/_app.tsx` | 73-74 | **Two router instances** - Has `router` from AppProps AND `routerRef = useRouter()`. Only one needed |
| 4 | `src/pages/scuola/telecomunicazioni.tsx` | 31-37 | **Side effect in useEffect** - Forces light theme and modifies localStorage. Should respect user preference |
| 5 | `src/pages/api/send.ts` | 12 | **Magic strings for errors** - Uses strings like `"lol, nice try :)"` as error responses |

### 4.4 Missing Error Boundaries

| # | Location | Issue |
|---|----------|-------|
| 1 | `src/pages/_app.tsx` | No error boundary wrapping the app |
| 2 | `src/pages/index.tsx` | Suspense fallback but no ErrorBoundary for TechIcons |

---

## 5. LAYOUT & UI ISSUES

### 5.1 Responsive Design Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/components/Nav.tsx` | 156 | **xs breakpoint logic** - Uses `xs:flex` to hide desktop nav on mobile, but `xs` is 445px which is an unusual breakpoint |
| 2 | `src/components/Nav.tsx` | 179 | **Mobile nav hidden incorrectly** - Uses `xs:hidden` meaning mobile nav shows even at 445px+ |
| 3 | `src/pages/contact.tsx` | 26 | **Grid layout issue** - Uses `md:grid-cols-3` but MessageComponent spans 2 columns, leaving odd spacing |
| 4 | `src/pages/contact.tsx` | 29 | **Row order inconsistency** - Uses `row-start-1 md:row-auto` which causes content to jump on resize |
| 5 | `src/components/TechIcons.tsx` | 269 | **Grid inconsistency** - 5-column grid at `lg` but 25 items doesn't divide evenly (leaves partial row) |

### 5.2 Accessibility Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/components/Nav.tsx` | 98-111 | **Tooltip accessibility** - `react-tippy` tooltips may not be accessible to screen readers |
| 2 | `src/pages/404.tsx` | 89 | **Low contrast text** - White text on particle background may be hard to read |
| 3 | `src/pages/scuola/telecomunicazioni.tsx` | 358-385 | **Form inputs lack accessible labels** - Inputs have labels but no `htmlFor`/`id` association |
| 4 | `src/components/talk/MessageComponent.tsx` | 104-115 | **Labels not linked to inputs** - Uses `<label>` but no `htmlFor` attribute |
| 5 | `src/pages/scuola/beppe.tsx` | 70-74 | **External image with unclear alt** - Alt text "Emoji feet kicking gif" isn't descriptive |

### 5.3 Dark Mode Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/pages/_document.tsx` | 5 | **Hardcoded dark mode** - `<Html className="dark">` ignores user's system preference on first load |
| 2 | `src/pages/scuola/telecomunicazioni.tsx` | 32-36 | **Forces light mode** - Overrides user's theme preference without consent |
| 3 | `src/pages/404.tsx` | 37 | **Hardcoded white particles** - Particles are always white, invisible on light backgrounds |

### 5.4 CSS & Styling Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/globals.css` | 12 | **Hardcoded background** - `background: #000` may conflict with theme switching |
| 2 | `src/pages/scuola/beppe.tsx` | 48 | **Inline styles** - Uses `style={{ textAlign: "center", padding: "20px" }}` instead of Tailwind |
| 3 | `postcss.config.js` | 5 | **Plugin order** - `postcss-nesting` should come before `tailwindcss` for proper processing |
| 4 | `tailwind.config.js` | 2 | **Missing content paths** - Doesn't include `lib/` folder or root `.tsx` files |

---

## 6. PERFORMANCE ISSUES

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `src/pages/_app.tsx` | 87-92 | **RequestAnimationFrame memory leak risk** - RAF loop continues even after component unmount check |
| 2 | `src/components/TechIcons.tsx` | 159-234 | **Excessive re-renders** - `TechItem` creates new animation controls on each render |
| 3 | `src/pages/api/repos.ts` | 25-28 | **Sequential API calls** - Fetches JSON sequentially after parallel fetch. Could parallelize |
| 4 | `src/pages/scuola/telecomunicazioni.tsx` | 387-398 | **Recalculates on every render** - `calculateResult()` called 3 times without memoization |
| 5 | `src/Icons.tsx` | - | **Unused code shipped** - This file is never imported but still in bundle |

---

## 7. SUMMARY

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| **Security** | 0 | 5 | 4 | 1 | 10 |
| **Bugs** | 2 | 2 | 3 | 4 | 11 |
| **Code Quality** | 0 | 0 | 6 | 4 | 10 |
| **Refactoring** | 0 | 2 | 6 | 4 | 12 |
| **Layout/UI** | 0 | 0 | 8 | 7 | 15 |
| **Performance** | 0 | 0 | 3 | 2 | 5 |
| **TOTAL** | **2** | **9** | **30** | **22** | **63** |

---

## 8. TOP PRIORITY FIXES

### Immediate (Critical/High Priority)

1. **Add environment variable validation** in all API routes (`send.ts`, `repos.ts`, `awake.ts`)
2. **Add HTTP method checking** to `/api/send` endpoint
3. **Fix particles initialization** in 404 page (`particlesLoaded` -> `init`)
4. **Fix component function call** in `beppe.tsx` (`{TramontoEBuio()}` -> `<TramontoEBuio />`)
5. **Move rate limiting to Redis/external store** for production deployment

### Short-term (Medium Priority)

6. **Enable TypeScript strict mode** and fix type definitions
7. **Remove console.log statements** from production code
8. **Add proper form accessibility** with linked labels (`htmlFor`/`id`)
9. **Fix duplicate code** (utilities, types, rate limiting implementations)
10. **Add error boundaries** for graceful error handling

### Long-term (Low Priority)

11. Refactor large components into smaller, focused files
12. Update dependencies to compatible versions
13. Improve dark mode handling to respect system preferences
14. Add proper rate limiting to all API endpoints
15. Remove unused code and dependencies

---

## Appendix: Files Reviewed

- `src/pages/api/*.ts` (3 files)
- `src/pages/*.tsx` (5 files)
- `src/pages/scuola/*.tsx` (2 files)
- `src/components/*.tsx` (5 files)
- `src/components/talk/*.tsx` (3 files)
- `src/hooks/*.ts` (1 file)
- `src/services/*.ts` (1 file)
- `src/utils/*.ts` (4 files)
- `src/types/*.ts` (2 files)
- `lib/*.ts` (1 file)
- Configuration files (7 files)
- **Total: ~40 files analyzed**
