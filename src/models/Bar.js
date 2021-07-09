import { ModelBase } from "../mobx-cube/ModelBase.js"

export const BarModel = ModelBase.named("Bar")
	.props({
		__typename: null,
		id: null,
		value: null
	})
