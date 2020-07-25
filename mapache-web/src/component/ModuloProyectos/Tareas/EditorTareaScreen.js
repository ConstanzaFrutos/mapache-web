import React, {Component} from "react";
import NavBarProyecto from "../NavBarProyecto";
import Tarea from "./Tarea";


export default class EditorTareaScreen extends Component {
    render() {
        return(
            <div>
                <NavBarProyecto/>
                <Tarea/>
            </div>
        )
    }
}