import { useState } from 'preact/hooks';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
// import preactLogo from './assets/preact.svg';
// import viteLogo from '/vite.svg';
import './app.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

export function App () {

    return (
        <div className='App'>
            <Routes>
                <Route
                    path="/"
                    element={ <HomePage /> } exact />

                <Route
                    path="chat"
                    element={ <ChatPage /> } exact />
            </Routes>
        </div>
    );
}
