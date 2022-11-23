import "./App.css";
import AppRouter from "./routers/AppRouter";

function App({ store, persistor }: any) {
  return (
    <div className="App">
      <AppRouter/>
    </div>
  );
}

export default App;
