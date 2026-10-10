# `model/hooks` structure

## 2.2. `model/hooks` structure

Symmetric to `ui/`: **a hook with types of its own gets its own folder**, a flat file only when there are no types.

```
features/social/friend-chat/model/hooks/
  index.ts                          ← slice barrel
  use-friend-chat-session/
    use-friend-chat-session.ts      ← a hook without types doesn't need a folder,
    index.ts                           but consistency inside the slice wins
  use-friend-chat-unread/
    use-friend-chat-unread.ts
    use-friend-chat-unread.types.ts ← has an Input/Output type → folder required
    index.ts
```

The hook's `index.ts` re-exports both the hook and its types:

```ts
export { useFriendChatUnread } from './use-friend-chat-unread';

export type * from './use-friend-chat-unread.types';
```

A hook's input type is named `Use<Name>Input` ([naming](../shared/naming.md)). If it repeats a component's props, don't duplicate — derive it: `Pick<VoiceRoomProps, 'roomId' | 'onLeave'>`.
