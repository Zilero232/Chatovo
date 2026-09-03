export type ToDaySeriesInput = {
  rows: { createdAt: Date }[];
  from: Date;
  days: number;
};
