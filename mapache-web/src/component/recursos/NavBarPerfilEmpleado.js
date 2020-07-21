import React, {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class NavBarProyecto extends Component {
    render() {
        return(
            <Navbar className="navbar navbar-expand-lg navbar-dark">
                <Nav className="mr-auto">
                    <Link to={"/empleados/:legajo/proyectos"} className="nav-link">Proyectos</Link>
                    <Link to={"/empleados/:legajo/tareas"} className="nav-link">Tareas</Link>
                    <Link to={"/empleados/:legajo/cargar-horas"} className="nav-link">Cargar Horas</Link>
                    <Link to={"/empleados/:legajo/horas-cargadas"} className="nav-link">Horas cargadas</Link>
                </Nav>
            </Navbar>
        );
    }
}