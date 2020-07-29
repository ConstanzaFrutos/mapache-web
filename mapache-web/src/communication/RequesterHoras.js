import Requester from "./Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";

class RequesterHoras {
    constructor(){
        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.obtenerHorasCargadas = this.obtenerHorasCargadas.bind(this);
        this.obtenerHorasCargadasSemana = this.obtenerHorasCargadasSemana.bind(this);
    }

    async obtenerHorasCargadas(legajo){
        let horasCargadas = await this.requester.get(`/empleados/${legajo}/horas`)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                alert.log(`Error al consultar horas del empleado ${legajo}`);
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
        return `${fecha.getFullYear()}-0${fecha.getMonth() + 1}-${fecha.getDate()}`;
    }

    async obtenerHorasCargadasSemana(legajo, fechaFin){
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
                alert(`Error al consultar horas del empleado ${legajo}`);
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