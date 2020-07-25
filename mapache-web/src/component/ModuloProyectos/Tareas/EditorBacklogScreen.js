import React, {Component} from "react";
import NavBarProyecto from "../NavBarProyecto";
import Backlog from "./Backlog";

export default class EditorBacklogScreen extends Component {
    render() {
        return(
            <div>
                <NavBarProyecto/>
                <Backlog/>
            </div>
        )
    }
}