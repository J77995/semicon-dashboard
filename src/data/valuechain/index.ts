import { CompanyData, CompanySlug } from '@/types/company';

import { nvidia } from './nvidia';
import { samsung } from './samsung';
import { skHynix } from './sk-hynix';
import { microsoft } from './microsoft';
import { google } from './google';
import { amazon } from './amazon';
import { oracle } from './oracle';
import { broadcom } from './broadcom';
import { marvell } from './marvell';
import { micron } from './micron';
import { sandisk } from './sandisk';
import { kioxia } from './kioxia';
import { phison } from './phison';
import { siliconMotion } from './silicon-motion';

export const COMPANY_REGISTRY: Record<CompanySlug, CompanyData> = {
  'nvidia':          nvidia,
  'samsung':         samsung,
  'sk-hynix':        skHynix,
  'microsoft':       microsoft,
  'google':          google,
  'amazon':          amazon,
  'oracle':          oracle,
  'broadcom':        broadcom,
  'marvell':         marvell,
  'micron':          micron,
  'sandisk':         sandisk,
  'kioxia':          kioxia,
  'phison':          phison,
  'silicon-motion':  siliconMotion,
};

export const ALL_COMPANIES: CompanyData[] = Object.values(COMPANY_REGISTRY);

export const getCompany = (slug: CompanySlug): CompanyData => COMPANY_REGISTRY[slug];

export const getCompaniesByGroup = (group: CompanyData['group']): CompanyData[] =>
  ALL_COMPANIES.filter((c) => c.group === group);

// Re-export individual companies for direct imports
export {
  nvidia,
  samsung,
  skHynix,
  microsoft,
  google,
  amazon,
  oracle,
  broadcom,
  marvell,
  micron,
  sandisk,
  kioxia,
  phison,
  siliconMotion,
};
