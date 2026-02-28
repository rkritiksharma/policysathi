---
description: PolicySathi Developer Rulebook — KISS & DRY standards for a 10+ year senior engineer workflow
---

# 📖 PolicySathi Developer Rulebook

> **Philosophy:** Write code like a 10+ year senior developer — simple, predictable, zero duplication, and built for the long term.

---

## 1. 🏗️ Project Architecture Rules

### 1.1 Directory Structure (Follow Strictly)
```
app/                   → Routes + Server Actions (co-located)
  (dashboard)/         → Protected dashboard routes (route group)
  api/                 → API routes only (auth, webhooks, cron)
  login/ signup/       → Public auth pages
components/            → Reusable UI components
  ui/                  → Primitive shadcn/Radix components (DO NOT edit directly)
  landing/             → Landing page sections
  tables/              → Table-specific components
hooks/                 → Custom React hooks
lib/                   → Utilities, configs, clients
  supabase/            → Supabase client/server/middleware
types/                 → Shared TypeScript types/interfaces
```

### 1.2 File Naming
| Type | Convention | Example |
|------|-----------|---------|
| Component | `PascalCase.tsx` | `PolicyForm.tsx` |
| Hook | `camelCase.ts` prefixed with `use` | `useKeyboardShortcuts.ts` |
| Server Action | `actions.ts` (co-located in route folder) | `app/(dashboard)/policies/actions.ts` |
| Utility | `camelCase.ts` | `utils.ts` |
| Type definition | `index.ts` inside `types/` | `types/index.ts` |

### 1.3 Component Size Limit (**KISS**)
- **Max 200 lines per component.** If a component exceeds 200 lines, it **MUST** be split.
- `PolicyForm.tsx` (721 lines) → Split into: `PolicyFormSteps/Step1BasicInfo.tsx`, `Step2VehicleDetails.tsx`, `Step3Payment.tsx`, etc.
- Extract repeated JSX blocks into small, focused sub-components.

---

## 2. 🔒 TypeScript Rules (Zero `any`)

### 2.1 Never Use `any`
```typescript
// ❌ BAD
const [user, setUser] = useState<any>(null)
customers: any
column: any

// ✅ GOOD
const [user, setUser] = useState<UserData | null>(null)
customers: Customer
column: Column<TData, TValue>
```

### 2.2 All Types in `types/index.ts`
- Every shared interface/type goes in `types/index.ts`.
- Domain types that are only used in one file can stay inline, but prefer centralized.
- **No ad-hoc interfaces** scattered across component files (e.g., `PolicyNotification` in `Header.tsx` should be in `types/`).

### 2.3 Server Action Return Types
```typescript
// ✅ Define consistent return shape
type ActionResult<T> = {
  data: T | null
  error: string | null
  count?: number
}

// ✅ Use it everywhere
export async function getCustomers(...): Promise<ActionResult<Customer[]>> { }
export async function getPolicies(...): Promise<ActionResult<Policy[]>> { }
```

### 2.4 FormData Extraction Helper (**DRY**)
```typescript
// ✅ Create once in lib/utils.ts, use everywhere
export function getFormString(formData: FormData, key: string): string {
  return (formData.get(key) as string)?.trim() || ''
}

// Instead of repeating this in every action:
// const name = (formData.get('name') as string).trim()
```

---

## 3. 🔐 Authentication & Supabase Rules

### 3.1 Single Auth Check Pattern (**DRY**)
Every server action starts with auth check. **Extract it:**
```typescript
// lib/supabase/auth.ts
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  return { supabase, user }
}

// ✅ Usage in any action:
export async function deleteCustomer(id: string) {
  const { supabase, user } = await getAuthenticatedUser()
  // ...rest of logic
}
```

### 3.2 No Duplicate Supabase Client Creation
- **Root middleware (`middleware.ts`)** — use `lib/supabase/middleware.ts` `updateSession()`. Don't write inline Supabase client creation in `middleware.ts`.
- **Client components** → `lib/supabase/client.ts`
- **Server actions** → `lib/supabase/server.ts`
- **Middleware** → `lib/supabase/middleware.ts`

### 3.3 User Data: Fetch Once, Share via Context (**DRY**)
Currently user is fetched in **both** `Header.tsx` AND `(dashboard)/layout.tsx` via `/api/auth/me`.

**Fix:** Create a `UserProvider` context:
```typescript
// components/UserProvider.tsx
const UserContext = createContext<UserData | null>(null)
export function UserProvider({ children }) { /* fetch once */ }
export function useUser() { return useContext(UserContext) }
```
Then consume `useUser()` in Header, DashboardLayout, or anywhere else. **One fetch, shared everywhere.**

