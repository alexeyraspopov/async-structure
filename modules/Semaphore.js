export class Semaphore {
  constructor({ value = 1, bounded = false } = {}) {
    if (value <= 0 || isNaN(value)) {
      throw new Error('Semaphore value must be greater than zero');
    }

    this.value = value;
    this.max = bounded ? value : Infinity;
    this.pendings = [];
  }

  acquire() {
    if (this.value > 0) {
      this.value = this.value - 1;
      return true;
    }

    return new Promise(resolve => {
      this.pendings.push(() => {
        this.value = this.value - 1;
        resolve(true);
      });
    });
  }

  locked() {
    return this.value === 0;
  }

  release() {
    this.value = this.value + 1;

    if (this.value > this.max) {
      throw new Error('Bounded semaphore release too many times');
    }

    if (this.pendings.length > 0) {
      let resolve = this.pendings.shift();
      resolve();
    }
  }
}
