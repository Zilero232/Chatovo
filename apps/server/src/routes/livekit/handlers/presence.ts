import { streamSSE } from 'hono/streaming';
import { verifyAccessToken } from '../../../lib/auth';
import { getSnapshot, subscribe } from '../presence';
import type { Handler } from 'hono';
import type { Env } from '../../shared/types';

/**
 * Streams live room presence to the client over Server-Sent Events.
 *
 * EventSource cannot send custom headers, so this route authorizes via a
 * `token` query param instead of the shared bearer-header middleware.
 */
export const presenceHandler: Handler<Env> = async (c) => {
  const user = await verifyAccessToken(c.req.query('token'));

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  return streamSSE(c, async (stream) => {
    let closed = false;
    let unsubscribe = () => {};
    let ping: ReturnType<typeof setInterval> | undefined;

    // Tear down once: drop the subscription, stop the keepalive.
    const teardown = () => {
      if (closed) return;

      closed = true;
      clearInterval(ping);
      unsubscribe();
    };

    // Hono's SSE stream wraps a single locked WritableStream writer. Two
    // overlapping writeSSE() calls corrupt the chunked encoding (the browser
    // then reports ERR_INCOMPLETE_CHUNKED_ENCODING). Snapshots and pings can
    // fire concurrently, so funnel every write through one promise chain —
    // each write waits for the previous one to finish.
    let writeChain: Promise<void> = Promise.resolve();

    const enqueueWrite = (event: string, data: string): Promise<void> => {
      writeChain = writeChain.then(async () => {
        if (closed) return;

        try {
          await stream.writeSSE({ event, data });
        } catch {
          // The client (or a proxy) dropped the connection. Stop here so we
          // don't leak a subscription that throws on every future emit().
          teardown();
        }
      });

      return writeChain;
    };

    // Push the current state immediately so the client renders without waiting.
    await enqueueWrite('snapshot', JSON.stringify(getSnapshot()));

    unsubscribe = subscribe((snapshot) => {
      void enqueueWrite('snapshot', JSON.stringify(snapshot));
    });

    // Keep the connection alive through proxies that drop idle streams.
    ping = setInterval(() => {
      void enqueueWrite('ping', '');
    }, 25_000);

    // streamSSE resolves the callback = closes the stream; block until the
    // client disconnects, then release the subscription and keepalive timer.
    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        teardown();
        resolve();
      });
    });
  });
};