---

## 4. 🧹 Code Hygiene Rules

### 4.1 No Dead Code in Production
- **Delete** `lib/mockAuth.ts` — it's mock code not used in production.
- **Delete** stub functions that return empty arrays:
  ```typescript
  // ❌ Remove these or implement them
  export async function getCustomerCommunications(): Promise<any[]> { return [] }
  export async function getCustomerTasks(): Promise<any[]> { return [] }
  ```
- If a feature isn't ready, **don't ship the skeleton function.** Implement it when needed.

### 4.2 No Unused Imports
```typescript
// ❌ BAD (in layout.tsx)
import { Geist, Geist_Mono } from "next/font/google"  // Loaded but NOT used in body
import { Inter, Playfair_Display } from "next/font/google"  // These are used

// ✅ Remove Geist/Geist_Mono entirely
```

### 4.3 Console Statements
- `console.error()` → **Only for actual error paths** (catch blocks).
- `console.log()` → **Never commit** to production code. Use proper error tracking.
- `console.warn()` → Use sparingly, only for recoverable issues.

### 4.4 No `suppressHydrationWarning`
**Never use `suppressHydrationWarning` as a bandaid.** Fix the root cause:
- If dates/times differ between server and client → render them in a `useEffect` or as `'use client'` components.
- If Radix generates different IDs → use deterministic IDs.

---

## 5. 🏪 Server Actions Rules

### 5.1 Consistent Error Handling Pattern
```typescript
// ✅ Every action follows this pattern:
export async function createPolicy(formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()

  // Validate
  const name = getFormString(formData, 'name')
  if (!name) throw new Error('Name is required')

  // Execute
  const { error } = await supabase.from('policies').insert({ ... })
  if (error) throw new Error(`Failed to create policy: ${error.message}`)

  // Revalidate + Redirect
  revalidatePath('/policies')
  redirect('/policies')
}
```

### 5.2 Action File Organization
Each route's `actions.ts` should be structured as:
```
1. Imports
2. Types/Interfaces (if action-specific)
3. READ operations (get*, list*, search*)
4. WRITE operations (create*, update*, delete*)
5. UTILITY operations (export*, extract*)
```

### 5.3 No Business Logic in Components
Components call actions, they don't contain Supabase queries or data transformation logic. **All data operations live in `actions.ts` files.**

---

## 6. 🎨 Styling & CSS Rules

### 6.1 Tailwind Only (No Inline Styles)
- Use Tailwind utility classes for all styling.
- Complex/reusable patterns → Define in `globals.css` under `@layer utilities`.
- **Never use inline `style={{}}` attributes** unless absolutely necessary (dynamic values).

### 6.2 Responsive Design: Mobile-First
```typescript
// ✅ Mobile-first approach
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// ❌ Don't use CSS !important overrides for responsiveness
// ❌ Don't use custom @media queries when Tailwind breakpoints exist
```

### 6.3 Don't Override Tailwind's Grid System
```css
/* ❌ BAD — in globals.css */
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr !important; }  /* Breaks ALL grids */
}

/* ✅ GOOD — use Tailwind per-component */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### 6.4 Color System
Use only the design token colors defined in `globals.css`:
```
primary / primary-foreground   → Brand green (#4A6741)
secondary / secondary-foreground → Soft gray
destructive                    → Red/danger
muted / muted-foreground       → Subtle text
```
**Never use raw colors** like `text-green-700` or `bg-red-50` — use semantic tokens or define status utility classes.

---

## 7. 🧩 Component Rules

### 7.1 Component Structure Template
```typescript
'use client'  // Only if it needs interactivity

import { ... }  // External imports
import { ... }  // Internal imports (@/components, @/lib)
import { ... }  // Types (@/types)

interface Props { /* typed props */ }

export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks
  // 2. Derived state
  // 3. Handlers
  // 4. Return JSX
}
```

### 7.2 `'use client'` Sparingly
- **Default is Server Component.** Only add `'use client'` when the component needs:
  - `useState`, `useEffect`, or other hooks
  - Event handlers (`onClick`, `onChange`)
  - Browser APIs
- **Never** mark a page as `'use client'` if it only fetches data.

### 7.3 Reusable Components — No Copy-Paste (**DRY**)
**Currently duplicated patterns:**
1. **User dropdown menu** — appears in both `Header.tsx` and `(dashboard)/layout.tsx`. Extract into `UserMenu.tsx`.
2. **`getInitials()` function** — defined in both `Header.tsx` and `layout.tsx`. Move to `lib/utils.ts`.
3. **User fetching via `/api/auth/me`** — duplicated in Header and Layout. Use `UserProvider` context.

### 7.4 Props: Prefer Composition Over Configuration
```typescript
// ❌ BAD — giant config prop
<DataTable showExport showFilter showPagination columns={...} />

