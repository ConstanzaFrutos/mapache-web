import Requester from "./Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";

class RequesterHoras {
    constructor(){
        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.obtenerHorasCargadas = this.obtenerHorasCargadas.bind(this);
        this.obtenerHorasCargadasSemana = this.obtenerHorasCargadasSemana.bind(this);
    }

    async obtenerHorasCargadas(legajo, mostrarAlerta){
        let horasCargadas = await this.requester.get(`/empleados/${legajo}/horas`)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                mostrarAlerta(
                    `Error al consultar horas del empleado ${legajo}`,
                    "error"
                )
            }
        }).then(response => {
            console.log("response ",response);
            if (response) {
                return response;
            }
        });
        return horasCargadas;
    }

    procesarFecha(fecha) {
        let mes = fecha.getMonth() + 1;
        if (mes <= 9) {
            mes = `0${mes}`;
        }
        let dia = fecha.getDate();
        if (dia <= 9) {
            dia = `0${dia}`;
        }
        return `${fecha.getFullYear()}-${mes}-${dia}`;
    }

    async obtenerHorasCargadasSemana(legajo, fechaFin, mostrarAlerta){
        let fechaInicio = new Date();
        const nuevoDia = fechaFin.getDate() - 7;
        fechaInicio.setDate(nuevoDia);

        const fechaIniFormateada = this.procesarFecha(fechaInicio);
        const fechaFinFormateada = this.procesarFecha(fechaFin);
        
        let horasCargadas = await this.requester.get(`/empleados/${legajo}/horas?fechaFin=${fechaFinFormateada}&fechaInicio=${fechaIniFormateada}`)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {                
                mostrarAlerta(
                    `Error al consultar horas del empleado ${legajo}`,
                    "error"
                )
            }
        }).then(response => {
            console.log("response ",response);
            if (response) {
                return response;
            }
        });
        return horasCargadas;
    }

}

export default RequesterHoras;