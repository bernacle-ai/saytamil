# Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # API route handlers
│   │   ├── auth/
│   │   │   ├── signup/         # POST: create user account
│   │   │   ├── send-otp/       # POST: send password reset OTP
│   │   │   ├── reset-password/ # POST: verify OTP + update password
│   │   │   └── [...nextauth]/  # NextAuth catch-all handler
│   │   ├── chats/
│   │   │   ├── route.ts        # GET/POST/DELETE chats
│   │   │   └── messages/       # POST messages to a chat
│   │   └── usage/              # GET daily usage count
│   ├── globals.css             # Tailwind base imports
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Entry point — auth gate → MainLayout
├── components/
│   ├── Auth/                   # Login, Signup, AuthPage (mode-switching form)
│   ├── Editor/                 # Text editor, suggestion cards, transliteration dropdown
│   ├── Layout/                 # MainLayout, Sidebar
│   ├── UI/                     # Reusable: Toast, LoadingSkeleton, StatsCard, KeyboardShortcuts
│   └── Providers.tsx           # Wraps app: SessionProvider > ChatProvider > ToastProvider
├── contexts/
│   ├── ChatContext.tsx          # Chat state + DB sync (create, switch, delete, messages)
│   └── ToastContext.tsx         # Global toast notifications
├── hooks/
│   └── useGemini.ts            # Hook wrapping Gemini sendMessage
├── lib/
│   ├── authOptions.ts          # NextAuth config (providers, callbacks, session)
│   ├── db.ts                   # pg Pool, initDB(), usage helpers, getUserByEmail
│   ├── gemini.ts               # analyzeText(), API key rotation, rate limiting
│   └── transliteration.ts      # English phonetic → Tamil script logic
└── types/
    └── index.ts                # Shared types: Message, Chat, User
```

## Key Conventions

- All client components must have `'use client'` at the top
- API routes use `getServerSession(authOptions)` for auth — never trust client-side session alone
- DB access only in `src/lib/db.ts` and API routes — never directly in components
- `initDB()` is called at the start of API routes to ensure tables exist (idempotent)
- Context hooks (`useChat`, `useToast`) throw if used outside their provider
- IDs are generated client-side as `chat_${Date.now()}` / `msg_${Date.now()}`
- Tailwind classes are written inline — no CSS modules or separate style files
- `@/` alias maps to `src/` — always use this for imports, never relative `../../`
