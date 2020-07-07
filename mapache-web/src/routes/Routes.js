import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "../component/general/NavBar";
import { Home } from "../controller/Home";
import EmpleadosScreen from "../controller/EmpleadosScreen";
import SoporteScreen from "../controller/SoporteScreen";
import ProyectosScreen from "../controller/ProyectosScreen";
import EditorProyectosScreen from "../component/ModuloProyectos/EditorProyectosScreen";

import PerfilEmpleado from "../component/recursos/PerfilEmpleado";

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
                <Route exact path={`/empleados/:legajo`} component={ PerfilEmpleado }/>
            </Router>
        )
    }
}

export default Routes;