import './App.css';
import { useState, } from 'react';
import { observer } from "mobx-react"
import { RootStore } from './models/RootStore';
import { RootStore as MobXStore } from './pure-mobx/RootStore'


const App = () => {
  const [store] = useState(RootStore.create())
	const [mobxStore] = useState(new MobXStore())
	window.store = store
	window.mobxStore = mobxStore

  return (
    <div className="App">
			<header className="App-header">
				<div>
					<p>
						{ store.foos.size } MST-Like Foos
						<br />
					</p>
					<button onClick={() => store.generateNodes("Foo", 10000)}>Add 10000 Foos</button>
			</div>
				<div>
					<p>
						{ mobxStore.foos.size } MobX Class-based Foos
						<br />
					</p>
					<button onClick={() => mobxStore.generateNodes("Foo", 10000)}>Add 10000 Foos</button>
				</div>
			</header>
    </div>
  );
}

export default observer(App);
