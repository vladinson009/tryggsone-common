export const BIKE_ROUTES = {
  root: '/',
  forSale: '/for-sale',
  addAddress: '/add-address',
  addPhoto: '/add-photo',
  bikeId: '/:bikeId',
  apiBikes: '/api/bikes',
  reportStolen: '/:bikeId/report-stolen',
  reportRecovered: '/:bikeId/report-recovered',
  listForSale: '/:bikeId/list-for-sale',
} as const;
