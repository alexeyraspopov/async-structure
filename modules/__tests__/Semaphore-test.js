import { Semaphore } from '../Semaphore';

test('immediate resource acquisition', () => {
  let semaphore = new Semaphore();
  expect(semaphore.acquire()).toBe(true);
});

test('awaiting for release', async () => {
  let semaphore = new Semaphore();
  semaphore.acquire();
  setTimeout(() => semaphore.release(), 0);
  await expect(semaphore.acquire()).resolves.toBe(true);
});

test('lock status checker', async () => {
  let semaphore = new Semaphore({ permits: 2 });
  expect(semaphore.locked()).toBe(false);
  semaphore.acquire();
  expect(semaphore.locked()).toBe(false);
  semaphore.acquire();
  expect(semaphore.locked()).toBe(true);
  semaphore.release();
  expect(semaphore.locked()).toBe(false);
});

test('bounded semaphore invariant', () => {
  let semaphore = new Semaphore({ permits: 2, bounded: true });
  let error = 'Bounded semaphore released too many times';
  semaphore.acquire();
  semaphore.release();
  expect(() => semaphore.release()).toThrow(error);
});

test('initial permits validation', () => {
  let error = 'Semaphore permits number must be greater than zero';
  expect(() => new Semaphore({ permits: -1 })).toThrow(error);
  expect(() => new Semaphore({ permits: 'boom' })).toThrow(error);
  expect(() => new Semaphore({ permits: null })).toThrow(error);
  expect(() => new Semaphore({ permits: 0 })).toThrow(error);
});
