import { AuthProvider } from "./AuthProvider";
import { AppRouter } from "./routers/AppRouter";

function App() {
  return (
    <div style={{ height: '100%' }}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
