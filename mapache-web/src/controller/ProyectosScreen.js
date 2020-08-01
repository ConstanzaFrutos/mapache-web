import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ListadoProyectos from "../component/ModuloProyectos/Proyectos/ListadoProyectos";

class ProyectosScreen extends Component {

    render() {
        return (
            <div>
                <ListadoProyectos/>
            </div>
        );
    }

}

export default withRouter(ProyectosScreen);
