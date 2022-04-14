const endpoint = {
  http: {
    devnet: 'http://api.devnet.solana.com',
    testnet: 'http://k2-testnet.koii.live',
    'mainnet-beta': 'http://api.mainnet-beta.solana.com',
  },
  https: {
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://k2-testnet.koii.live',
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  },
};

export type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

/**
 * Retrieves the RPC API URL for the specified cluster
 */
export function clusterApiUrl(cluster?: Cluster, tls?: boolean): string {
  const key = tls === false ? 'http' : 'https';

  if (!cluster) {
    return endpoint[key]['devnet'];
  }

  const url = endpoint[key][cluster];
  if (!url) {
    throw new Error(`Unknown ${key} cluster: ${cluster}`);
  }
  return url;
}
