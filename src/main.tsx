import { Provider } from "react-redux";
import App from "./App";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./state/store";

const container = document.getElementById("root");
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
} else {
  console.error("Failed to find the root element");
}
