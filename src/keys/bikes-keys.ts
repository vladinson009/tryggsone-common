type BikesKeys = 'created' | 'updated' | 'deleted';

export const bikeKey = (key: BikesKeys) => `bikes.${key}`;
