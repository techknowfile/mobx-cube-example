export default class MobXObject{
  store;

  constructor(props) {
    for (const prop in props){
      this[prop]  = props[prop]
    }
  }
  __setStore(store){
    this.store = store
  }
  getStore(){
    return this.store
  }

  static getTypename(){
    throw "MobXObject must include getTypename()"
  }
}