export type RawInternetServices = {
  [speeds in AvailableSpeeds]?: InternetService[];
};

export type InternetService = {
  offer_id: number; // 5798

  is_private: 0 | 0 | 1; // 1

  is_business: 0 | 0 | 1; // 0

  portal_id: number; // 169

  price: number; // 249

  startPrice: number; // 0

  comparisonPrice: number; // 249

  hasSupport: null | 0 | 1; // 1

  campaignId: number; // 4742

  companyId: number; // 567

  companyName: AvailableProviders; // 'Internetport'

  companyLogo: string; // '/uploads/sp-logos/Internetport-logga-portal.png'

  internetUpSpeed: number; // 100

  internetDownSpeed: number; // 100

  hasFixedIp: null | 0 | 1; // null

  campaignPrice: number; // 85

  /** How many months the campaign last */
  campaignMonths: number; // 3

  campaignStartPrice: number; // null

  campaignComparisonPrice: number; // null

  bindingPeriod: number; // 0

  campaignBindingPeriod: number; // 0

  transferFee: number; // 0

  campaignTransferFee: number; // 0

  name: string; // '100/100 Mbit/s - Halva priset i 3 månader'

  /** in months */
  cancelationPeriod: number; // 1

  /** in months */
  campaignCancelationPeriod: number; // 1

  /** date YYYY-MM-DD */
  campaignEndDate: string;

  /** Number of channels? */
  tvNoChannels: null | number; // null

  hasInternet: null | 0 | 1; // 1

  hasTv: null | 0 | 1; // null

  hasVoip: null | 0 | 1; // null

  hasExtra: null | 0 | 1; // null

  extraOptionId: number; // null
  extraOptionName: string; // null

  /**
   * The shop URL for the user to click in.
   *
   * **NOTE: Not part of the original response, appended by the application.**
   */
  shopURL?: string;
};

export type AvailableSpeeds =
  | '10/10'
  | '100/10'
  | '100/100'
  | '250/100'
  | '500/100'
  | '1000/100'
  | '250/250'
  | '1000/1000'
  | '1000/500'
  | '500/500';

export type AvailableProviders =
  | 'Allente'
  | 'Bahnhof'
  | 'BIK'
  | 'Bitcom'
  | 'Boxer'
  | 'Bredband2'
  | 'Bredbandsson'
  | 'Comviq'
  | 'Halebop'
  | 'Internetport'
  | 'IP Sweden'
  | 'Junet'
  | 'Mediateknik'
  | 'Net at Once'
  | 'Obenetwork'
  | 'Ownit'
  | 'Sappa'
  | 'Surfia'
  | 'Tele2'
  | 'Telenor'
  | 'Telia'
  | 'TOP24';
