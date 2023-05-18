import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login";
import Home from "./pages/Home"
import Signup from "./pages/Signup";
import Create from "./pages/Create"


function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/create" element={<Create/>} />
            </Routes>
        </div>
    );
}

export default App