// ✅ GOOD — compose behavior
<DataTable columns={...} data={...}>
  <DataTableFilter />
  <DataTableExport />
  <DataTablePagination />
</DataTable>
```

---

## 8. 📁 Route & Page Rules

### 8.1 Page Structure (App Router)
```
app/(dashboard)/customers/
  page.tsx          → Server Component, fetches data, passes to client components
  actions.ts        → Server actions (CRUD operations)
  loading.tsx       → Loading UI (Suspense fallback)
  error.tsx         → Error boundary
  [id]/
    page.tsx        → Detail page
    edit/page.tsx   → Edit page
```

### 8.2 Data Fetching in Pages
```typescript
// ✅ Fetch in the page (Server Component), pass to client components
export default async function CustomersPage() {
  const { data } = await getCustomers()
  return <CustomerList customers={data} />  // Client component
}

// ❌ Don't fetch data inside client components with useEffect
// ❌ Don't use export const dynamic = 'force-dynamic' on layout
```

### 8.3 Remove Demo/Test Pages from Production
Delete these unless they serve a purpose:
- `app/fuzzy-search-demo/`
- `app/keyboard-demo/`
- `app/mobile-demo/`
- `app/mobile-optimization/`
- `app/table-demo/`
- `app/ui-demo/`

---

## 9. ⚡ Performance Rules

### 9.1 Font Loading
Load only fonts that are **actually used:**
```typescript
// ✅ Only Inter + Playfair Display (currently used)
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

// ❌ Remove Geist/Geist_Mono (loaded but unused)
```

### 9.2 Image Optimization
- Use Next.js `<Image>` component for all images (auto-optimization).
- Set `width` and `height` or use `fill` prop.
- Don't use raw `<img>` tags.

### 9.3 Bundle Size
- **Never `import *`** from a package. Use named imports:
  ```typescript
  // ❌ import * as React from 'react'
  // ✅ import { useState, useEffect } from 'react'
  ```
- Lazy load heavy components (charts, PDF viewer, etc.):
  ```typescript
  const DashboardCharts = dynamic(() => import('@/components/DashboardCharts'), { ssr: false })
  ```

---

## 10. 🔄 Git & Workflow Rules

### 10.1 Commit Messages
```
feat: add policy renewal reminder notifications
fix: resolve hydration mismatch in user dropdown
refactor: extract auth helper from server actions
chore: remove unused demo pages
```

### 10.2 Branch Naming
```
feature/policy-renewal-reminders
fix/hydration-mismatch
refactor/extract-user-provider
```

### 10.3 Pre-Commit Checklist
Before every commit:
1. ✅ No `any` types
2. ✅ No `console.log()` statements
3. ✅ No unused imports
4. ✅ No duplicate code blocks
5. ✅ TypeScript compiles without errors (`npx tsc --noEmit`)
6. ✅ Component under 200 lines

---

## 11. 🚨 Current Violations to Fix (Priority Order)

| # | Violation | File(s) | Rule | Priority |
|---|-----------|---------|------|----------|
| 1 | `any` types used | `Header.tsx`, `DataTable.tsx`, `layout.tsx` | Rule 2.1 | 🔴 High |
| 2 | Duplicate user fetch + `getInitials()` | `Header.tsx` + `layout.tsx` | Rule 7.3 | 🔴 High |
| 3 | `PolicyForm.tsx` is 721 lines | `PolicyForm.tsx` | Rule 1.3 | 🔴 High |
| 4 | Duplicate middleware auth logic | `middleware.ts` vs `lib/supabase/middleware.ts` | Rule 3.2 | 🟡 Medium |
| 5 | Unused fonts (Geist/Geist_Mono) | `app/layout.tsx` | Rule 9.1 | 🟡 Medium |
| 6 | Dead code (`mockAuth.ts`, stub functions) | `lib/mockAuth.ts`, `customers/actions.ts` | Rule 4.1 | 🟡 Medium |
| 7 | `suppressHydrationWarning` as bandaid | `layout.tsx`, `Header.tsx` | Rule 4.4 | 🟡 Medium |
| 8 | Demo pages in production | `app/fuzzy-search-demo/` etc. | Rule 8.3 | 🟢 Low |
| 9 | Raw colors instead of design tokens | `globals.css` status classes | Rule 6.4 | 🟢 Low |
| 10 | `!important` CSS overrides | `globals.css` mobile styles | Rule 6.3 | 🟢 Low |

---

> **Golden Rule:** If you copy-paste code, you're doing it wrong. Extract, abstract, reuse.
