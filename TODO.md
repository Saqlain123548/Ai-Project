# TODO: ChatGPT-like "New Chat" Experience Implementation

## Phase 1: CSS Animations ✅
- [x] Add transition animations to app/globals.css

## Phase 2: New Chat Component ✅
- [x] Create components/chat/new-chat.tsx with:
  - [x] Centered input positioning
  - [x] Dynamic starter messages above input
  - [x] State management for transition (centered → bottom)
  - [x] Smooth animations (200-300ms ease-in-out)

## Phase 3: Update Main Page ✅
- [x] Modify app/page.tsx to:
  - [x] Detect new chat state (messages.length === 0)
  - [x] Render NewChat component for new conversations
  - [x] Track focus/typing to trigger transition
  - [x] Keep existing behavior for ongoing chats

## Phase 4: Testing
- [ ] Test new chat state (centered input with starter messages)
- [ ] Test transition animation on focus/typing
- [ ] Test existing chat behavior (unchanged)
- [ ] Verify responsive design

