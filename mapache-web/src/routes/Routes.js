import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "../component/general/NavBar";
import { Home } from "../controller/Home";
import SoporteScreen from "../controller/SoporteScreen";
import ProyectosScreen from "../controller/ProyectosScreen";
import ClientesScreen from "../controller/ClientesScreen";
import EditorProyectosScreen from "../component/ModuloProyectos/EditorProyectosScreen";

import CrearTicket from '../component/soporte/CrearTicket';
import EditarTicket from '../component/soporte/EditarTicket';
import InfoCliente from '../component/soporte/InfoCliente';

//Recursos
import EmpleadosScreen from "../controller/EmpleadosScreen";
import PerfilEmpleado from "../component/recursos/PerfilEmpleado";

class Routes extends Component {
    render() {
        return (
            <Router key="router">
                <NavBar />
                <Route exact path={"/"} component={Home} />
                <Route exact path={"/proyectos"} component={ ProyectosScreen }/>
                <Route exact path={"/soporte"} component={ SoporteScreen }/>
                <Route exact path={"/clientes"} component={ ClientesScreen }/>
                <Route exact path={"/proyectos/edit/:id"} component={ EditorProyectosScreen }/>
                <Route exact path={`/soporte/tickets/nuevo`} component={ CrearTicket }/>
                <Route exact path={[`/clientes/nuevo`,`/clientes/:id_cliente`]} component={ InfoCliente }/>
                <Route exact path={`/tickets/:id_ticket`} component={ EditarTicket }/>

                <Route exact path={"/empleados"} component={ EmpleadosScreen }/>
                <Route exact path={`/empleados/:legajo`} component={ PerfilEmpleado }/>
            </Router>
        )
    }
}

export default Routes;