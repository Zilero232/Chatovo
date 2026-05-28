import { isNullish } from 'remeda';
import { Progress } from './progress';
import { Spinner } from './spinner';

type AppSplashProps = {
  message?: string;
  progress?: number;
};

export const AppSplash = ({ message, progress }: AppSplashProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
    <div className="flex size-16 items-center justify-center rounded-2xl glass shadow-glow-violet">
      {isNullish(progress) ? (
        <Spinner size="lg" />
      ) : (
        <Progress className="w-full max-w-xs" value={progress} />
      )}
    </div>

    {message && <p className="text-muted-foreground text-sm">{message}</p>}
  </div>
);
