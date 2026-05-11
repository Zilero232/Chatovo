'use client';

import { ActionIcon, FileButton, Group, Loader, Paper, TextInput } from '@mantine/core';
import { Paperclip, Send } from 'lucide-react';
import { motion } from 'motion/react';

type Props = {
  value: string;
  isSending: boolean;
  uploading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onUpload: (file: File | null) => void;
};

export const ChatComposer = ({
  value,
  isSending,
  uploading,
  onChange,
  onSend,
  onUpload,
}: Props) => {
  const canSend = !!value.trim() && !isSending;

  return (
    <Paper
      p={4}
      radius="lg"
      bg="dark.6"
      withBorder={false}
      style={{ transition: 'box-shadow 200ms ease' }}
      styles={{
        root: {
          '&:focus-within': { boxShadow: '0 0 0 2px var(--mantine-color-indigo-6)' },
        },
      }}
    >
      <Group gap={4} align="center" wrap="nowrap" pl="xs">
        <FileButton onChange={onUpload} disabled={uploading}>
          {(props) => (
            <ActionIcon
              {...props}
              variant="subtle"
              color="gray"
              size="lg"
              radius="md"
              aria-label="Attach file"
              disabled={uploading}
            >
              {uploading ? <Loader size={14} /> : <Paperclip size={18} />}
            </ActionIcon>
          )}
        </FileButton>
        <TextInput
          flex={1}
          variant="unstyled"
          placeholder="Message"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          styles={{ input: { padding: '0 4px' } }}
        />
        <motion.div whileTap={{ scale: 0.92 }}>
          <ActionIcon
            variant="gradient"
            gradient={{ from: 'indigo', to: 'violet', deg: 135 }}
            size="lg"
            radius="md"
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send"
            style={{ boxShadow: canSend ? '0 4px 12px rgba(99, 102, 241, 0.4)' : undefined }}
          >
            <Send size={14} />
          </ActionIcon>
        </motion.div>
      </Group>
    </Paper>
  );
};
