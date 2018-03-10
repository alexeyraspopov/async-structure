export class AsyncQueue {
  constructor() {
    this.values = [];
    this.pendings = [];
  }

  enqueue(value) {
    return enqueue(this, value);
  }

  dequeue() {
    return dequeue(this, identity);
  }

  [Symbol.iterator]() {
    return new AsyncQueueIterator(this);
  }

  [Symbol.asyncIterator]() {
    return new AsyncQueueIterator(this);
  }
}

class AsyncQueueIterator {
  constructor(queue) {
    this.queue = queue;
  }

  next() {
    return dequeue(this.queue, toIteratorResult);
  }
}

function enqueue(queue, value) {
  if (queue.pendings.length > 0) {
    let { resolve, reject } = queue.pendings.shift();
    return value instanceof Error ? reject(value) : resolve(value);
  } else {
    queue.values.push(value);
  }
}

function dequeue(queue, transform) {
  return new Promise((resolve, reject) => {
    let wrappedResolve = compose(resolve, transform);
    if (queue.values.length > 0) {
      let value = queue.values.shift();
      return value instanceof Error ? reject(value) : wrappedResolve(value);
    } else {
      queue.pendings.push({ resolve: wrappedResolve, reject });
    }
  });
}

function compose(f, g) {
  return a => f(g(a));
}

function identity(value) {
  return value;
}

function toIteratorResult(value) {
  return { value, done: false };
}
