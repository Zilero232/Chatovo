import { StatusCodes } from 'http-status-codes';
import {
  acceptFriendRequest,
  acceptIncomingFriendCall,
  ackOutgoingFriendCall,
  cancelOutgoingFriendCall,
  declineFriendRequest,
  declineIncomingFriendCall,
  findUserByTag,
  getFriendshipRelation,
  getIncomingFriendCall,
  getOrCreateDmRoom,
  getOutgoingFriendCall,
  listFriends,
  listIncomingRequests,
  removeFriendship,
  ringFriendCall,
  sendFriendRequest,
} from './friends.service';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type {
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

export const listFriendsHandler: RouteHandler<typeof listFriendsRoute, Env> = async (c) => {
  const userId = c.get('userId');

  return c.json(await listFriends(userId), StatusCodes.OK);
};

export const listIncomingRequestsHandler: RouteHandler<
  typeof listIncomingRequestsRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  return c.json(await listIncomingRequests(userId), StatusCodes.OK);
};

export const getFriendshipRelationHandler: RouteHandler<
  typeof getFriendshipRelationRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');
  const { userId: otherUserId } = c.req.valid('param');

  return c.json(await getFriendshipRelation(userId, otherUserId), StatusCodes.OK);
};

export const sendFriendRequestHandler: RouteHandler<typeof sendFriendRequestRoute, Env> = async (
  c,
) => {
  const userId = c.get('userId');
  const { tag } = c.req.valid('json');

  return c.json(await sendFriendRequest(userId, tag), StatusCodes.OK);
};

export const findUserByTagHandler: RouteHandler<typeof findUserByTagRoute, Env> = async (c) => {
  const { tag } = c.req.valid('param');

  return c.json(await findUserByTag(tag), StatusCodes.OK);
};

export const acceptFriendRequestHandler: RouteHandler<
  typeof acceptFriendRequestRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');
  const { id } = c.req.valid('param');

  return c.json(await acceptFriendRequest(userId, id), StatusCodes.OK);
};

export const declineFriendRequestHandler: RouteHandler<
  typeof declineFriendRequestRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');
  const { id } = c.req.valid('param');

  await declineFriendRequest(userId, id);

  return c.body(null, StatusCodes.NO_CONTENT);
};

export const removeFriendshipHandler: RouteHandler<typeof removeFriendshipRoute, Env> = async (
  c,
) => {
  const userId = c.get('userId');
  const { userId: otherUserId } = c.req.valid('param');

  await removeFriendship(userId, otherUserId);

  return c.body(null, StatusCodes.NO_CONTENT);
};

export const getOrCreateDmRoomHandler: RouteHandler<typeof getOrCreateDmRoomRoute, Env> = async (
  c,
) => {
  const userId = c.get('userId');
  const { userId: otherUserId } = c.req.valid('param');

  return c.json(await getOrCreateDmRoom(userId, otherUserId), StatusCodes.OK);
};

export const ringFriendCallHandler: RouteHandler<typeof ringFriendCallRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { userId: otherUserId } = c.req.valid('param');

  return c.json(await ringFriendCall(userId, otherUserId), StatusCodes.OK);
};

export const getIncomingFriendCallHandler: RouteHandler<
  typeof getIncomingFriendCallRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  return c.json(await getIncomingFriendCall(userId), StatusCodes.OK);
};

export const acceptIncomingFriendCallHandler: RouteHandler<
  typeof acceptIncomingFriendCallRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  return c.json(await acceptIncomingFriendCall(userId), StatusCodes.OK);
};

export const declineIncomingFriendCallHandler: RouteHandler<
  typeof declineIncomingFriendCallRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  await declineIncomingFriendCall(userId);

  return c.body(null, StatusCodes.NO_CONTENT);
};

export const cancelOutgoingFriendCallHandler: RouteHandler<
  typeof cancelOutgoingFriendCallRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  await cancelOutgoingFriendCall(userId);

  return c.body(null, StatusCodes.NO_CONTENT);
};

export const getOutgoingFriendCallHandler: RouteHandler<
  typeof getOutgoingFriendCallRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  return c.json(await getOutgoingFriendCall(userId), StatusCodes.OK);
};

export const ackOutgoingFriendCallHandler: RouteHandler<
  typeof ackOutgoingFriendCallRoute,
  Env
> = async (c) => {
  const userId = c.get('userId');

  await ackOutgoingFriendCall(userId);

  return c.body(null, StatusCodes.NO_CONTENT);
};
