import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { routers } from "./routes/routes";
import QueryContext from "./context/QueryContext";
import MeshContext from "./context/MeshContext";
import Header from "./components/Header/Header";

function App() {
  return (
    <QueryContext>
      <MeshContext>
        <BrowserRouter>
          <Header />
          <ToastContainer pauseOnHover={false} />
          <Routes>
            <Route>
              {routers.map((route) => (
                <Route
                  key={route.id}
                  path={route.href}
                  element={route.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MeshContext>
    </QueryContext>
  );
}

export default App;
