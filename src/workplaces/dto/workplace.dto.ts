export type WorkplaceDto = {
  id: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
};
