export type PartnerType =
  | 'State Channelizing Agency'
  | 'Public Sector Bank'
  | 'Regional Rural Bank'
  | 'NBFC-MFI';

export interface ChannelPartner {
  id: string;
  name: string;
  partnerType: PartnerType;
  state: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  supportedSchemes: string[]; // scheme IDs or ['*'] for all
  capacity: number; // monthly application capacity e.g. 50
  currentLoad: number; // active applications e.g. 35
  processingDays: number; // avg days e.g. 14
  available: boolean;
  contactPhone: string;
  contactEmail: string;
  branchCode: string;
  demoData: boolean;
}
