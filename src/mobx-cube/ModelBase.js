import { ModelType } from "../mobx-cube/ModelType";

export const ModelBase = new ModelType({}).extend((self) => {
  let store;

  function getStore() {
    return store;
  }

  return {
    actions: {
      __setStore(s) {
        store = s;
      }
    },
    views: {
      __getStore() {
        return getStore();
      },
      hasLoaded(key) {
        return typeof self[key] !== "undefined";
      },
      get store() {
        return self.__getStore()
      }
    }
  };
});
