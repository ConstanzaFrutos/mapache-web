import React, { Component } from 'react';
import "../assets/css/Home.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export class Home extends Component {

    render() {
        return (
            <div className={"homeDiv"}>
                <Card className={"psa-card"}>
                    <CardContent className={"content"}>
                        <Typography className={"title"} color="textSecondary" gutterBottom variant={"h4"}>
                            Sistema Integral de Gestión <br/>
                        </Typography>
                        <Typography className={"description"} variant="body1" component="p">
                            <br/><br/>
                            Este es un sistema para gestionar proyectos, productos y sus versiones.
                            Facilitando la creación y seguimiento de las tareas y tickets que los componen.
                            <br/><br/>
                            A su vez permite realizarYo  un seguimiento de los empleados de la empresa,
                            las tareas que desempeñan y las horas que invierten en cada tarea.
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }

}