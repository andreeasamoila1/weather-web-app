import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./components/Home";
import Settings from "./components/Settings";

/**
 * App component – radice dell'applicazione.
 *
 * Wrappa tutto con Provider per rendere lo store Redux
 * disponibile a qualsiasi componente nell'albero,
 * e con BrowserRouter per gestire la navigazione client-side.
 *
 * Rotte disponibili:
 * - "/"          → pagina principale con i dati meteo (Home)
 * - "/settings"  → pagina impostazioni e info sul progetto (Settings)
 */
const App = () => {
  return (
    // Provider rende lo store accessibile tramite useSelector/useDispatch
    // in tutti i componenti figli senza dover passare props manualmente
    <Provider store={store}>
      {/* I flag future abilitano i comportamenti di React Router v7
          per evitare deprecation warning durante la migrazione */}
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
