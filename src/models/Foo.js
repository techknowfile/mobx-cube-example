import { ModelBase } from "../mobx-cube/ModelBase.js"

export const FooModel = ModelBase.named("Foo")
	.props({
		__typename: null,
		id: null,
		value: null
	})
	.actions(self => ({
		setValue(value){
			self.value = value
		}
	}))
	.views(self => ({
		get squared(){
			return self.value**2
		}
	}))
