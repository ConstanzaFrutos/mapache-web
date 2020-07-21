import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ListadoProyectos from "../component/ModuloProyectos/Proyectos/ListadoProyectos";
import NavBarProyecto from "../component/ModuloProyectos/NavBarProyecto";

class ProyectosScreen extends Component {

    render() {
        return (
            <div>
                <NavBarProyecto/>
                <ListadoProyectos/>
            </div>
        )
    }

}

export default withRouter(ProyectosScreen);
