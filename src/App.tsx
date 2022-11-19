import "./App.css";
import { Home } from './Screens/Home';

function App({ store, persistor }: any) {
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
