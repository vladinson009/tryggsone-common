type CarsKeys = 'created' | 'updated' | 'deleted';

export const carKey = (key: CarsKeys) => `cars.${key}`;
