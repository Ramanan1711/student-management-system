import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { DataProvider } from "./store/DataStore";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
