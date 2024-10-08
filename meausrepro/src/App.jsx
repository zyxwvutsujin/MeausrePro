import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./page/Main.jsx";
import Login from "./page/Login.jsx";
import {UserProvder} from "./context/UserContext.jsx";;
import UserManagement from "./page/UserManagement.jsx";

function App() {
    return (
        <UserProvder>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Login />} />
                    <Route path={'/MeausrePro'} element={<Main />} />
                    <Route path={'/UserManagement'} element={<UserManagement />} />
                </Routes>
            </BrowserRouter>
        </UserProvder>
    );
}

export default App
