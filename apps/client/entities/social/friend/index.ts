export {
  useAcceptFriendRequest,
  useAcceptIncomingFriendCall,
  useCallFriend,
  useCloseWhenCallAccepted,
  useDeclineFriendRequest,
  useDeclineIncomingFriendCall,
  useFriendCallRingtone,
  useFriends,
  useFriendshipRelation,
  useIncomingFriendCall,
  useIncomingFriendRequests,
  useOutgoingFriendCall,
  useRemoveFriendship,
  useSendFriendRequest,
} from './model/hooks';
export { FriendsRealtimeSync } from './ui/controllers/FriendsRealtimeSync';
export { FriendTag } from './ui/FriendTag';

export type { CallFriendInput } from './model/hooks/use-call-friend';
