export class IdentityMap {
  constructor() {
    this.resources = new Map();
  }

  read(resource, key) {
    if (this.resources.has(resource)) {
      let table = this.resources.get(resource);

      if (table.has(key)) {
        return table.get(key);
      }
    }

    return null;
  }

  write(resource, key, value) {
    if (!this.resources.has(resource)) {
      this.resources.set(resource, new Map());
    }

    let table = this.resources.get(resource);

    table.set(key, value);
  }

  includes(resource, key) {
    if (this.resources.has(resource)) {
      let table = this.resources.get(resource);

      return table.has(key);
    }

    return false;
  }
}
