type BikeAddress = {
  postCode: string;
  city: string;
  street: string;
} | null;
type BikePhoto =
  | {
      id: string;
      createdAt: Date;
      url: string;
      sortOrder: number;
    }[]
  | null;

export type BikeResponse = {
  id: string;
  ownerId: string;
  frameNumber: string;
  status: 'active' | 'for_sale' | 'stolen' | 'deleted';
  brand: string;
  model: string;
  year: number;
  color: string;
  type: string;
  frameSize: string | null;
  wheelSize: string | null;
  weight: number | null;
  isElectric: boolean;
  motorBrand: string | null;
  motorPower: number | null;
  batteryCapacity: number | null;
  condition:
    | 'new'
    | 'like_new'
    | 'good'
    | 'fair'
    | 'poor'
    | 'for_parts'
    | 'unknown';
  price: number;
  currency: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
};
export type BikesForSaleResponse = {
  id: string;
  ownerId: string;
  description: string | null;
  status: 'active' | 'for_sale' | 'stolen' | 'deleted';
  brand: string;
  model: string;
  isElectric: boolean;
  condition:
    | 'new'
    | 'like_new'
    | 'good'
    | 'fair'
    | 'poor'
    | 'for_parts'
    | 'unknown';
  price: number;
  updatedAt: Date;
  photo: string | null;
};
export type AddBikeAddressResponse = {
  id: string;
  bikeId: string;
  postCode: string;
  city: string;
  street: string;
};
export type GetBikeByIdResponse = {
  bike: BikeResponse;
  address: BikeAddress;
  photos: BikePhoto;
};
