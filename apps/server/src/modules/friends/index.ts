import { OpenAPIHono } from '@hono/zod-openapi';
import {
  acceptFriendRequestHandler,
  acceptIncomingFriendCallHandler,
  ackOutgoingFriendCallHandler,
  cancelOutgoingFriendCallHandler,
  declineFriendRequestHandler,
  declineIncomingFriendCallHandler,
  findUserByTagHandler,
  getFriendshipRelationHandler,
  getIncomingFriendCallHandler,
  getOrCreateDmRoomHandler,
  getOutgoingFriendCallHandler,
  listFriendsHandler,
  listIncomingRequestsHandler,
  removeFriendshipHandler,
  ringFriendCallHandler,
  sendFriendRequestHandler,
} from './handlers';
import {
  acceptFriendRequestRoute,
  acceptIncomingFriendCallRoute,
  ackOutgoingFriendCallRoute,
  cancelOutgoingFriendCallRoute,
  declineFriendRequestRoute,
  declineIncomingFriendCallRoute,
  findUserByTagRoute,
  getFriendshipRelationRoute,
  getIncomingFriendCallRoute,
  getOrCreateDmRoomRoute,
  getOutgoingFriendCallRoute,
  listFriendsRoute,
  listIncomingRequestsRoute,
  removeFriendshipRoute,
  ringFriendCallRoute,
  sendFriendRequestRoute,
} from './routes';
import type { Env } from '../../shared/types';

export const friendsRouter = new OpenAPIHono<Env>()
  .openapi(listFriendsRoute, listFriendsHandler)
  .openapi(listIncomingRequestsRoute, listIncomingRequestsHandler)
  .openapi(getFriendshipRelationRoute, getFriendshipRelationHandler)
  .openapi(sendFriendRequestRoute, sendFriendRequestHandler)
  .openapi(findUserByTagRoute, findUserByTagHandler)
  .openapi(acceptFriendRequestRoute, acceptFriendRequestHandler)
  .openapi(declineFriendRequestRoute, declineFriendRequestHandler)
  .openapi(removeFriendshipRoute, removeFriendshipHandler)
  .openapi(getOrCreateDmRoomRoute, getOrCreateDmRoomHandler)
  .openapi(ringFriendCallRoute, ringFriendCallHandler)
  .openapi(getIncomingFriendCallRoute, getIncomingFriendCallHandler)
  .openapi(acceptIncomingFriendCallRoute, acceptIncomingFriendCallHandler)
  .openapi(declineIncomingFriendCallRoute, declineIncomingFriendCallHandler)
  .openapi(cancelOutgoingFriendCallRoute, cancelOutgoingFriendCallHandler)
  .openapi(getOutgoingFriendCallRoute, getOutgoingFriendCallHandler)
  .openapi(ackOutgoingFriendCallRoute, ackOutgoingFriendCallHandler);
