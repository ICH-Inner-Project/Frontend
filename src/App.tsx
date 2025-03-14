import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "@pages/Login/Login";
import Home from "@pages/Home/Home";
import ContactUs from "@pages/ContactUs/ContactUs";
import AdminPanel from "@pages/AdminPanel/AdminPanel";
import Post from "@pages/Post/Post";

function App() {
  return (
    <div className="App">
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LogIn />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/contact" element={<ContactUs />}></Route>
            <Route path="/admin" element={<AdminPanel />}></Route>
            <Route path="/post/:postId" element={<Post />}></Route>
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
