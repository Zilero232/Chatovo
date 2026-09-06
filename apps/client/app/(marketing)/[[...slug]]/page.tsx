import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { createElement } from 'react';

import { createMarketingMetadata } from '@/shared/seo';

import type { MarketingPageProps } from './page.types';

import { marketingStaticParams, resolveMarketingPage } from '../lib';

export const dynamicParams = false;

export const generateStaticParams = () => marketingStaticParams();

export const generateMetadata = async ({ params }: MarketingPageProps): Promise<Metadata> => {
  const { slug } = await params;

  const page = resolveMarketingPage(slug);

  if (!page) {
    return {};
  }

  return createMarketingMetadata({
    locale: page.locale,
    namespace: page.namespace,
    path: page.path
  });
};

const MarketingPage = async ({ params }: MarketingPageProps) => {
  const { slug } = await params;

  const page = resolveMarketingPage(slug);

  if (!page) {
    notFound();
  }

  return createElement(page.view, { locale: page.locale });
};

export default MarketingPage;
