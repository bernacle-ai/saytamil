# Tech Stack

## Framework & Runtime
- **Next.js 16** (App Router) with **React 19**
- **TypeScript 5** (strict mode enabled)
- Node.js 18+

## Styling
- **Tailwind CSS 3** — utility-first, dark theme (`slate-950` base) with cyan/blue accents

## Authentication
- **NextAuth v4** — JWT sessions, Google OAuth + credentials providers
- Passwords hashed with **bcryptjs**
- OTP-based password reset via **nodemailer**

## Database
- **PostgreSQL** via `pg` (node-postgres) with a connection pool
- No ORM — raw SQL queries throughout
- SSL enabled (`rejectUnauthorized: false`)
- Schema auto-initialized via `initDB()` in `src/lib/db.ts`

## AI Integration
- **Google Gemini API** (`@google/generative-ai` + direct REST fetch)
- Model: `gemini-3.1-flash-lite-preview` (configurable via `NEXT_PUBLIC_GEMINI_MODEL`)
- Up to 3 API keys supported with automatic rotation and cooldown logic

## Environment Variables
```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_GEMINI_API_KEY
NEXT_PUBLIC_GEMINI_API_KEY_2   # optional
NEXT_PUBLIC_GEMINI_API_KEY_3   # optional
NEXT_PUBLIC_GEMINI_MODEL       # optional, defaults to gemini-3.1-flash-lite-preview
```

## Common Commands
```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Build Config
- Turbopack enabled in `next.config.ts`
- Path alias: `@/*` → `src/*`
- ESLint via `eslint-config-next`
