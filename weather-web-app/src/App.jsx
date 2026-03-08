import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<div />} />
      </Routes>
    </BrowserRouter>
    // </Provider>
  );
};

export default App;
