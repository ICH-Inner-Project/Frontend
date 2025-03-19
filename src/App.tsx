import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "@pages/login/index";
import Home from "@pages/home/index";
import Footer from "@components/Footer/Footer";
import "./components/Footer/Footer.module.css";
function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LogIn />}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
