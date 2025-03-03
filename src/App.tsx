import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "@pages/login/index";
import Home from "@pages/home/index";

function App() {
  return (
    <>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LogIn />}></Route>
            <Route path="/home" element={<Home></Home>}></Route>
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
