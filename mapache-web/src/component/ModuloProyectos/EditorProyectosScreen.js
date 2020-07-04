import React, {Component} from "react";
import NavBarProyecto from "./NavBarProyecto";
import Proyecto from "./Proyecto";

export default class EditorProyectosScreen extends Component {
    render() {
        return(
            <div className="editorproyectos-screen-div">
                <NavBarProyecto/>
                <Proyecto/>
            </div>
        )
    }
}