import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./page/Main.jsx";
import Login from "./page/Login.jsx";
import {UserProvder} from "./context/UserContext.jsx";

function App() {
    return (
        <UserProvder>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Login />} />
                    <Route path={'/MeausrePro'} element={<Main />} />
                </Routes>
            </BrowserRouter>
        </UserProvder>
    );
}

export default App
