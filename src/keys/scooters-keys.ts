type ScootersKeys = 'created' | 'updated' | 'deleted';

export const scooterKey = (key: ScootersKeys) => `scooters.${key}`;
