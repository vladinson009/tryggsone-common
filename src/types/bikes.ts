export type Bike = {
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
export type BikePhoto = {
  id: string;
  bikeId: string;
  createdAt: Date;
  url: string;
  sortOrder: number;
};
export type BikeAddress = {
  id: string;
  bikeId: string;
  postCode: string;
  city: string;
  street: string;
};

export type BikeForSale = {
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
export type BikeGetByIdResponse = {
  bike: Bike;
  address: Omit<BikeAddress, 'id, bikeId'> | null;
  photos: Omit<BikePhoto, 'bikeId'>[] | null;
};
