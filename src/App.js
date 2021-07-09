import './App.css';
import { useState, } from 'react';
import { observer } from "mobx-react"
import { RootStore } from './models/RootStore';

const addTenThousandFoos = (store) => {
	store.generateFoos(10000)
}

const App = () => {
  const [store] = useState(RootStore.create())
	window.store = store

  return (
    <div className="App">
      <header className="App-header">
				<p>
          { store.foos.size } Foos
        </p>
				<button onClick={() => addTenThousandFoos(store)}>Add 10000 Foos</button>
      </header>
    </div>
  );
}

export default observer(App);
