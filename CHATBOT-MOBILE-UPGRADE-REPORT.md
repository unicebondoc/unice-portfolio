# Chatbot + Mobile Upgrade — Implementation Report

## 1. Files inspected

| Area | Files |
|------|--------|
| **Mobile / breakpoints** | `src/App.jsx` (isMobile from store, w < 768, w < 1024), `src/hooks/useStore.js` (setViewport, isMobile), `src/data/memories.js` (MOBILE_POSITIONS, getMemoryPosition), `src/components/scene/OrbPanel.jsx` (mobile prop, bottom sheet), `src/styles/global.css` (max-width: 768px) |
| **Chatbot / Tyche** | `src/components/ui/ChatBot.jsx`, `src/components/ui/ChatBot.module.css`, `src/components/ui/TycheMascot.jsx`, `src/hooks/useChatGPT.js` |
| **API / env** | `src/hooks/useChatGPT.js` (direct OpenAI fetch, VITE_OPENAI_API_KEY), `.env.example` (VITE_OPENAI_API_KEY) |
| **Orb panel media** | `src/components/scene/OrbPanel.jsx` (thumbnailBadge, panelVideoWrap, m.videoSrc), `src/components/scene/OrbPanel.module.css` (.panelVideo, .thumbnailMedia), `src/data/memories.js` (videoSrc: '/memories/belong-web.mp4') |
| **Server / API routes** | No `/api` folder or Vercel serverless functions present before changes |

---

## 2. Files changed

| File | Change |
|------|--------|
| **api/chat.js** | **New.** Vercel serverless POST handler: reads OPENAI_API_KEY from env, builds Tyche system prompt, calls OpenAI, returns `{ reply, orbIds }`. |
| **src/hooks/useChatGPT.js** | Replaced client-side OpenAI calls with `fetch('/api/chat')`. Removed VITE_OPENAI_API_KEY. Added `pendingReply`, `commitPendingReply` for typing effect. New Tyche greeting and error copy. |
| **src/components/ui/ChatBot.jsx** | Uses `isMobile` from store; mobile layout (bottom sheet). Loading phrases ("Tyche is tracing the roots…", etc.). Progressive reveal of assistant reply with blinking cursor; commits when done. Placeholder "Ask Tyche…". |
| **src/components/ui/ChatBot.module.css** | Mystical panel styling (gradient, cyan border, soft glow). Mobile: `.panelMobile` bottom sheet (70vh, rounded top). Larger tap targets (44px), safe-area padding. Typing cursor animation. |
| **src/components/scene/OrbPanel.jsx** | Video: added `onLoadedData` play fallback, `disablePictureInPicture` for consistency. |
| **.env.example** | Document OPENAI_API_KEY (server-only); remove production use of VITE_OPENAI_API_KEY. |

---

## 3. What caused the Vercel/OpenAI failure

- **API key in the client**: The app used `import.meta.env.VITE_OPENAI_API_KEY` and sent it in the `Authorization` header from the browser. Vite inlines env vars prefixed with `VITE_` into the client bundle, so the key was exposed and could be blocked or rate-limited, and is unsafe for production.
- **CORS / direct OpenAI from browser**: Calling `api.openai.com` from the deployed frontend can hit CORS or network restrictions and is not a secure pattern.
- **No server route**: There was no `/api` serverless function; the client had to call OpenAI directly, which fails on Vercel once the key is not (or should not be) in the client.

---

## 4. How the new /api/chat route works

- **Location**: `api/chat.js` at project root. Vercel deploys it as a serverless function for `POST /api/chat`.
- **Env**: Reads `process.env.OPENAI_API_KEY` (set in Vercel Project → Settings → Environment Variables). No key is sent from the client.
- **Request**: Expects `{ messages: [{ role, text }, ...] }`. Validates and builds `apiMessages` with a Tyche system prompt plus conversation.
- **OpenAI**: Calls `https://api.openai.com/v1/chat/completions` with the same model/options as before (e.g. gpt-4o-mini, max_tokens 400).
- **Response**: Returns `{ reply, orbIds }`. `reply` is the assistant text with `[MEMORY:orb-X]` tags stripped. `orbIds` is the list of orb ids extracted from those tags so the client can pulse orbs.
- **Errors**: 400 for bad body; 500 if OPENAI_API_KEY is missing or OpenAI request fails. Response body is `{ error: "..." }`.

---

## 5. What changed in the mobile UX

