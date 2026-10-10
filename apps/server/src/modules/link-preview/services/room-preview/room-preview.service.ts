import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import { RoomKind } from '../../../../../generated';
import { clientBaseURL } from '../../../../config/cors';
import { PrismaService } from '../../../../core';
import { getSnapshot } from '../../../livekit';
import { LINK_PREVIEW } from '../../config';
import { describeRoomPreview, renderLinkPreviewHtml } from '../../lib';

@Injectable()
export class RoomPreviewService {
  constructor(private readonly prisma: PrismaService) {}

  private renderDefaultPreview(): string {
    const { defaultTitle, defaultDescription } = LINK_PREVIEW.copy;

    return renderLinkPreviewHtml({
      title: defaultTitle,
      description: defaultDescription,
      url: clientBaseURL
    });
  }

  async renderRoomPreview(roomId: string | undefined): Promise<string> {
    if (isNullish(roomId)) {
      return this.renderDefaultPreview();
    }

    const room = await this.prisma.room.findFirst({
      where: { id: roomId, kind: RoomKind.group },
      select: { name: true, isPrivate: true }
    });

    if (isNullish(room)) {
      return this.renderDefaultPreview();
    }

    const participantCount = getSnapshot().rooms[roomId]?.length ?? 0;

    return renderLinkPreviewHtml({
      title: `${room.name} — ${LINK_PREVIEW.siteName}`,
      description: describeRoomPreview({ isPrivate: room.isPrivate, participantCount }),
      url: `${clientBaseURL}/room?id=${roomId}`
    });
  }
}
