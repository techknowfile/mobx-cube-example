import { makeObservable, observable, action } from "mobx";

export class RootStoreBase {
  keyToModelMap;
  modelToKeyMap = new Map();
  typenameToModelMap = new Map();

  constructor(keyToModelMap) {
    this.keyToModelMap = keyToModelMap;

    /**********************
    Bind Methods
    */
    this.merge = this.merge.bind(this);

    /**********************
     * Set MobX Annotations (observable, computed, action, etc)
     */
    let annotations = {};
    for (const key in keyToModelMap) {
      this.modelToKeyMap.set(keyToModelMap[key], key);
      this.typenameToModelMap.set(keyToModelMap[key].getTypename(), keyToModelMap[key]);
      this[key] = new Map();

      // Add key map to annotations
      annotations[key] = observable;
    }
    Object.assign(annotations, {
      merge: action,
      keyToModelMap: false,
      modelToKeyMap: false,
      typenameToModelMap: false,
    });
    makeObservable(this, annotations);
  }


  merge(data) {
    if (!data || typeof data !== "object") return data;
    if (Array.isArray(data)) return data.map((d) => this.merge(d));

    const { __typename, id } = data;

    //convert values deeply first to MobX objects as much as possible
    const snapshot = {};
    for (const key in data) {
      snapshot[key] = this.merge(data[key]);
    }

    if (__typename && this.typenameToModelMap.get(__typename)) {
      // Known MobX model type, instantiate or recycle MobX model
      let Model = this.typenameToModelMap.get(__typename);

      // Check if instance already exists in root map
      let instance =
        id !== undefined && this[this.modelToKeyMap.get(Model)].get(id);
      if (instance) {
        // update existing object
        Object.assign(instance, snapshot);
      } else {
        // create new object
        instance = new Model(snapshot);
        // register in store
        this[this.modelToKeyMap.get(Model)].set(id, instance);
        instance.__setStore(this);
      }
      return instance;
    } else if (
      this.mstStore &&
      __typename &&
      this.mstStore.isKnownType(__typename)
    ) {
      return this.mstStore.merge(data);
    } else {
      return snapshot;
    }
  }
}
