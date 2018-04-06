export class Semaphore {
  constructor({ permits = 1, bounded = false } = {}) {
    if (permits <= 0 || isNaN(permits)) {
      throw new Error('Semaphore permits number must be greater than zero');
    }

    this.permits = permits;
    this.max = bounded ? permits : Infinity;
    this.pendings = [];
  }

  acquire() {
    if (this.permits > 0) {
      this.permits = this.permits - 1;
      return true;
    }

    return new Promise(resolve => {
      this.pendings.push(() => resolve(this.acquire()));
    });
  }

  locked() {
    return this.permits === 0;
  }

  release() {
    this.permits = this.permits + 1;

    if (this.permits > this.max) {
      throw new Error('Bounded semaphore released too many times');
    }

    if (this.pendings.length > 0) {
      let resolve = this.pendings.shift();
      resolve();
    }
  }
}
