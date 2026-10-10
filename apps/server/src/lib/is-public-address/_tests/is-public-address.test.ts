import { describe, expect, it } from 'vitest';

import { isPublicAddress } from '../is-public-address';

describe('isPublicAddress', () => {
  it.each(['8.8.8.8', '185.199.110.133', '2606:4700::1111'])(
    'allows the public address %s',
    (address) => {
      expect(isPublicAddress(address)).toBe(true);
    }
  );

  it.each([
    ['loopback', '127.0.0.1'],
    ['a private network', '10.1.2.3'],
    ['a private network', '192.168.0.10'],
    ['a private network', '172.16.5.4'],
    ['the cloud metadata endpoint', '169.254.169.254'],
    ['carrier-grade NAT', '100.64.0.1'],
    ['the unspecified address', '0.0.0.0'],
    ['IPv6 loopback', '::1'],
    ['an IPv6 unique-local address', 'fd00::1'],
    ['loopback hidden in an IPv4-mapped IPv6 address', '::ffff:127.0.0.1'],
    ['a private network hidden in an IPv4-mapped IPv6 address', '::ffff:10.0.0.1'],
    ['multicast', '224.0.0.1']
  ])('refuses %s (%s)', (_, address) => {
    expect(isPublicAddress(address)).toBe(false);
  });

  it('refuses a string that is not an address', () => {
    expect(isPublicAddress('localhost')).toBe(false);
  });
});
