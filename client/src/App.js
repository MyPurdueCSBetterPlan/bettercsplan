import {Route, Routes} from "react-router-dom"
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Auth/Create";
import Signup from "./Pages/Auth/Signup";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Profile from "./Pages/Profile/Profile";
import About from "./Pages/About/About"
import "./App.css"


function App() {
    return (
        <div className="App">
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/signup"} element={<Signup/>}/>
                <Route path={"/create"} element={<Create/>}/>
                <Route path={"/profile"} element={<Profile/>}/>
                <Route path={"/about"} element={<About />} />
                <Route path={'*'} element={<NotFound/>}/>
            </Routes>
        </div>
    );
}

export default App