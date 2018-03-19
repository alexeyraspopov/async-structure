import { DataMapper } from '../DataMapper';
import { IdentityMap } from '../IdentityMap';

test('read directly from cache', () => {
  let routine = jest.fn();
  let mapper = new DataMapper(routine);
  let cache = new IdentityMap([[mapper, new Map([['key', 'value']])]]);
  let result = mapper.retrieve(cache, 'key');
  expect(result).toBe('value');
});

test('call the loader routine', () => {
  let routine = jest.fn(() => Promise.resolve('value'));
  let mapper = new DataMapper(routine);
  let cache = new IdentityMap();
  mapper.retrieve(cache, 'key');
  expect(routine).toHaveBeenCalledWith('key');
});

test('preserve pending state', () => {
  let promise = Promise.resolve('value');
  let routine = jest.fn(() => promise);
  let mapper = new DataMapper(routine);
  let cache = new IdentityMap();
  mapper.retrieve(cache, 'key');
  expect(cache.read(mapper, 'key')).toBe(promise);
});

test('persist final resolved value', async () => {
  let routine = jest.fn(() => Promise.resolve('value'));
  let mapper = new DataMapper(routine);
  let cache = new IdentityMap();
  await expect(mapper.retrieve(cache, 'key')).resolves.toBe('value');
  expect(cache.read(mapper, 'key')).toBe('value');
});

test('persist final rejected value', async () => {
  let routine = jest.fn(() => Promise.reject('value'));
  let mapper = new DataMapper(routine);
  let cache = new IdentityMap();
  await expect(mapper.retrieve(cache, 'key')).rejects.toBe('value');
  expect(cache.read(mapper, 'key')).toBe('value');
});
