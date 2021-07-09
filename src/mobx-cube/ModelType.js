/**
 * Based on the mobx-state-tree model.ts
 * https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mobx-state-tree/src/types/complex-types/model.ts
 */

import {
  isPlainObject,
  fail,
  addHiddenFinalProp,
  EMPTY_ARRAY,
  isPrimitive,
  defineProperty,
} from "./utils";
import {
  action,
  computed,
  makeObservable,
  observable,
  set
} from "mobx";
import { ObjectNode } from "./ObjectNode";

const defaultObjectOptions = {
  name: "AnonymousModel",
  properties: {},
  initializers: EMPTY_ARRAY
};

/**
 * Builder to define model types. Used in place of class inheritance.
 * @constructor
 * @param {object} opts - Defines configuration of the type
 * @param {string} variable - blah
 *
 */
export class ModelType {
  constructor(opts) {
    Object.assign(this, defaultObjectOptions, opts);
  }

  /**
   * Clones and Enhances the configuration of the ModelType instance
   */
  cloneAndEnhance(opts) {
    return new ModelType({
      name: opts.name || this.name,
      properties: Object.assign({}, this.properties, opts.properties),
      initializers: this.initializers.concat(opts.initializers || [])
    });
  }

  named(name) {
    return this.cloneAndEnhance({ name });
  }

  props(properties) {
    const propInitializer = (self) => {
      this.instantiateProps(self, properties);
      return self;
    };
    return this.cloneAndEnhance({
      initializers: [propInitializer],
      properties
    });
  }

  instantiateProps(self, props1) {
    let props = Object.assign({}, props1);

    let props2 = Object.keys(props).reduce((propsAcc, key) => {
      // Instantiate the defined class
      // TODO: Does this work with other mobx types??
      if (!isPrimitive(props[key])) propsAcc[key] = new props[key]();
      return propsAcc;
    }, props);
    Object.assign(self, props2);
    Object.keys(props).forEach((key) => {
      makeObservable(self, { [key]: observable });
    });
  }

  volatile(fn) {
    if (typeof fn !== "function") {
      throw fail(
        `You passed an ${typeof fn} to volatile state as an argument, when function is expected`
      );
    }
    const stateInitializer = (self) => {
      this.instantiateVolatileState(self, fn(self));
      return self;
    };
    return this.cloneAndEnhance({ initializers: [stateInitializer] });
  }

  instantiateVolatileState(self, state) {
    //
    if (!isPlainObject(state))
      throw fail(
        `volatile state initializer should return a plain object containing state`
      );
    set(self, state);
  }

  actions(fn) {
    const actionInitializer = (self) => {
      this.instantiateActions(self, fn(self));
      return self;
    };
    return this.cloneAndEnhance({ initializers: [actionInitializer] });
  }

  instantiateActions(self, actions) {
    //
    if (!isPlainObject(actions))
      throw fail(
        `actions initializer should return a plain object containing actions`
      );

    Object.keys(actions).forEach((name) => {
      let action2 = action(actions[name]);
      addHiddenFinalProp(self, name, action2);
    });
  }

  views(fn) {
    const viewInitializer = (self) => {
      this.instantiateViews(self, fn(self));
      return self;
    };
    return this.cloneAndEnhance({ initializers: [viewInitializer] });
  }

  instantiateViews(self, views) {
    if (!isPlainObject(views))
      throw fail(
        `Views initializer should return a plain object containing views`
      );
    Object.keys(views).forEach((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(views, key);
      if ("get" in descriptor) {
        defineProperty(self, key, descriptor);
        makeObservable(self, { [key]: computed });
      } else if (typeof descriptor.value === "function") {
        // this is a view function, merge as is!
        // See #646, allow models to be mocked
        addHiddenFinalProp(self, key, descriptor.value);
      } else {
        throw fail(
          `A view member should either be a function or getter based property`
        );
      }
    });
  }

  extend(fn) {
    const initializer = (self) => {
      const { actions, views, state, ...rest } = fn(self);
      for (let key in rest)
        throw fail(
          `The \`extend\` function should return an object with a subset of the fields 'actions', 'views' and 'state'. Found invalid key '${key}'`
        );
      if (state) this.instantiateVolatileState(self, state);
      if (views) this.instantiateViews(self, views);
      if (actions) this.instantiateActions(self, actions);
      return self;
    };
    return this.cloneAndEnhance({ initializers: [initializer] });
  }

  create(snapshot) {
    let instance = new ObjectNode(this, snapshot);
    return instance;
  }
}
