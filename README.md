# FormForge AI

An AI-powered form builder — describe a form in natural language and get a complete, shareable form in seconds. Built with Next.js, Appwrite, Zustand, and Framer Motion.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8) ![Appwrite](https://img.shields.io/badge/Appwrite-pink)

## Features

- **AI generation** — Describe your form in a sentence, get a complete field list
- **Visual builder** — Drag-and-drop reordering, click to edit, type-specific options
- **Live preview** — See exactly what respondents will see, desktop/mobile toggle
- **Public form page** — Shareable link, client-side Zod validation, file uploads
- **Responses dashboard** — View every submission, basic stats
- **Auth** — Email/password via Appwrite

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict, no `any`)
- **Tailwind CSS 4** (CSS-first config)
- **Appwrite** — Auth, TablesDB, Storage
- **Zustand** — builder state, UI state, auth state
- **Zod** — runtime schema validation for forms and AI output
- **Radix UI** + shadcn/ui-style components
- **Framer Motion** — transitions
- **OpenRouter / Cerebras** — LLM provider (swappable)
- **react-hook-form** + **@hookform/resolvers**

## Quick Start

```bash
git clone https://github.com/SamijonovSardor/AI-form-builder.git
cd AI-form-builder
npm install
cp .env.example .env.local
# Fill in .env.local — see "Environment Setup" below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Setup

You need two services: **Appwrite** (auth + database + storage) and an **LLM provider** (OpenRouter or Cerebras).

### 1. Appwrite (Cloud)

1. Sign up at [cloud.appwrite.io](https://cloud.appwrite.io) and **verify your email**
2. Create a project → copy the **Project ID**
3. Create a database → copy the **Database ID**
4. Inside the database, create two **Tables** (not the old Collections):

   **`forms` table** — columns: `ownerId` (string, 64, required), `title` (string, 256, required), `description` (string, 1024), `status` (string, 16, required), `fields` (string, 1000000, required), `theme` (string, 1024)
   **`responses` table** — columns: `formId` (string, 64, required), `answers` (string, 1000000, required), `fileIds` (string, 16384)

5. Set permissions on `responses`: **Create: Any**, **Read: Any** (so anonymous users can submit)
6. Create a Storage bucket **`form-uploads`** with **Create: Any**, **Read: Any**

### 2. LLM (OpenRouter recommended)

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Create an API key
3. Add credits (free tier available)
4. Set `LLM_PROVIDER=openrouter` and `LLM_API_KEY=sk-or-v1-...` in `.env.local`

For Cerebras instead, set `LLM_PROVIDER=cerebras` and `LLM_MODEL=llama-3.3-70b`.

### 3. Fill `.env.local`

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_APPWRITE_DATABASE_ID=<your-database-id>
NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID=forms
NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID=responses
NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID=form-uploads

LLM_PROVIDER=openrouter
LLM_API_KEY=<your-key>
LLM_MODEL=openrouter/auto
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/                          # Next.js App Router
    (auth)/                     # /login, /signup
    dashboard/                  # /dashboard, /dashboard/new, /dashboard/[formId]
    f/                          # /f/[formId] (public), /f/[formId]/success
    api/generate-form/          # AI endpoint
  components/
    builder/                    # FieldList, FieldEditor, AddFieldMenu, PreviewPane
    form-renderer/              # Shared between builder preview and public page
    ui/                         # shadcn-style primitives
  lib/
    appwrite/                   # client.ts, auth.ts, db.ts, storage.ts, errors.ts
    zod/buildSchema.ts          # runtime Zod schema for FormField[]
    ai/generateForm.ts          # LLM provider abstraction (OpenAI-compatible)
  store/                        # useBuilderStore, useUIStore, useAuthStore
  types/form.ts
  hooks/use-require-auth.ts
```

## Notable Implementation Details

- **Builder state is fully decoupled from persistence** — local state via Zustand, only flushed to Appwrite on save
- **Runtime Zod schema** generated from `FormField[]` — used by the public form page and to validate AI output
- **Custom drag-and-drop** — no `@dnd-kit`, no `framer-motion` layout animations; just `position: absolute` + CSS transitions for buttery-smooth reordering
- **LLM provider is swappable** — both OpenRouter and Cerebras use the OpenAI SDK, so changing providers is one env var
- **AppwriteException is parsed** — error messages come from `lib/appwrite/errors.ts`, never raw HTML

## License

MIT
