# **AI Brancher**

AI Brancher is a full‑stack Next.js application that lets you chat with an AI agent connected to multiple data sources such as REST APIs, GraphQL endpoints, and external tools (Wikipedia, YouTube transcripts, Google Books, generic cURL, and more). The app orchestrates these tools as **workflows** defined in the `wxflows` folder and exposes them through an interactive chat UI backed by Convex and Clerk.

The goal is to make it easy to prototype AI agents that can “branch out” into different APIs and knowledge sources without hard‑coding complex orchestration logic.

---

## **Features**

- **Chat‑based AI agent** integrated into a Next.js App Router UI (`app/`) with streaming responses via an API route at `app/api/chat/stream`.
- **Tooling and workflows layer** using `wxflows` to describe external tools and GraphQL schemas (e.g. Wikipedia, YouTube transcript, Google Books, generic cURL).
- **Multiple data source support**: REST, GraphQL, and other HTTP endpoints are modeled as tools via `.graphql` files and configuration in `wxflows.config.json`.
- **Stateful conversations** with Convex for persistence and server‑side business logic (`convex/`).
- **Authentication and user separation** through Clerk middleware (`middleware.ts`) so each user has their own chats and dashboards.
- **Modern UI stack**: Tailwind CSS, shadcn‑style components (`components/` and `components.json`), and app‑directory layouts.

---

## **High‑level Architecture**

The repository is organized into the following main parts.

| **Area** | **Path** | **Description** |
| --- | --- | --- |
| Web app | `app/` | Next.js App Router pages, root layout, global styles, chat API route, dashboard. |
| UI library | `components/` | Reusable React components (chat UI, loading states, avatar, layout components). Tailwind and component registry defined in `components.json` and `tailwind.config.ts`. |
| Backend | `convex/` | Convex functions for message persistence, chat listing, and workflow/event handling. |
| Workflows | `wxflows/` | GraphQL schemas, tool definitions, and configuration for external data sources. |
| Shared code | `lib/` | Helpers, message formatting, caching utilities, and integration glue between the UI, Convex, and tools. |
| Config | `constants/`, root configs | Shared constants, Next.js config, TypeScript config, Tailwind, ESLint. |

## **How the chat flow works**

1. A user opens the app (`app/page.tsx` or `app/dashboard`) and starts a conversation using the chat UI components in `components/`.
2. Messages are sent to the streaming API route at `app/api/chat/stream`, which calls into Convex and the tool/workflow layer in `wxflows/`.
3. Based on the user query, the AI model selects one or more tools (e.g. Wikipedia, YouTube transcript, Google Books, custom cURL) described in the `.graphql` files and configuration under `wxflows/`.
4. The agent executes the selected tools, aggregates the results, and streams the answer back to the client, where the chat UI renders partial tokens and loading states.
5. Convex persists the conversation so that later messages can reference previous context and the dashboard can list existing chats.

---

## **Workflows and Tools (`wxflows/`)**

The `wxflows` directory contains the definitions for every external tool the agent can call.

- `wxflows.config.json`: Global configuration for the workflows engine (e.g. enabled tools, routing rules, default endpoint URLs).
- `tools.graphql`: Describes the tool schema (input arguments, return types) so the AI model understands what each tool can do.
- `index.graphql`: Aggregates the available tools and binds them into a single schema the agent can query.
- Subfolders such as:
    - `wikipedia/`: Queries to search Wikipedia and fetch article snippets.
    - `youtube_transcript/`: Queries to retrieve YouTube video transcripts.
    - `google_books/`: Queries to search and inspect books via the Google Books API.
    - `curl/` and `curl-01/`: Generic cURL‑like tools for hitting arbitrary REST endpoints and transforming the response.

Adding a new data source typically means:

1. Creating a new folder under `wxflows/` for that provider.
2. Defining its GraphQL operations and types (queries, mutations) in `.graphql` files.
3. Wiring it into `index.graphql` and `wxflows.config.json` so the agent can call it by tool name.

This design lets you grow the agent’s capabilities without changing the core chat UI or backend logic.

---

## **Tech Stack**

- **Framework**: Next.js (App Router, TypeScript, `create-next-app` base).
- **Runtime / UI**: React, Tailwind CSS, component registry via `components.json` (similar to shadcn). Root layout in `app/layout.tsx` and global styles in `app/globals.css`.
- **Data / Backend**: Convex for data storage and server functions; streaming API route in `app/api/chat/stream` for model outputs.
- **Auth / Middleware**: Clerk integration and auth middleware in `middleware.ts` to protect routes and attach user identity.
- **Language**: TypeScript (89.8% of repo), plus a small amount of JavaScript and CSS.

Dependencies and scripts are defined in `package.json` and `package-lock.json`.

---

## **Getting Started**

## **Prerequisites**

- Node.js (LTS version)
- pnpm, npm, yarn, or bun
- Convex project and Clerk project (if you want full auth + persistence; environment variables must be set accordingly)

## **Installation**

Clone the repository and install dependencies:

`bashgit clone https://github.com/thbueno/ai-brancher.git
cd ai-brancher

# choose one
npm install
# or
yarn
# or
pnpm install
# or
bun install`

Set up your environment variables (for Convex, Clerk, and any external tools/APIs) by creating a `.env.local` file. The exact variable names depend on your Convex and Clerk setup.

## **Running the development server**

Start the dev server with one of the following commands:

`bashnpm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev`

Then open [**http://localhost:3000**](http://localhost:3000/) in your browser.

You can edit the main page in `app/page.tsx`; changes will hot‑reload automatically.

---

## **Customizing and Extending**

## **Customize the chat UI**

- Update layouts in `app/layout.tsx` and `app/dashboard/`.
- Tweak chat components (input, message bubbles, loading indicator, avatars) under `components/`.
- Tailwind theme and design tokens live in `tailwind.config.ts` and `app/globals.css`.

## **Add a new tool / data source**

1. Create a directory under `wxflows/` (for example, `wxflows/github`).
2. Define your GraphQL operations and types for that provider.
3. Export them in `index.graphql` and add configuration in `wxflows.config.json`.
4. Optionally, add helper functions in `lib/` and constants in `constants/` if needed.

Once wired, the AI agent will be able to call your new tool when it is appropriate for a user query.

## **Modify backend behavior**

- Use the `convex/` directory to adjust how messages are stored, fetched, and associated to workflows.
- You can refine caching and event handling there; recent commits reference improvements to chat caching and event handling logic.

---

## **Deployment**

The app is a standard Next.js project and can be deployed on any platform that supports Next.js.

The repository was bootstrapped with `create-next-app`, so the recommended target is **Vercel**:

- Follow the [**Next.js deployment docs**](https://nextjs.org/docs/app/building-your-application/deploying).
- Or use the Vercel dashboard, connect the GitHub repo, configure environment variables for Convex, Clerk, and external APIs, and deploy.

---

## **Status and Roadmap**

This repository currently has no tagged releases and no published packages. It is intended as a foundation for experimenting with AI‑driven workflows across APIs and data sources. Potential future directions include:

- More built‑in tools (e.g. CRM, analytics, internal APIs).
- A visual builder for workflows on top of `wxflows`.
- Role‑based dashboards and agents specialized per domain.

Contributions and feedback are welcome via GitHub issues and pull requests.
