export { getStripe } from './client'
export {
  stripe,
  createCustomer,
  getCustomer,
  createPaymentIntent,
  confirmPaymentIntent,
  attachPaymentMethod,
  detachPaymentMethod,
  listPaymentMethods,
  setDefaultPaymentMethod,
  createSetupIntent,
} from './server'
