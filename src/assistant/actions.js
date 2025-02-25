import Action from '../models/Action.js';
import Appointment from '../models/Appointment.js';

const actions = {
    async setActions(userId, actionsAPI) {    
        const actionAPI  = actionsAPI[0];
        /*[{
            id: 'call_wHIrhMySuX0wQFgpLujmvjuU',
            type: 'function',
            function: {
                name: 'create_appointment',
                arguments: '{"date":"07/12/21","hour":"12:00"}'
            }
        }]*/
        console.log('Action API:', actionsAPI);
        const action = new Action(userId, actionAPI);
        
        switch (action.name) {
            case 'get_appointments':
                const getResponds = this.appointment.get(userId);
                if(getResponds){
                    return `Tienes las siguientes citas: ${getResponds}`;
                }
            case 'create_appointment':

                const respond = this.appointment.create(userId, action.date, action.hour);
                if(respond){
                    return `Cita creada correctamente para el ${action.date} a las ${action.hour}` ;
                }
            default:
                return 'No he podido procesar tu solicitud';
        }
    },
    appointment: {
        parse: function (date, hour) {
            const [day, month, year] = date.split('/');
            const [hours, minutes] = hour.split(':');
            const fullYear = `20${year}`;        
            const formattedDate = `${fullYear}-${month}-${day}T${hours}:${minutes}:00Z`;
            const timestamp = new Date(formattedDate).getTime();
                
            return timestamp;
        },
        create: async function (userId, date, hour) {
            const timestamp = actions.appointment.parse(date, hour);
            const appointment = await Appointment.create(userId, timestamp)
            if(!appointment) return false;
            return true;
        },
        get: async function (userId) {
            const appointment = await Appointment.init(userId);
            const appointments = await appointment.getAll();
            if(!appointments) return false;
            const appointmentsStructured = appointments.map(appointment => {
                const date = new Date(appointment.timestamp);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hour = date.getHours();
                const minutes = date.getMinutes();
                return `${day}/${month}/${year} a las ${hour}:${minutes}`;
            });
            
            return appointmentsStructured;
        }
    }
}

export default actions;