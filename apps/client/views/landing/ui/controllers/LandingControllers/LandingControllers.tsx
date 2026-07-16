import { LandingDocumentSetup } from '../LandingDocumentSetup';
import { LandingLocaleRedirect } from '../LandingLocaleRedirect';
import { TauriLandingRedirect } from '../TauriLandingRedirect';

import type { LandingControllersProps } from './LandingControllers.types';

export const LandingControllers = ({ locale }: LandingControllersProps) => (
  <>
    <LandingDocumentSetup locale={locale} />
    <LandingLocaleRedirect locale={locale} />
    <TauriLandingRedirect />
  </>
);
