import AppRoutes from "./routes/AppRoutes";
import { DataProvider } from "./store/DataStore";
import { ToastProvider } from "./components/ui/Toast";
import AppErrorBoundary from "./components/ui/AppErrorBoundary";

function App() {
  return (
    <AppErrorBoundary>
      <DataProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </DataProvider>
    </AppErrorBoundary>
  );
}

export default App;
