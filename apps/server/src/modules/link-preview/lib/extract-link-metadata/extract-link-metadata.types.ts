export type ExtractLinkMetadataInput = {
  html: string;
  url: string;
};

export type LinkMetadata = {
  title: string;
  description: string | null;
  siteName: string;
  imageUrl: string | null;
};
