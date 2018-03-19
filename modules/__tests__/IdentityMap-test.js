import { IdentityMap } from '../IdentityMap';

test('read from existing cache', () => {
  let cache = new IdentityMap([['resource', new Map([['key', 'value']])]]);
  let result = cache.read('resource', 'key');
  expect(result).toBe('value');
});

test('fallback if no key', () => {
  let cache = new IdentityMap([['resource', new Map()]]);
  let result = cache.read('resource', 'key');
  expect(result).toBe(null);
});

test('fallback if no resource', () => {
  let cache = new IdentityMap();
  let result = cache.read('resource', 'key');
  expect(result).toBe(null);
});

test('write by resource and key', () => {
  let cache = new IdentityMap([['resource', new Map()]]);
  cache.write('resource', 'key', 'value');
  let result = cache.read('resource', 'key');
  expect(result).toBe('value');
});

test('write for new resources', () => {
  let cache = new IdentityMap();
  cache.write('resource', 'key', 'value');
  let result = cache.read('resource', 'key');
  expect(result).toBe('value');
});

test('check for key in resource', () => {
  let cache = new IdentityMap([['resource', new Map([['key', 'value']])]]);
  expect(cache.includes('resource', 'key')).toBe(true);
  expect(cache.includes('resource', 'key2')).toBe(false);
  expect(cache.includes('resource2', 'key')).toBe(false);
});