- **Chat**: On mobile (`isMobile` from store, width < 768px), the chat panel uses `.panelMobile`: full width, bottom-anchored, 70vh height, 24px rounded top corners, so it behaves like a bottom sheet instead of a floating box.
- **Tap targets**: Input and Send are at least 44px tall; close button is 40×40px with comfortable hit area.
- **Safe area**: Chat input row uses `padding-bottom: max(16px, env(safe-area-inset-bottom))` on mobile.
- **Scrolling**: `.body` uses `-webkit-overflow-scrolling: touch` for smoother scroll on iOS.
- **Layout**: Chat wrapper is `left: 0; right: 0; bottom: 0` when `isMobile`, so the sheet is clearly mobile-first.

Orb panel was already mobile-aware (bottom sheet, drag-to-close). No change to orb layout or breakpoints beyond existing behavior.

---

## 6. What changed in the chatbot design

- **Panel**: Deeper gradient background (dark indigo/blue), single cyan-tinted border, soft outer and inner glow so it feels like a relic, not a flat box.
- **Header**: "TYCHE" title with Cinzel and glow; close button is a circular pill with hover state.
- **Bubbles**: User messages have a cyan tint; assistant messages use a dark translucent background and a light border. Reveal state has a subtle glow.
- **Loading**: Rotating phrases: "Tyche is tracing the roots…", "Gathering a memory…", "Listening to the tree…" instead of a generic "Thinking…".
- **Input**: Placeholder "Ask Tyche…"; focus ring and slightly larger font; Send button with enabled/hover glow.
- **Mobile**: Same visual language but in a bottom-sheet layout (see above).

---

## 7. How the typing/reveal effect was implemented

- **Flow**: When the server returns `{ reply, orbIds }`, the hook sets `pendingReply` to the full reply and does not append to `messages` yet. The UI shows a dedicated “reveal” bubble that displays only the currently revealed substring. When the reveal finishes, the hook’s `commitPendingReply()` appends the full message to `messages` and clears `pendingReply`, so the bubble is replaced by the final message.
- **Reveal**: In ChatBot, a `useEffect` runs when `pendingReply` is set. The text is split on whitespace (keeping spaces). A timer advances a slice index; every ~50ms the visible slice grows (by a step derived from desired total duration). Target duration is `max(400ms, numWords * 36ms)`. When the slice reaches the end, `commitPendingReply()` is called.
- **Cursor**: While `pendingReply` is set and not yet fully revealed, a span with class `.cursor` (blinking cyan bar) is shown after the revealed text.
- **Copy**: Error and “empty reply” fallbacks use Tyche-voice copy (e.g. “The tree couldn’t reach the depths just now…”).

---

## 8. How orb video/media was fixed

- **Current behavior**: OrbPanel already had (1) a thumbnail badge (top-right) and (2) an in-content block (`.panelVideoWrap` / `.panelVideo`) when `m.videoSrc` exists. Both use the same `m.videoSrc` (e.g. `/memories/belong-web.mp4`), with `autoPlay`, `loop`, `muted`, `playsInline`, `preload="auto"`.
- **Changes**: Added `onLoadedData` to call `play()` as an extra trigger for environments that need it after load. Added `disablePictureInPicture` for consistent behavior. Paths are root-relative (`/memories/...`), so they work in Vite dev and in production (public assets copied to build root).
- **Mobile**: `playsInline` and `muted` are required for autoplay on iOS; they were already set. If autoplay still fails on some devices, a future improvement is a “Tap to play” overlay when the video is paused after a short delay.

---

## 9. Remaining risks and follow-up

- **Local dev without Vercel**: `fetch('/api/chat')` works on Vercel. For local dev, run `vercel dev` so the `/api` functions are available, or add a Vite proxy to a local Node server that implements the same API.
- **OPENAI_API_KEY**: Must be set in Vercel (and optionally in local `.env` when using `vercel dev`). No client-side key.
- **Orb video autoplay**: On strict mobile browsers, autoplay may still be blocked; consider a play button overlay if users report missing video.
- **TycheMascot**: Still uses `useChatGPT()` for `messages` (bounce on new message). No API key or direct OpenAI usage there; compatible with the new hook.

---

**Summary**: Chat now goes through a server-only `/api/chat` route with a Tyche system prompt; the client no longer uses any API key. The chat UI is restyled for a mystical, Tyche-integrated look and a mobile bottom sheet, with a controlled typing/reveal effect and clearer loading/error copy. Orb panel video was verified and slightly hardened for play and mobile.
