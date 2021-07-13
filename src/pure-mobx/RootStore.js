import {RootStoreBase} from "./RootStore.base";
import { Foo } from "./Foo";
import {v4 as uuid4} from "uuid";
import {action, makeObservable} from "mobx";

export class RootStore extends RootStoreBase {

  constructor() {
    super({
        'foos': Foo,
      });
    makeObservable(this, {generateNodes: action})
  }

  generateNodes(type, count){
    if (!(this.typenameToModelMap.has(type)))
      throw new Error("Unknown type:", type)
    let newNodes = []
    for (let i = 0; i < count; i++){
      newNodes.push({
        __typename: type,
        id: uuid4(),
        value: Math.random()*100
      })
    }
    this.merge(newNodes)
  }
}