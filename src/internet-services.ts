import kebabCase from 'lodash/kebabCase';

import type {
  AvailableProviders,
  InternetService,
} from './internet-services.d';

export class InternetServices {
  private _internetServices: InternetService[];
  private isVerbose: boolean;

  constructor(
    internetServices: InternetService[] = [],
    { isVerbose }: { isVerbose: boolean } = { isVerbose: false }
  ) {
    this._internetServices = internetServices;
    this.isVerbose = isVerbose;
  }

  get internetServices(): InternetService[] {
    return this._internetServices;
  }

  /**
   * Filters the Internet Services by the provided binding period
   * @param maxBindingPeriod the max allowed binding period (in months), defaults to 0
   * @returns the updated InternetServices Object
   */
  filterByMaxBindingPeriod(maxBindingPeriod = 0): InternetServices {
    if (this.isVerbose) {
      console.log('🔏  Maximum binding period (in months):', maxBindingPeriod);
    }

    const filteredEntries = this._internetServices.filter(
      service =>
        service.bindingPeriod <= maxBindingPeriod &&
        service.campaignBindingPeriod <= maxBindingPeriod
    );

    if (this.isVerbose) {
      console.log(
        `\t ✔️ filter applied: before: ${
          this._internetServices.length
        }; after: ${filteredEntries.length}; removed: ${
          this._internetServices.length - filteredEntries.length
        }`
      );
    }

    this._internetServices = filteredEntries;
    return this;
  }

  /**
   * Filters the Internet Services by the provided minimum speeds
   * @param minDownloadSpeed The minimum tolerated Download speed, defaults to 0
   * @param minUploadSpeed The minimum tolerated Upload speed, defaults to 0
   * @returns the updated InternetServices Object
   */
  filterByMinSpeeds(
    minDownloadSpeed = 0,
    minUploadSpeed = 0
  ): InternetServices {
    if (this.isVerbose) {
      console.log(
        `⚡ Including only the following speeds: download >= ${minDownloadSpeed}, upload >= ${minUploadSpeed}`
      );
    }

    const filteredEntries = this._internetServices.filter(
      service =>
        service.internetDownSpeed >= minDownloadSpeed &&
        service.internetUpSpeed >= minUploadSpeed
    );

    if (this.isVerbose) {
      console.log(
        `\t ✔️ filter applied: before: ${
          this._internetServices.length
        }; after: ${filteredEntries.length}; removed: ${
          this._internetServices.length - filteredEntries.length
        }`
      );
    }

    this._internetServices = filteredEntries;
    return this;
  }

  /**
   * Filters the Internet Services by excluding the given providers
   * @param excludedProviders the providers to be excluded, defaults to none
   * @returns the updated InternetServices Object
   */
  excludeProviders(
    excludedProviders: AvailableProviders[] = []
  ): InternetServices {
    if (this.isVerbose) {
      console.log('🏢  Excluding the following providers:', excludedProviders);
    }

    const filteredEntries = this._internetServices.filter(
      service =>
        !excludedProviders
          .map(provider => kebabCase(provider.trim()))
          .includes(kebabCase(service.companyName.trim()))
    );

    if (this.isVerbose) {
      console.log(
        `\t ✔️ filter applied: before: ${
          this._internetServices.length
        }; after: ${filteredEntries.length}; removed: ${
          this._internetServices.length - filteredEntries.length
        }`
      );
    }

    this._internetServices = filteredEntries;
    return this;
  }

  /**
   * Filters the Internet Services by excluding the services costing above the provided value
   * @param maxCost The maximum tolerated monthly cost, in SEK, defaults to 500
   * @returns the updated InternetServices Object
   */
  filterByMaxCost(maxCost = 500): InternetServices {
    if (this.isVerbose) {
      console.log(
        '💸  Excluding the services above the following monthly price (in SEK):',
        maxCost
      );
    }

    const filteredEntries = this._internetServices.filter(
      service => service.price <= maxCost
    );

    if (this.isVerbose) {
      console.log(
        `\t ✔️ filter applied: before: ${
          this._internetServices.length
        }; after: ${filteredEntries.length}; removed: ${
          this._internetServices.length - filteredEntries.length
        }`
      );
    }

    this._internetServices = filteredEntries;
    return this;
  }

  /**
   * Filters the Internet Services by excluding the services that have a cancellation period greater than the provided value
   * @param maxPeriod The maximum tolerated cancellation notice period, in months, defaults to 1
   * @returns the updated InternetServices Object
   */
  filterByMaxCancellationPeriod(maxPeriod = 1): InternetServices {
    if (this.isVerbose) {
      console.log(
        '📆  Excluding the services above the following cancellation period (in months):',
        maxPeriod
      );
    }

    const filteredEntries = this._internetServices.filter(
      service => service.cancelationPeriod <= maxPeriod
    );

    if (this.isVerbose) {
      console.log(
        `\t ✔️ filter applied: before: ${
          this._internetServices.length
        }; after: ${filteredEntries.length}; removed: ${
          this._internetServices.length - filteredEntries.length
        }`
      );
    }

    this._internetServices = filteredEntries;
    return this;
  }

  /**
   * Appends a `shopURL` field inside each of the services to allow
   * the user to see the service details in the shop.
   *
   * @param baseUrl the base URL to build the URL string for
   * @returns the updated InternetServices Object
   */
  appendShopUrl(baseUrl = ''): InternetServices {
    this._internetServices = this.internetServices.map(service => {
      const parameters: string[] = [];
      if (service.campaignId) {
        parameters.push(`campaignId=${service.campaignId}`);
      } else if (service.offer_id) {
        parameters.push(`offerId=${service.offer_id}`);
      }
      if (service.portal_id) {
        parameters.push(`servicePortalId=${service.portal_id}`);
      }

      return {
        ...service,
        shopURL:
          (parameters.length === 2 &&
            `${baseUrl}/erbjudande/#${parameters.join('&')}`) ||
          '',
      };
    });

    return this;
  }
}

export default InternetServices;
