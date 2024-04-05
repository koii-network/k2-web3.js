import {expect} from 'chai';

import {clusterApiUrl} from '../src/util/cluster';

describe('Cluster Util', () => {
  it('invalid', () => {
    expect(() => {
      clusterApiUrl('abc123' as any);
    }).to.throw();
  });

  it('devnet', () => {
    expect(clusterApiUrl()).to.eq('https://testnet.koii.live');
    expect(clusterApiUrl('devnet')).to.eq('https://testnet.koii.live');
    expect(clusterApiUrl('testnet', true)).to.eq(
      'https://testnet.koii.network',
    );
    expect(clusterApiUrl('testnet', false)).to.eq(
      'http://testnet.koii.network',
    );
  });
});
