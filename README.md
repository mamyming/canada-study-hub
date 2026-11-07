# Canada Study Hub

A full-stack admissions workflow for students, education agents, and Canadian colleges. Built with React 19, TanStack Start, TypeScript, Tailwind CSS v4, and Supabase.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- A Supabase project

## Run locally

```bash
git clone https://github.com/mamyming/canada-study-hub.git
cd canada-study-hub
git checkout feature/full-system
npm install
cp .env.example .env
```

Fill in the values in `.env`:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable/anon key
- `SUPABASE_URL`: same project URL, server-side
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service-role/secret key; server only, never expose it with a `VITE_` prefix

Then start the development server:

```bash
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run the migration files in `supabase/migrations` in timestamp order. If using the Supabase CLI, link your project and run `supabase db push`.
3. Create the private Storage buckets used by the application: `documents`, `results`, `offers`, `invoices`, and `payments`. Apply the storage policies in the migrations.
4. Configure Auth email/password sign-in and the allowed redirect URLs for your local and deployed domains.
5. Add the four environment variables above to local `.env` and to the server deployment environment. Keep the service-role key server-side only.

## Security model

- Roles are stored in `user_roles`, not in editable profile fields.
- Student, active Agent, and assigned College access is enforced by Supabase RLS and server-side workflow functions.
- Admin is restricted to account management. Admin has no RLS access to applications, application documents, offers, invoices, or payments.
- Agent and College account provisioning uses trusted server-side functions. Never put the Supabase service-role key in browser code.

## Demo accounts

Demo identities must be provisioned in Supabase Auth and assigned roles by a trusted administrator. Do not use hard-coded client-side passwords or role selectors. Use the account-management screen to create Agent and College accounts after an Admin account has been securely provisioned.

## Build

```bash
npm run build
npm run lint
```
