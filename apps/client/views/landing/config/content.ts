import {
  AudioWaveform,
  Gauge,
  Link2,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type LandingLocale = 'ru' | 'en';

export const LANDING_HTML_LANG: Record<LandingLocale, string> = {
  ru: 'ru-RU',
  en: 'en-US',
};

type Feature = {
  key: string;
  Icon: LucideIcon;
  title: string;
  description: string;
};

type Step = {
  key: string;
  title: string;
  description: string;
};

type Faq = {
  question: string;
  answer: string;
};

export type LandingContent = {
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  features: {
    heading: string;
    items: Feature[];
  };
  steps: {
    heading: string;
    items: Step[];
  };
  faq: {
    heading: string;
    items: Faq[];
  };
  footer: {
    privacy: string;
    terms: string;
  };
};

const FEATURE_ICONS: Record<string, LucideIcon> = {
  rooms: Sparkles,
  quality: AudioWaveform,
  privacy: ShieldCheck,
  desktop: MonitorSmartphone,
  link: Link2,
  free: Gauge,
};

export const LANDING_CONTENT: Record<LandingLocale, LandingContent> = {
  ru: {
    hero: {
      eyebrow: 'Голосовое общение без лишнего',
      title: 'Голосовые и видеокомнаты,',
      titleAccent: 'которые просто работают',
      description:
        'Chatovo — это мессенджер с голосовыми и видеокомнатами. Создайте комнату в один клик, отправьте ссылку друзьям и начните разговор — прямо в браузере, без установки и настройки.',
      ctaPrimary: 'Начать бесплатно',
      ctaSecondary: 'Скачать приложение',
    },
    features: {
      heading: 'Что умеет Chatovo',
      items: [
        {
          key: 'rooms',
          Icon: FEATURE_ICONS.rooms,
          title: 'Комната за один клик',
          description:
            'Не нужно создавать сервер, настраивать роли и каналы. Нажали кнопку — комната готова, ссылку можно отправлять.',
        },
        {
          key: 'quality',
          Icon: FEATURE_ICONS.quality,
          title: 'Чистый звук и видео',
          description:
            'Эхоподавление, шумоподавление и автоматическая регулировка громкости. Видео подстраивается под скорость интернета.',
        },
        {
          key: 'privacy',
          Icon: FEATURE_ICONS.privacy,
          title: 'Приватные комнаты',
          description:
            'Закройте комнату паролем или сделайте её невидимой в общем списке. Кто зайдёт — решаете вы.',
        },
        {
          key: 'desktop',
          Icon: FEATURE_ICONS.desktop,
          title: 'Браузер и приложение',
          description:
            'Работает в любом современном браузере. Нужны горячие клавиши и режим рации — поставьте приложение для Windows, macOS или Linux.',
        },
        {
          key: 'link',
          Icon: FEATURE_ICONS.link,
          title: 'Вход по ссылке',
          description:
            'Друзьям достаточно открыть ссылку. Никаких приглашений в сервер и долгой регистрации перед разговором.',
        },
        {
          key: 'free',
          Icon: FEATURE_ICONS.free,
          title: 'Бесплатно',
          description:
            'Без платных тарифов и ограничений на длительность разговора. Проект открытый — его можно развернуть у себя.',
        },
      ],
    },
    steps: {
      heading: 'Как это работает',
      items: [
        {
          key: 'create',
          title: 'Создайте комнату',
          description:
            'Придумайте название и при желании поставьте пароль. Это займёт несколько секунд.',
        },
        {
          key: 'share',
          title: 'Отправьте ссылку',
          description: 'Скопируйте ссылку на комнату и отправьте тем, с кем хотите поговорить.',
        },
        {
          key: 'talk',
          title: 'Общайтесь',
          description: 'Голос, видео, демонстрация экрана и чат — всё в одном окне.',
        },
      ],
    },
    faq: {
      heading: 'Частые вопросы',
      items: [
        {
          question: 'Chatovo — это бесплатно?',
          answer:
            'Да. Все голосовые и видеокомнаты доступны бесплатно, без ограничений на длительность разговора и без платных тарифов.',
        },
        {
          question: 'Нужно ли устанавливать программу?',
          answer:
            'Нет. Chatovo полностью работает в браузере — достаточно открыть сайт. Приложение для Windows, macOS и Linux нужно только если вам важны глобальные горячие клавиши и режим рации.',
        },
        {
          question: 'Чем Chatovo отличается от Discord?',
          answer:
            'Chatovo сделан вокруг разговора, а не вокруг сервера. Не нужно создавать сервер, настраивать роли и каналы: создали комнату, отправили ссылку — и общаетесь. Проект открытый, его можно развернуть на своём сервере.',
        },
        {
          question: 'Можно ли закрыть комнату от посторонних?',
          answer:
            'Да. Комнату можно защитить паролем или скрыть из общего списка — тогда попасть в неё можно только по прямой ссылке.',
        },
        {
          question: 'Сколько человек помещается в комнату?',
          answer:
            'Комнаты рассчитаны на разговор небольшой компанией — от двух человек до десятков участников одновременно, с голосом, видео и демонстрацией экрана.',
        },
        {
          question: 'Нужна ли регистрация?',
          answer:
            'Для создания комнаты и общения нужен аккаунт — регистрация по электронной почте занимает меньше минуты.',
        },
      ],
    },
    footer: {
      privacy: 'Конфиденциальность',
      terms: 'Условия использования',
    },
  },
  en: {
    hero: {
      eyebrow: 'Voice chat without the setup',
      title: 'Voice and video rooms',
      titleAccent: 'that just work',
      description:
        'Chatovo is a messenger built around voice and video rooms. Create a room in one click, share the link, and start talking — right in the browser, with nothing to install or configure.',
      ctaPrimary: 'Start for free',
      ctaSecondary: 'Download the app',
    },
    features: {
      heading: 'What Chatovo does',
      items: [
        {
          key: 'rooms',
          Icon: FEATURE_ICONS.rooms,
          title: 'A room in one click',
          description:
            'No server to create, no roles or channels to configure. Press one button and the room is ready to share.',
        },
        {
          key: 'quality',
          Icon: FEATURE_ICONS.quality,
          title: 'Clear voice and video',
          description:
            'Echo cancellation, noise suppression and automatic gain control. Video adapts to your connection speed.',
        },
        {
          key: 'privacy',
          Icon: FEATURE_ICONS.privacy,
          title: 'Private rooms',
          description:
            'Lock a room with a password or hide it from the public list. You decide who gets in.',
        },
        {
          key: 'desktop',
          Icon: FEATURE_ICONS.desktop,
          title: 'Browser and desktop',
          description:
            'Runs in any modern browser. Install the Windows, macOS or Linux app when you want global shortcuts and push-to-talk.',
        },
        {
          key: 'link',
          Icon: FEATURE_ICONS.link,
          title: 'Join by link',
          description:
            'Your friends just open a link. No server invites and no long sign-up before the conversation starts.',
        },
        {
          key: 'free',
          Icon: FEATURE_ICONS.free,
          title: 'Free to use',
          description:
            'No paid tiers and no time limits on calls. The project is open source, so you can self-host it.',
        },
      ],
    },
    steps: {
      heading: 'How it works',
      items: [
        {
          key: 'create',
          title: 'Create a room',
          description: 'Give it a name and add a password if you want. It takes a few seconds.',
        },
        {
          key: 'share',
          title: 'Share the link',
          description: 'Copy the room link and send it to whoever you want to talk to.',
        },
        {
          key: 'talk',
          title: 'Start talking',
          description: 'Voice, video, screen sharing and chat — all in one window.',
        },
      ],
    },
    faq: {
      heading: 'Frequently asked questions',
      items: [
        {
          question: 'Is Chatovo free?',
          answer:
            'Yes. Every voice and video room is free to use, with no time limits on calls and no paid tiers.',
        },
        {
          question: 'Do I need to install anything?',
          answer:
            'No. Chatovo runs entirely in the browser — just open the site. The Windows, macOS and Linux app is only needed if you want global shortcuts and push-to-talk.',
        },
        {
          question: 'How is Chatovo different from Discord?',
          answer:
            'Chatovo is built around the conversation rather than the server. There is no server to create and no roles or channels to configure: make a room, share the link, and talk. The project is open source and can be self-hosted.',
        },
        {
          question: 'Can I keep a room private?',
          answer:
            'Yes. A room can be protected with a password or hidden from the public list, so it is reachable only through a direct link.',
        },
        {
          question: 'How many people fit in a room?',
          answer:
            'Rooms are built for small groups — from two people up to dozens of participants at once, with voice, video and screen sharing.',
        },
        {
          question: 'Do I need an account?',
          answer:
            'Creating a room and talking requires an account — signing up with your email takes less than a minute.',
        },
      ],
    },
    footer: {
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },
};
