import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "../component/NavBar";
import { Home } from "../controller/Home";
import EmpleadosScreen from "../controller/EmpleadosScreen";
import SoporteScreen from "../controller/SoporteScreen";
import ProyectosScreen from "../controller/ProyectosScreen";
import EditorProyectosScreen from "../component/ModuloProyectos/EditorProyectosScreen";

class Routes extends Component {
    render() {
        return (
            <Router key="router">
                <NavBar />
                <Route exact path={"/"} component={Home} />
                <Route exact path={"/empleados"} component={ EmpleadosScreen }/>
                <Route exact path={"/proyectos"} component={ ProyectosScreen }/>
                <Route exact path={"/soporte"} component={ SoporteScreen }/>
                <Route exact path={"/proyectos/edit/:id"} component={ EditorProyectosScreen }/>
            </Router>
        )
    }
}

export default Routes;