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
        if (action.name === 'create_appointment') {
            const { date, hour } = JSON.parse(action.data);
            const dateTimeString = `${date} ${hour}`;
            const timestamp = Math.floor(new Date(dateTimeString).getTime());
            const appointment = await Appointment.create(userId, timestamp)
            if(!appointment) {
                return 'Error al crear la cita';
            }
            
            return `Se ha creado la cita el ${date} a las ${hour}` 
        }
        return 'No he podido procesar tu solicitud';
    }
}

export default actions;