import './App.css';
import { useState, } from 'react';
import { observer } from "mobx-react"
import { RootStore } from './models/RootStore';


const App = () => {
  const [store] = useState(RootStore.create())
	window.store = store

  return (
    <div className="App">
			<header className="App-header">
				<div>
					<p>
						{ store.foos.size } Foos
						<br />
						Actions: 1, Views: 1
					</p>
					<button onClick={() => store.generateNodes("Foo", 10000)}>Add 10000 Foos</button>
			</div><div>
					<p>
						{ store.bars.size } Bars
						<br />
						Actions: 0, Views: 0
					</p>
					<button onClick={() => store.generateNodes("Bar", 10000)}>Add 10000 Bars</button>
			</div>
			</header>
    </div>
  );
}

export default observer(App);
