import { makeObservable } from "mobx";
import { warn, fail, isPrimitive } from "./utils";

export class ObjectNode {
  constructor(type, snapshot) {
    this.type = type;
    makeObservable(this, {});
    this.initialize(snapshot);

    // Stand-in for hooks. TODO: implement hooks?
    if (typeof this.afterCreate === "function") this.afterCreate();
  }

  initialize(snapshot = {}) {
    this.type.initializers.reduce((self, fn) => fn(self), this);
    for (const prop in snapshot) {
      if (!(prop in this.type.properties)) {
        console.log(`${prop} not in ${this.type.name}`)
        this[prop] = snapshot[prop]
      }
      else {
        let type = this.type.properties[prop];
        switch (type) {
          case null:
            if (!isPrimitive(snapshot[prop]))
              throw fail(`(property: ${prop}) Expected a primitive`);

            this[prop] = snapshot[prop];
            break;
          case Object:
            Object.assign(this[prop], snapshot[prop]);
            break;
          case Map:
            if (!snapshot[prop] instanceof Object)
              throw fail(
                `(property: ${prop}) Unable to convert snapshot type '${typeof snapshot[
                  prop
                  ]}' to declared type ${type}.`
              );

            Object.keys(snapshot[prop]).forEach((key) => {
              this[prop].set(key, snapshot[prop][key]);
            });
            break;

          case Array:
            if (!Array.isArray(snapshot[prop]))
              throw fail(
                `(property: ${prop}) Unable to convert snapshot property to declared type ${type}.`
              );

            this[prop] = snapshot[prop];
            break;

          default:
            throw warn(`No initialization logic for type ${this.type.properties}`);
            // this[prop] = snapshot[prop];
        }
      }
    }
  }
}
