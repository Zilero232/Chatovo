import type { LandingControllersProps } from './LandingControllers.types';

import { LandingDocumentSetup } from '../LandingDocumentSetup';
import { LandingLocaleRedirect } from '../LandingLocaleRedirect';

export const LandingControllers = ({ locale }: LandingControllersProps) => (
  <>
    <LandingDocumentSetup locale={locale} />
    <LandingLocaleRedirect locale={locale} />
  </>
);
