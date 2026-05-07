# PortfolioPro Frontend

PortfolioPro Frontend is a modern multi-tenant SaaS platform built with Next.js App Router and Tailwind CSS that enables users from multiple industries to create professional AI-powered portfolios and ATS-friendly resumes.

---

# Tech Stack

- Next.js 15+
- React 19+
- Tailwind CSS
- TypeScript
- Zustand
- React Hook Form
- Zod
- shadcn/ui
- Axios
- Framer Motion

---

# Features

## Authentication
- Login/Register
- JWT/Auth session handling
- Protected routes
- Role-based access control

## Portfolio Builder
- Dynamic section engine
- Drag & Drop sections
- Multi-domain support
- Live preview
- Publish portfolio

## Resume Builder
- ATS optimized resume creation
- PDF export
- Resume versioning

## AI Features
- AI Bio Generator
- AI Project Description Generator
- ATS Resume Analyzer
- Theme Suggestions

## SaaS Features
- Subscription management
- Stripe/Razorpay integration
- User dashboard
- Public portfolio hosting

---

# Folder Structure

```bash
src/
├── app/
├── components/
├── features/
├── hooks/
├── helper/
├── lib/
├── services/
├── store/
├── styles/
├── types/
└── utils/
```

---

# Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Point the frontend at the backend API from `api.md`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
```

4. Start the backend on port `5001`, then run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

# API Integration

The API client lives in `src/helper/apiRequest.tsx` and reads
`NEXT_PUBLIC_API_BASE_URL`. It automatically prefixes API calls with `/api`,
adds the saved JWT as both `Authorization: Bearer <token>` and `token:
<token>`, and supports JSON plus `multipart/form-data` uploads.

Endpoint-specific wrappers live in `src/services/`:

- `authService.ts`: login, register, logout
- `userService.ts`: user list and profile endpoints
- `categoryService.ts`: category list, create, and update endpoints
- `templateService.ts`: template list endpoint
