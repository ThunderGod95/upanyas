# Upanyas

Upanyas a web platform for publishing, discovering, and reading we novels and translated fiction.

Upanyas is under active development.

The current implementation includes series discovery, series detail pages, featured titles, user authentication, and account management. The chapter data model is established, but the complete reading experience is still being developed.

## Technology

The application uses the following technologies:

| Area                      | Technology                          |
| ------------------------- | ----------------------------------- |
| Framework                 | Next.js 16 (App Router)             |
| Language                  | Typescript                          |
| Package manager           | Bun                                 |
| UI                        | React 19, Tailwind CSS 4, shadcn/ui |
| Database                  | PostgreSQL                          |
| ORM                       | Prisma 7                            |
| Authentication            | Better Auth                         |
| Client-side data fetching | SWR                                 |
| Email                     | Resend / Mailpit                    |
| Object storage            | S3-compatible storage               |
| Formatting and linting    | Oxfmt / Oxlint                      |

Next.js Cache Components, Partial Prefetching, and the React Compiler are enabled.

## Getting Started

### Prerequisites

You will need:

- Bun (the project declares Bun 1.4.2).
- A PostgreSQL database.
- An SMTP server or Resend account for transactional email.
- An S3-compatible storage service for profile images.

Mailpit is recommended for local email testing. It captures outgoing messages without delivering them to actual recipients.

### 1. Install depedencies

Clone the repository and install its dependencies:

```bash
git clone <repository-url>
cd Upanyas
bun install
```

Use Bun for the project scripts and dependency management. The Prisma scripts are also configured to run with Bun.

### 2. Configure environment variables

Create a `.env` file in the projetc root.

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/upanyas"

# Authentication
BETTER_AUTH_SECRET="replace-with-a-secure-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Email
EMAIL_PROVIDER="mailpit"
EMAIL_FROM="Upanyas <noreply@example.com>"

SMTP_HOST="127.0.0.1"
SMTP_PORT="1025"

# S3-compatible storage
S3_REGION="us-east-1"
S3_ENDPOINT="https://your-s3-endpoint.example"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_AVATAR_BUCKET="user_avatars"
AVATAR_PUBLIC_BASE_URL="https://your-public-storage-host.example/user_avatars"
```

Replace the placeholder values with your own configuration.

**Database:** _DATABASE_URL_ must point to an accessible PostgreSQL database. Use a separate database for local development.

**Authentication:** _BETTER_AUTH_SECRET_ should be cryptographically secure random secret. _BETTER_AUTH_URL_ must match the application's externally accessible origin.

**Email:** _EMAIL_PROVIDER_ supports mailpit and resend. For Resend, configure RESEND_API_KEY instead of the local SMTP settings. EMAIL_FROM must be a valid sender for the selected provider.

**Storage:** _S3_ENDPOINT_ identifies the object storage API, whereas _AVATAR_PUBLIC_BASE_URL_ identifies the publicly accessible URL prefix for avatar objects. These are not necessarily the same URL. The configured bucket must exist and support public image delivery.

An optional _DEV_HOST_ variable is supported for configuring additional development origins through next.config.ts.

Environment files are excluded from Git. Do not commit credentials or production secrets.

### 3. Start local services

Make sure PostgresSQL is running and the configured database exists.

For local email testing, Mailpit can be started with Docker (if available):

```bash
docker run -d --name upanyas-mailpit -p 1025:1025 -p 8025:8025 axllent/mailpit
```

Or follow the instructions here to setup mailpit for your system: https://mailpit.axllent.org/docs/install/

Email verification is enabled for new accounts, so a working email provider is necessary to test the complete signup and login flow.

Configure the S3-compatible storage service separately. Avatar uploading requires valid credentials and a publicly reachable object URL.

### 4. Initialize the database

Apply the existing database migrations:

```bash
bun prisma:migrate
```

Generate the Prisma Client:

```bash
bun prisma:generate
```

Seed the demo data:

```bash
bun prisma:seed
```

The default seed command populates predefined genres and tags. It does not automatically create demonstration series.

To populate the database with development fixtures, run:

```bash
bun prisma/seed.ts --demo
```

The demo dataset includes public, unlisted, and private series; volumes; chapter drafts; revisions; and publication records. This is useful when working on the discovery interface or testing visibility and publication behavior.

Demo seeding is disabled when `NODE_ENV=production`.

To remove the known demo records:

```bash
bun prisma/cleanup.ts
```

The cleanup script targets specific demo identifiers. It is not a general-purpose database reset.

### 5. Start the development server

```bash
bun dev
```

Open http://localhost:3000.

For a production build:

```bash
bun run build
bun run start
```

Ensure the database, email, authentication, and storage settings are correctly configured for the target environment before building or deploying.

## Project structure

The repository follows the Next.js App Router structure without an additional src directory.

```text
app/
  (site)/                Public site and account pages
    series/              Series discovery and details
    user/me/             Account management
  auth/                  Authentication pages
  api/                   HTTP endpoints
  globals.css            Design tokens and global styles
  layout.tsx             Root layout and providers

components/
  auth/                  Authentication interfaces
  home/                  Featured series components
  navigation/            Site navigation
  series/                Series-related interfaces
  shadcn/                shadcn/ui primitives
  users/                 Account and profile components
  theme-provider.tsx     Application theme configuration
  swr-provider.tsx       SWR configuration

lib/
  auth/                  Authentication configuration and helpers
  email/                 Transactional email providers
  series/                Series queries and display options
  storage/               Object storage integration
  utils/                 Shared utilities
  prisma.ts              Prisma Client instance
  swr.ts                 Shared fetcher

prisma/
  migrations/            Database migration history
  schema.prisma          Database schema
  seed.ts                Reference and demo data
  cleanup.ts             Demo data cleanup
  generated/             Generated Prisma Client

public/                   Static assets
proxy.ts                  Route-level session-cookie checks
next.config.ts            Next.js configuration
prisma.config.ts          Prisma CLI configuration
components.json           shadcn/ui configuration
```

The `@/` import alias resolves to the project root.

