import { AsyncQueue } from '../AsyncQueue';

test('enqueue before dequeue', async () => {
  let queue = new AsyncQueue();
  queue.enqueue('A');
  queue.enqueue('B');
  let values = Promise.all([queue.dequeue(), queue.dequeue()]);
  return expect(values).resolves.toEqual(['A', 'B']);
});

test('dequeue before enqueue', async () => {
  let queue = new AsyncQueue();
  let values = Promise.all([queue.dequeue(), queue.dequeue()]);
  queue.enqueue('A');
  queue.enqueue('B');
  return expect(values).resolves.toEqual(['A', 'B']);
});

test('throw error like values #1', async () => {
  let queue = new AsyncQueue();
  let error = new Error();
  queue.enqueue(error);
  return expect(queue.dequeue()).rejects.toBe(error);
});

test('throw error like values #2', async () => {
  let queue = new AsyncQueue();
  let error = new Error();
  let value = queue.dequeue();
  queue.enqueue(error);
  return expect(value).rejects.toBe(error);
});

test('async iterable interface', async () => {
  let queue = new AsyncQueue();
  queue.enqueue('A');
  queue.enqueue('B');
  let iterator = queue[Symbol.asyncIterator]();
  let values = Promise.all([iterator.next(), iterator.next()]);
  return expect(values).resolves.toEqual([
    { value: 'A', done: false },
    { value: 'B', done: false },
  ]);
});

test('fallback iterable interface', async () => {
  let queue = new AsyncQueue();
  queue.enqueue('A');
  queue.enqueue('B');
  let iterator = queue[Symbol.iterator]();
  let values = Promise.all([iterator.next(), iterator.next()]);
  return expect(values).resolves.toEqual([
    { value: 'A', done: false },
    { value: 'B', done: false },
  ]);
});
