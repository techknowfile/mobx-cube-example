import { ModelBase } from "./ModelBase";
import { fail } from "./utils";
import camelcase from "camelcase";
import pluralize from "pluralize";

export const RootStoreBase = ModelBase.volatile((self) => ({})).actions(
  (self) => ({
    merge(data) {
      if (!data || typeof data !== "object") return data;
      if (Array.isArray(data)) return data.map((d) => this.merge(d));

      const { __typename, id } = data;

      //convert values deeply first to MobX objects as much as possible
      const snapshot = {};
      for (const key in data) {
        snapshot[key] = this.merge(data[key]);
      }

      if (__typename && this.isKnownType(__typename)) {
        // Known MobX model type, instantiate or recycle MobX model
        let typeDef = this.getTypeDef(__typename);

        // Check if instance already exists in root map
        let instance =
          id !== undefined && this[this.getCollectionName(__typename)].get(id);
        if (instance) {
          // update existing object
          Object.assign(instance, snapshot);
        } else {
          // create new object
          instance = typeDef.create(snapshot);
          // register in store
          this[this.getCollectionName(__typename)].set(id, instance);
          instance.__setStore(this);
        }
        return instance;
      } else {
        return snapshot;
      }
    }
  })
);

export function configureStoreMixin(
  knownTypes,
  rootTypes,
  namingConvention = null
) {
  const kt = new Map();
  const rt = new Set(rootTypes);
  return () => ({
    actions: {
      afterCreate() {
        knownTypes.forEach(([key, typeFn]) => {
          const type = typeFn();
          if (!type) throw fail(`The type provided for '${key}' is empty.`);
          kt.set(key, type);
        });
      }
    },
    views: {
      isKnownType(typename) {
        return kt.has(typename);
      },
      isRootType(typename) {
        return rt.has(typename);
      },
      getTypeDef(typename) {
        return kt.get(typename);
      },
      getCollectionName(typename) {
        if (namingConvention === "js") {
          // Pluralize only last word (pluralize may fail with words that are
          // not valid English words as is the case with LongCamelCaseTypeNames)
          const newName = camelcase(typename);
          const parts = newName.split(/(?=[A-Z])/);
          parts[parts.length - 1] = pluralize(parts[parts.length - 1]);
          return parts.join("")
        }
        return typename.toLowerCase() + "s";
      }
    }
  });
}
