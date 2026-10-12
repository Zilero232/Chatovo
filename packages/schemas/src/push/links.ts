/** Query parameter on `/lobby` that opens the direct chat with that friend. */
export const FRIEND_CHAT_QUERY_PARAM = 'chat';

/** Deep links a tapped push opens, carried in the `link` data field. */
export const PUSH_LINKS = {
  lobby: 'chatovo://lobby',
  friendChat: (friendId: string) =>
    `chatovo://lobby?${FRIEND_CHAT_QUERY_PARAM}=${encodeURIComponent(friendId)}`
};
