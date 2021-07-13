import {
  action,
  makeAutoObservable,
  makeObservable,
  observable,
  computed,
  autorun
} from "mobx";
import MobXObject from "./MobXObject";


export class Foo extends MobXObject {

  constructor(props) {
    const defaults = {
      id: null,
      value: null,
      entries: null,
      metric: null,
      localValue: null
    }
    super(Object.assign({}, defaults, props))

    makeObservable(this, {
      setValue: action,
      value: observable,
    });
  }

  setValue(value){
    this.value = value
  }

  static getTypename(){
    return "Foo"
  }
}