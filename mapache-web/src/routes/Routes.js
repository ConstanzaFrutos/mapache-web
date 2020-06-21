import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "../controllers/Home";

class Routes extends Component {
    render() {
        return (
            <Router key="router">
                <Route exact path={"/"} component={Home} />
            </Router>
        )
    }
}

export default Routes;