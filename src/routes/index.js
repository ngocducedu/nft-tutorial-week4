import React from "react";
import {
    Routes,
    Route,
    withRouter
} from "react-router-dom";

import Profile from "../pages/Profile";
import Mint from "../pages/Mint";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Mint />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/mint" element={<Mint />} />
        </Routes>
    )
}

export default Router