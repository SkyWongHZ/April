# Monitoring System

This is a monorepo project built with Turborepo, containing a Next.js frontend and a Nest.js backend.

## Project Structure

```
.
├── apps
│   ├── web                 # Next.js frontend application
│   └── api                 # Nest.js backend application
├── packages
│   ├── ui                  # Shared UI components
│   ├── types              # Shared TypeScript types
│   ├── config             # Shared configuration
│   ├── utils              # Shared utilities
│   └── tsconfig           # Shared TypeScript configurations
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.9.0

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all applications and packages
pnpm build
```

### Development

- Frontend (Next.js): http://localhost:3000
- Backend (Nest.js): http://localhost:3001

## Workspace Dependencies

- `@monitoring/web`: Next.js frontend application
- `@monitoring/api`: Nest.js backend application
- `@monitoring/ui`: Shared React components
- `@monitoring/types`: Shared TypeScript types
- `@monitoring/config`: Shared configuration
- `@monitoring/utils`: Shared utilities

## Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications and packages
- `pnpm lint`: Lint all applications and packages
- `pnpm test`: Run tests across all applications and packages
- `pnpm clean`: Clean all build outputs