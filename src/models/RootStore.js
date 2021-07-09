import { RootStoreBase, configureStoreMixin } from "../mobx-cube/RootStoreBase"
import { v4 as uuid4 } from "uuid"
import {FooModel} from "./Foo"
import {BarModel} from "./Bar"

export const RootStore = RootStoreBase.named("RootStore")
	.extend(configureStoreMixin([["Foo", () => FooModel], ["Bar", () => BarModel]], ["Foo", "Bar"], "js"))
	.props({
		foos: Map,
		bars: Map
	})
	.actions(self => ({
		generateNodes(type, count){
			if (!this.isKnownType(type))
				throw new Error("Unknown type:", type)
			let newNodes = []
			for (let i = 0; i < count; i++){
				newNodes.push({
					__typename: type,
					id: uuid4(),
					value: Math.random()*100
				})	
			}
			self.merge(newNodes)
		}
	}))

