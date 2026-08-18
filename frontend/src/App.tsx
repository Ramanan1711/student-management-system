import AppRoutes from "./routes/AppRoutes";
import { DataProvider } from "./store/DataStore";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </DataProvider>
  );
}

export default App;
