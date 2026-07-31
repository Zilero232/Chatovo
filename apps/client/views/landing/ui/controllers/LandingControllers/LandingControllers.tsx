import type { LandingControllersProps } from './LandingControllers.types';

import { LandingDocumentSetup } from '../LandingDocumentSetup/LandingDocumentSetup';
import { LandingLocaleRedirect } from '../LandingLocaleRedirect/LandingLocaleRedirect';

export const LandingControllers = ({ locale }: LandingControllersProps) => (
  <>
    <LandingDocumentSetup locale={locale} />
    <LandingLocaleRedirect locale={locale} />
  </>
);
