'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CategoryDialog, DeleteCategoryDialog } from '@/features/server/manage-category';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui-kit';

import type { CategoryRowMenuProps } from './CategoryRowMenu.types';

export const CategoryRowMenu = ({ category, serverId, className }: CategoryRowMenuProps) => {
  const t = useTranslations('server.channels');

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t('editCategory')}
          className={className}
          size='icon-xs'
          variant='ghost'
          onPointerDown={(event) => event.stopPropagation()}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            {t('editCategory')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onSelect={() => setDeleteOpen(true)}>
            <Trash2 />
            {t('deleteCategory')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoryDialog
        category={category}
        open={editOpen}
        serverId={serverId}
        onOpenChange={setEditOpen}
      />
      <DeleteCategoryDialog
        category={category}
        open={deleteOpen}
        serverId={serverId}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};
