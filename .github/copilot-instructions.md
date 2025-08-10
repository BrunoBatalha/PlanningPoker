# Copilot Instructions for PlanningPoker

## Project Overview
- **PlanningPoker** is a Next.js app for collaborative estimation using Planning Poker, integrating Chakra UI for UI and Firebase for real-time data.
- Users join or create rooms, select cards, and see averages revealed in real time.

## Architecture & Key Patterns
- **App Structure:**
  - All main app logic is under `src/app/` using Next.js app directory routing.
  - Room logic is in `src/app/room/[key]/page.tsx` (dynamic route for each room).
  - Chakra UI is set up via `src/chakraUi/chakraProvider.tsx` and custom theme in `src/chakraUi/theme.ts`.
  - Firebase is initialized in `firebase.js` and used directly in room/page logic.
  - Components are colocated in `src/components/` and re-exported via `src/components/index.ts`.

- **State & Data Flow:**
  - Real-time updates use Firebase Realtime Database (`firebase/database`).
  - User session is tracked in `window.sessionStorage` as `currentUser`.
  - Room and user state is managed in React state, with updates from Firebase listeners.

- **Styling:**
  - Chakra UI is the only styling system. Custom theme uses Roboto font and purple color scheme for buttons.
  - All UI components use Chakra primitives and theming.

## Developer Workflows
- **Start Dev Server:**
  - `npm run dev` (Next.js dev mode)
- **Build:**
  - `npm run build` (Next.js build)
- **Lint:**
  - `npm run lint`
- **No explicit test scripts or files present.**

## Conventions & Integration
- **Component Pattern:**
  - All components are functional, colocated, and exported via `src/components/index.ts`.
  - Use Chakra UI props and variants for all UI.
- **Firebase Usage:**
  - All Firebase config is in `firebase.js` and uses env vars prefixed with `NEXT_PUBLIC_`.
  - Database structure: `rooms/{roomId}/users/{userId}` and `rooms/{roomId}/isShowingAverage`.
- **Routing:**
  - Dynamic routes for rooms: `/room/[key]`.
  - User join flow: `/room/join/[key]`.
- **Language:**
  - Most UI and code comments are in Portuguese.

## External Dependencies
- [Next.js](https://nextjs.org/)
- [Chakra UI](https://v2.chakra-ui.com/)
- [Firebase](https://firebase.google.com/?hl=pt-br)
- [Framer Motion](https://www.framer.com/motion/) (for animations)

## Examples
- See `src/app/room/[key]/page.tsx` for real-time data flow and UI logic.
- See `src/chakraUi/theme.ts` for theming conventions.
- See `firebase.js` for Firebase integration pattern.

---
If you are unsure about a pattern, check the referenced files above or ask for clarification.
