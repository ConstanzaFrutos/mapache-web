import React, {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class NavBarProyecto extends Component {
    render() {
        return(
            <Navbar>
                <Nav className="mr-auto">
                    <Link to={"/proyectos"} className="nav-link">Listado de Proyectos</Link>
                    <Link to={"/proyectos/edit/:id"} className="nav-link">Proyecto</Link>
                </Nav>
            </Navbar>
        );
    }
}