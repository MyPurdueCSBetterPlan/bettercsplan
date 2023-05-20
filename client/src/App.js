import {Route, Routes} from "react-router-dom"
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Auth/Create";
import Signup from "./Pages/Auth/Signup";
import Home from "./Pages/Home/Home";


function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/create" element={<Create/>}/>
            </Routes>
        </div>
    );
}

export default App