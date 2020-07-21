import React, {Component} from "react";
import NavBarProyecto from "../NavBarProyecto";
import Fases from "./Fases";

export default class EditorFasesScreen extends Component {
    render() {
        return(
            <div>
                <NavBarProyecto/>
                <Fases/>
            </div>
        )
    }
}