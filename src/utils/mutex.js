const instances = new Map();

class Mutex {
  constructor(key) {
    const instance = instances.get(key);

    if (instance) {
      return instance;
    }

    instances.set(key, this);

    this.opened = true;
    this.locked = false;
    this.opening = Promise.resolve();
  }

  lock() {
    this.opening = new Promise((resolve) => {
      this.open = resolve;
    }).then(() => {
      this.opened = true;
      this.closed = false;
      this.opening = Promise.resolve();
    });

    this.opened = false;
    this.closed = true;
  }
}

export default Mutex;
