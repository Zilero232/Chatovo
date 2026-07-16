export type FaqJsonLdItem = {
  question: string;
  answer: string;
};

export type FaqJsonLdProps = {
  items: readonly FaqJsonLdItem[];
};
