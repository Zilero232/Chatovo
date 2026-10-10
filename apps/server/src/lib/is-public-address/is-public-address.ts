import ipaddr from 'ipaddr.js';

/**
 * True only for a globally routable unicast address. Private, loopback, link-local, CGNAT,
 * NAT64, multicast and every other special range is refused, IPv4-mapped IPv6 included.
 */
export const isPublicAddress = (address: string): boolean => {
  if (!ipaddr.isValid(address)) {
    return false;
  }

  return ipaddr.process(address).range() === 'unicast';
};
