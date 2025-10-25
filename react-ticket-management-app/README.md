# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # TicketFlow (Ticket Management)

    This project is a small ticket management demo app built with React + TypeScript + Vite. It includes a lightweight local JSON API (json-server) for quick development and simulates token-based authentication stored in localStorage.

    This README covers setup, running the dev environment (Vite + json-server), the demo login, and troubleshooting steps.

    ## Prerequisites

    - Node.js (v18+ recommended)
    - npm (bundled with Node)

    ## Install

    Install dependencies:

    ```bash
    npm install
    ```

    If you encounter peer-dependency issues while installing dev tools, run with the legacy flag (the repository already used this during setup):

    ```bash
    npm install --legacy-peer-deps
    ```

    ## Start development servers

    The project includes a script that runs both the Vite dev server and the json-server API concurrently.

    ```bash
    npm run dev
    ```

    What this starts:
    - Vite dev server (frontend) — typically at http://localhost:5173
    - json-server (fake REST API) — at http://localhost:3001

    You can also run the json-server separately:

    ```bash
    npm run server
    ```

    ## Demo login

    The app includes a demo account for quick access:

    - Email: demo@ticketapp.com
    - Password: demo123

    Use the login form at `/auth/login` to sign in with the demo account.

    If the demo user is missing, check `db.json` at the project root — it should contain the demo user in the `users` array. Example:

    ```json
    {
      "users": [
        { "id": "demo", "email": "demo@ticketapp.com", "password": "demo123", "name": "Demo User" }
      ]
    }
    ```

    Note: Passwords in this demo are stored in plaintext in `db.json`. This is intentional for local development only — do not do this in production.

    ## Authentication & token behavior

    - After successful login the app stores a token object in localStorage under the key `ticketapp_auth`. The object looks like:

    ```json
    {
      "token": "<random>",
      "expiresAt": "<ISO timestamp>",
      "user": { "id": "demo", "email": "demo@ticketapp.com", "name": "Demo User" }
    }
    ```

    - There is backward compatibility with an older key `ticketapp_session` used in earlier code paths. The app checks `ticketapp_auth` first and falls back to `ticketapp_session` if present.
    - Tokens expire after 24 hours by default. Expiry is simulated in the front-end mock API (`src/lib/mockApi.ts`) via the `expiresAt` field. When expired, `mockApi` replies with a 401-like error and the token is removed from localStorage.

    ## Working with tickets

    - The JSON server stores data in `db.json` (root). Sample structure contains `users`, `tickets`, and `auth` collections.
    - Tickets endpoints (json-server):
      - GET /tickets
      - GET /tickets?userId=<id>
      - POST /tickets
      - PATCH /tickets/:id
      - DELETE /tickets/:id

    The frontend uses `src/lib/mockApi.ts` as the API layer — it calls the json-server endpoints and enforces token checks on protected operations.

    ## Build for production

    To build the frontend:

    ```bash
    npm run build
    ```

    This runs TypeScript build + Vite build and outputs `dist/`.

    ## Troubleshooting

    - Unauthorized on login:
      1. Confirm json-server is running: open http://localhost:3001/users in your browser. You should see the users array.
      2. Clear localStorage or open an Incognito window to avoid stale tokens.
      3. Ensure the demo user exists in `db.json`.

    - Tickets not appearing on Dashboard:
      - The Dashboard reads stats from the API (via `apiGetStats`), so make sure json-server is running and `db.json` has `tickets` for your demo user.

    - Type errors during development/build:
      - Run `npm run build` to surface TypeScript errors and inspect stack traces. The project uses a small number of `any`/`unknown` casts where the mock API shape and local storage types differ; these can be unified with a follow-up refactor.

    ## Developer notes & next steps

    - The project currently simulates a backend using `json-server` and a small `mockApi` wrapper. This keeps the frontend close to how it would interact with a real REST API.
    - Token expiry and auth checks are simulated in `src/lib/mockApi.ts` and tokens are saved in `localStorage` under `ticketapp_auth`.
    - TODO ideas:
      - Consolidate ticket types into a single shared type to remove `unknown`/`any` casts.
      - Add integration tests that start json-server and exercise login + CRUD flows.
      - Replace `json-server` with a small Node/Express mock server for more control over auth responses.

    If you want, I can make a one-click script that resets `db.json` to a known-good state (adds the demo user and a few sample tickets).

    ---

    Happy hacking — if you want me to add the reset script or tighten types I can do that next.
