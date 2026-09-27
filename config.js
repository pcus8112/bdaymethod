/* Public configuration. Never put a Payhip secret or an API key here. */
window.BDAY_CONFIG = Object.freeze({
  version: '1.0.0',
  apiBase: '', // e.g. https://bdaymethod-access.YOUR-SUBDOMAIN.workers.dev
  payhipUrl: '', // BDAY's own product, e.g. https://payhip.com/b/PRODUCT
  salesEnabled: false, // Set true AFTER the real purchase/access check.
  priceUSD: 9,
  bookUrl: 'https://www.amazon.com/dp/B0H87VWCYV',
  brandUrl: 'https://singershamrock.com',
  owner: 'Pierre Christian Ulrich Singer',
  businessForm: 'Entrepreneur individuel (EI)',
  email: 'pcusinger@gmail.com',
  phone: '+33 6 85 57 56 02',
  address: '87 Impasse de la Petite Trémaillère, 71500 Saint-Usuge, France',
  registration: '', // Displayed only when supplied. No pending-SIRET wording.
  mediatorName: '',
  mediatorUrl: '',
  mediatorAddress: '',
  hostingName: 'Cloudflare, Inc.',
  hostingAddress: '101 Townsend Street, San Francisco, CA 94107, USA',
  hostingUrl: 'https://www.cloudflare.com'
});
