import { getTranslations } from 'next-intl/server';

import type { HomePageProps } from '../../HomePage.types';

import s from '../../HomePage.module.scss';

const PEER_OFFSETS = [0, 1];

export const HomeFlowDiagram = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.steps.diagram' });

  return (
    <figure className={s.flowDiagram}>
      <svg
        className={s.flowDiagramSvg}
        fill='none'
        role='img'
        viewBox='0 0 640 220'
        xmlns='http://www.w3.org/2000/svg'
      >
        <title>{t('caption')}</title>

        <defs>
          <linearGradient id='home-flow-gradient' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='var(--brand-cyan)' />
            <stop offset='100%' stopColor='var(--brand-violet)' />
          </linearGradient>
        </defs>

        <g stroke='url(#home-flow-gradient)' strokeLinecap='round' strokeWidth='2'>
          <path d='M148 110 H272' opacity='0.7' />

          {PEER_OFFSETS.map((offset) => (
            <path
              key={offset}
              d={`M368 110 H436 Q460 110 460 ${offset === 0 ? 66 : 154} H492`}
              opacity='0.7'
              strokeDasharray='5 7'
            />
          ))}
        </g>

        <g stroke='url(#home-flow-gradient)' strokeWidth='1.5'>
          <rect className={s.flowDiagramNode} height='72' rx='16' width='128' x='20' y='74' />

          <rect className={s.flowDiagramHub} height='96' rx='20' width='96' x='272' y='62' />

          {PEER_OFFSETS.map((offset) => (
            <rect
              key={offset}
              className={s.flowDiagramNode}
              height='64'
              rx='16'
              width='128'
              x='492'
              y={offset === 0 ? 34 : 122}
            />
          ))}
        </g>

        <g className={s.flowDiagramLabel} dominantBaseline='middle' textAnchor='middle'>
          <text x='84' y='110'>
            {t('client')}
          </text>

          <text x='320' y='110'>
            {t('sfu')}
          </text>

          {PEER_OFFSETS.map((offset) => (
            <text key={offset} x='556' y={offset === 0 ? 66 : 154}>
              {t('peers')}
            </text>
          ))}
        </g>
      </svg>

      <figcaption className={s.flowDiagramCaption}>{t('caption')}</figcaption>
    </figure>
  );
};
