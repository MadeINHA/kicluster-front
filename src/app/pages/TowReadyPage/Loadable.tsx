/**
 * Asynchronously loads the component for TowReadyPage
 */

import { lazyLoad } from 'utils/loadable';

export const TowReadyPage = lazyLoad(
  () => import('./index'),
  module => module.TowReadyPage,
);
