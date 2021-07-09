import { RootStoreBase, configureStoreMixin } from "../mobx-cube/RootStoreBase"
import { v4 as uuid4 } from "uuid"
import {FooModel} from "./Foo"

export const RootStore = RootStoreBase.named("RootStore")
	.extend(configureStoreMixin([["Foo", () => FooModel]], ["Foo"], "js"))
	.props({
		foos: Map
	})
	.actions(self => ({
		generateFoos(count){
			let newFoos = []
			for (let i = 0; i < count; i++){
				newFoos.push({
					__typename: "Foo",
					id: uuid4(),
					value: Math.random()*100
				})	
			}
			self.merge(newFoos)
		}
	}))
