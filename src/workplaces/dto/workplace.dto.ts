export type WorkplaceDto = {
  id: string;
  name: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
};
