import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "../component/NavBar";
import { Home } from "../controller/Home";

class Routes extends Component {
    render() {
        return (
            <Router key="router">
                <NavBar />
                <Route exact path={"/"} component={Home} />
            </Router>
        )
    }
}

export default Routes;