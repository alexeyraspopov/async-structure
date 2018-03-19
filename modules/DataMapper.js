export class DataMapper {
  constructor(loader) {
    this.loader = loader;
  }

  retrieve(cache, key) {
    if (cache.includes(this, key)) {
      return cache.read(this, key);
    }

    let pending = this.loader(key);

    cache.write(this, key, pending);

    return pending
      .then(value => {
        cache.write(this, key, value);
        return value;
      })
      .catch(error => {
        cache.write(this, key, error);
        throw error;
      });
  }
}
