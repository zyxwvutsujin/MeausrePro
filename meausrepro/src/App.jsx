import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./page/Main.jsx";
import Login from "./page/Login.jsx";
import {UserProvder} from "./context/UserContext.jsx";
import SignUp from "./page/SignUp.jsx";

function App() {
    return (
        <UserProvder>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Login />} />
                    <Route path={'/SignUp'} element={<SignUp />} />
                    <Route path={'/MeausrePro'} element={<Main />} />
                </Routes>
            </BrowserRouter>
        </UserProvder>
    );
}

export default App
