'use client';

import { Anchor, Image } from '@mantine/core';
import { motion } from 'motion/react';

type Props = {
  url: string;
  name: string;
};

export const ChatImageMessage = ({ url, name }: Props) => (
  <motion.div whileHover={{ scale: 1.01 }} style={{ display: 'inline-block', marginTop: 4 }}>
    <Anchor href={url} target="_blank" rel="noreferrer" underline="never">
      <Image
        src={url}
        alt={name}
        radius="md"
        h={200}
        w="auto"
        fit="cover"
        style={{ maxWidth: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
      />
    </Anchor>
  </motion.div>
);
