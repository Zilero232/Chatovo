export type ImageLightboxProps = {
  name: string;
  open: boolean;
  size: number;
  src: string;
  onOpenChange: (open: boolean) => void;
};
