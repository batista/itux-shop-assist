import { createMock } from 'ts-auto-mock';

import type { InternetService } from './internet-services.d';
import { InternetServices } from './internet-services';

let consoleLogSpy: jest.SpyInstance;

beforeEach(() => {
  // We silence the console for better readability in tests
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
});

afterEach(() => {
  consoleLogSpy.mockRestore();
});

describe('InternetServices', () => {
  describe('new InternetServices()', () => {
    it('should create a new InternetServices object', () => {
      const actual = new InternetServices();

      expect(actual).not.toBe(undefined);
      expect(actual.internetServices).toEqual([]);
      expect(actual['isVerbose']).toBe(false);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('filterByMaxBindingPeriod', () => {
    let internetServicesMock: InternetService[];
    beforeEach(() => {
      internetServicesMock = [
        createMock<InternetService>({ bindingPeriod: 0 }),
        createMock<InternetService>({ bindingPeriod: 1 }),
        createMock<InternetService>({ bindingPeriod: 2 }),
        createMock<InternetService>({ campaignBindingPeriod: 0 }),
        createMock<InternetService>({ campaignBindingPeriod: 1 }),
        createMock<InternetService>({ campaignBindingPeriod: 2 }),
      ];
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });
    afterEach(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    describe('when no binding period is given', () => {
      it('should exclude all with binding period above 0, whether bindingPeriod or campaignBindingPeriod', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual =
          internetServices.filterByMaxBindingPeriod().internetServices;

        expect(actual).toHaveLength(2);
        for (const service of actual) {
          expect(service.bindingPeriod).toBeLessThanOrEqual(0);
          expect(service.campaignBindingPeriod).toBeLessThanOrEqual(0);
        }
      });
    });

    describe('when a binding period is given', () => {
      it('should exclude all with binding period above the given binding period', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual =
          internetServices.filterByMaxBindingPeriod(1).internetServices;

        expect(actual).toHaveLength(4);
        for (const service of actual) {
          expect(service.bindingPeriod).toBeLessThanOrEqual(1);
          expect(service.campaignBindingPeriod).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe('filterByMinSpeeds', () => {
    let internetServicesMock: InternetService[];
    beforeEach(() => {
      internetServicesMock = [
        createMock<InternetService>({
          internetDownSpeed: 10,
          internetUpSpeed: 10,
        }),
        createMock<InternetService>({
          internetDownSpeed: 100,
          internetUpSpeed: 10,
        }),
        createMock<InternetService>({
          internetDownSpeed: 1000,
          internetUpSpeed: 1000,
        }),
        createMock<InternetService>({
          internetDownSpeed: 1000,
          internetUpSpeed: 10,
        }),
        createMock<InternetService>({
          internetDownSpeed: 100,
          internetUpSpeed: 100,
        }),
        createMock<InternetService>({
          internetDownSpeed: 10,
          internetUpSpeed: 1000,
        }),
      ];
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });
    afterEach(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    describe('when no speeds are given', () => {
      it('should exclude all with speeds below 0', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual = internetServices.filterByMinSpeeds().internetServices;

        expect(actual).toHaveLength(6);
        for (const service of actual) {
          expect(service.internetUpSpeed).toBeGreaterThanOrEqual(0);
          expect(service.internetDownSpeed).toBeGreaterThanOrEqual(0);
        }
      });
    });

    describe('when speeds are given', () => {
      it('should exclude all below the given speed', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual = internetServices.filterByMinSpeeds(
          100,
          100
        ).internetServices;

        expect(actual).toHaveLength(2);
        for (const service of actual) {
          expect(service.internetUpSpeed).toBeGreaterThanOrEqual(100);
          expect(service.internetDownSpeed).toBeGreaterThanOrEqual(100);
        }
      });
    });
  });

  describe('excludeProviders', () => {
    let internetServicesMock: InternetService[];
    beforeEach(() => {
      internetServicesMock = [
        createMock<InternetService>({ companyName: 'Allente' }),
        createMock<InternetService>({ companyName: 'Bahnhof' }),
        createMock<InternetService>({ companyName: 'Junet' }),
        createMock<InternetService>({ companyName: 'Internetport' }),
        createMock<InternetService>({ companyName: 'Bredband2' }),
        createMock<InternetService>({ companyName: 'Allente' }),
      ];
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });
    afterEach(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    describe('when no parameter is passed', () => {
      it('should not exclude anyone', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual = internetServices.excludeProviders().internetServices;

        expect(actual).toHaveLength(6);
      });
    });

    describe('when a single provider is passed', () => {
      it('should exclude it', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual = internetServices.excludeProviders([
          'Allente',
        ]).internetServices;

        expect(actual).toHaveLength(4);
        for (const service of actual) {
          expect(service.companyName).not.toEqual('Allente');
        }
      });
    });

    describe('when several providers are passed', () => {
      it('should exclude them', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(6);

        const actual = internetServices.excludeProviders([
          'Allente',
          'Bredband2',
        ]).internetServices;

        expect(actual).toHaveLength(3);
        for (const service of actual) {
          expect(service.companyName).not.toEqual('Allente');
          expect(service.companyName).not.toEqual('Bredband2');
        }
      });
    });
  });

  describe('filterByMaxCost', () => {
    let internetServicesMock: InternetService[];
    beforeEach(() => {
      internetServicesMock = [
        createMock<InternetService>({ price: 300 }),
        createMock<InternetService>({ price: 400 }),
        createMock<InternetService>({ price: 500 }),
        createMock<InternetService>({ price: 600 }),
        createMock<InternetService>({ price: 700 }),
      ];
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });
    afterEach(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    describe('when no max cost is given', () => {
      it('should exclude all with price above 500', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(5);

        const actual = internetServices.filterByMaxCost().internetServices;

        expect(actual).toHaveLength(3);
        for (const service of actual) {
          expect(service.price).toBeLessThanOrEqual(500);
        }
      });
    });

    describe('when a max cost is given', () => {
      it('should exclude all with cost above the given value', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(5);

        const actual = internetServices.filterByMaxCost(400).internetServices;

        expect(actual).toHaveLength(2);
        for (const service of actual) {
          expect(service.price).toBeLessThanOrEqual(400);
        }
      });
    });
  });

  describe('filterByMaxCancellationPeriod', () => {
    let internetServicesMock: InternetService[];
    beforeEach(() => {
      internetServicesMock = [
        createMock<InternetService>({ cancelationPeriod: 0 }),
        createMock<InternetService>({ cancelationPeriod: 1 }),
        createMock<InternetService>({ cancelationPeriod: 2 }),
      ];
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    describe('when no max cancellation period is given', () => {
      it('should exclude all with cancellation period above 1 month', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(3);

        const actual =
          internetServices.filterByMaxCancellationPeriod().internetServices;

        expect(actual).toHaveLength(2);
        for (const service of actual) {
          expect(service.cancelationPeriod).toBeLessThanOrEqual(1);
        }
      });
    });

    describe('when a max cost is given', () => {
      it('should exclude all with cancellation period above the given value', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(3);

        const actual =
          internetServices.filterByMaxCancellationPeriod(0).internetServices;

        expect(actual).toHaveLength(1);
        for (const service of actual) {
          expect(service.cancelationPeriod).toBeLessThanOrEqual(0);
        }
      });
    });
  });

  describe('appendShopUrl', () => {
    let internetServicesMock: InternetService[];
    beforeEach(() => {
      internetServicesMock = [
        createMock<InternetService>({ campaignId: 1, portal_id: 100 }),
        createMock<InternetService>({ offer_id: 2, portal_id: 200 }),
        createMock<InternetService>({ portal_id: 200 }),
        createMock<InternetService>({ offer_id: 1 }),
        createMock<InternetService>({ campaignId: 1 }),
      ];
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });

    describe('when no baseUrl is given', () => {
      it('should skip the baseUrl', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(5);

        const actual = internetServices.appendShopUrl().internetServices;

        expect(actual).toHaveLength(5);
        // eslint-disable-next-line github/array-foreach
        actual.forEach((service, index) => {
          expect(service.shopURL).toBeDefined();
          if (index < 2) {
            expect(service.shopURL).toContain('/erbjudande/#');
          } else {
            expect(service.shopURL).toBe('');
          }
        });
      });
    });

    describe('when a baseUrl is given', () => {
      it('should append a shopURL to all the elements', () => {
        const internetServices = new InternetServices(internetServicesMock, {
          isVerbose: true,
        });
        expect(internetServices.internetServices).toHaveLength(5);

        const actual =
          internetServices.appendShopUrl('my-base-url').internetServices;

        expect(actual).toHaveLength(5);

        expect(actual[0].shopURL).toEqual(
          'my-base-url/erbjudande/#campaignId=1&servicePortalId=100'
        );
        expect(actual[1].shopURL).toEqual(
          'my-base-url/erbjudande/#offerId=2&servicePortalId=200'
        );
        expect(actual[2].shopURL).toEqual('');
        expect(actual[3].shopURL).toEqual('');
        expect(actual[4].shopURL).toEqual('');
      });
    });
  });
});
