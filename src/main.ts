#!/usr/bin/env node
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import kebabCase from 'lodash/kebabCase';
import yargs from 'yargs';

import type {
  AvailableProviders,
  InternetService,
  RawInternetServices,
} from './internet-services.d';
import { InternetServices } from './internet-services';

const BASE_URLS = {
  itux: `https://itux.se`,
  framtidensbredband: `https://www.framtidensbredband.se`,
};

const argv = yargs(process.argv.slice(2))
  .options({
    shop: {
      alias: 's',
      description:
        '🛒  The network provider that you are supposed to buy from, defaults to itux',
      choices: ['itux', 'framtidensbredband'] as const,
    },
    'exclude-providers': {
      alias: 'p',
      description: `🏢  The space separated list of providers to exclude, 
      
      ex. your current provider, or a provider with bad reviews at https://reco.se.

      Use the --list-providers option to list the available providers`,
      type: 'array',
      default: [],
    },
    'list-providers': {
      description: `ℹ️  Lists the available service providers.`,
      type: 'boolean',
    },
    'min-download-speed': {
      alias: 'd',
      description: '🔽  The minimum tolerated download speed.',
      type: 'number',
      default: 100,
    },
    'min-upload-speed': {
      alias: 'u',
      description: '🔼  The minimum tolerated upload speed.',
      type: 'number',
      default: 100,
    },
    'max-cost': {
      alias: 'c',
      description: '💸  The maximum tolerated monthly cost in SEK.',
      type: 'number',
      default: 500,
    },
    'max-binding-period': {
      alias: 'b',
      description: '🔏  The maximum tolerated binding period.',
      type: 'number',
      default: 0,
    },
    verbose: {
      alias: 'v',
      description: '💬  Writes more to the console describing each step',
      type: 'boolean',
      default: false,
    },
  })
  .help()
  .alias('help', 'h')
  .parseSync();

const isVerbose = argv.verbose;
const shop = argv.shop || 'itux';

/** URL to fetch the possible choices from */
const URL = `${BASE_URLS[shop]}/private-services.json`;

/**
 * List of provider names we want to exclude, ex your current provider
 */
const excludedProviders: AvailableProviders[] =
  (argv.excludeProviders as AvailableProviders[]) ||
  getDefaultExcludedProviders();

function getDefaultExcludedProviders(): AvailableProviders[] {
  return [];
}

const minDownloadSpeed = argv.minDownloadSpeed || 100;
const minUploadSpeed = argv.minUploadSpeed || 100;

const maxCost = argv.maxCost || 500;

const maxBindingPeriod = argv.maxBindingPeriod || 0;

/**
 * Handles the API request
 * @param url the url to get the response from
 * @returns the API response
 */
async function getServices(url): Promise<AxiosResponse<any, any>> {
  if (isVerbose) {
    console.log(`Fetching data from ${url}`);
  }
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

/**
 * Flattens the response to only include the InternetServices
 * @param _rawInternetServices the raw response from the API
 * @returns A flattened array of internet services
 */
function flattenRawInternetServices(
  _rawInternetServices: RawInternetServices
): InternetService[] {
  const flattened: InternetService[] = [];
  for (const [_, value] of Object.entries(_rawInternetServices)) {
    flattened.push(...value);
  }
  return flattened;
}

/**
 * The starter function
 */
async function start(): Promise<void> {
  console.log('=========================');
  console.log('|  Itux Shop Assistant  |');
  console.log('=========================');
  console.log(
    'For bugs please report/suggest PRs at https://github.com/batista/itux-shop-assist/'
  );
  console.log('Thanks for using this!');

  const response = await getServices(URL);
  if (
    !response ||
    response.status !== 200 ||
    !response.data?.services?.internet
  ) {
    console.error('No data was found');
    console.dir(response);
    process.exit(1);
  }
  const rawInternetServices: RawInternetServices =
    response.data?.services?.internet;
  if (isVerbose) {
    console.log('Response from the server:');
    console.dir(rawInternetServices, { depth: 0 });
  }

  const internetServices = new InternetServices(
    flattenRawInternetServices(rawInternetServices),
    { isVerbose }
  );

  if (argv.listProviders) {
    const providers = [
      ...new Set(
        internetServices.internetServices.map(service => {
          return kebabCase(service.companyName.trim());
        })
      ),
    ];

    console.log(`Found ${providers.length} available providers @${shop}`);
    console.dir(providers);

    process.exit(0);
  }

  const result = internetServices
    .filterByMaxBindingPeriod(maxBindingPeriod)
    .filterByMinSpeeds(minDownloadSpeed, minUploadSpeed)
    .excludeProviders(excludedProviders)
    .filterByMaxCost(maxCost)
    .filterByMaxCancellationPeriod()
    .appendShopUrl(BASE_URLS[shop])
    .internetServices.sort((serviceA, serviceB) => {
      const comparePriceA = serviceA.campaignPrice || serviceA.price;
      const comparePriceB = serviceB.campaignPrice || serviceB.price;

      return comparePriceA - comparePriceB;
    });

  if (!isVerbose) {
    console.log(
      `The provided configuration resulted in ${result.length} candidates, below you have the details for each:`
    );
    console.dir(
      result.map(service => service.shopURL),
      { depth: 1 }
    );
  } else {
    console.log(
      `The provided configuration resulted in ${result.length} candidates, below you have the link for each:`
    );
    console.dir(result);
  }

  process.exit(0);
}

start();
