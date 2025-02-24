import Action from '../models/Action.js';
const actions = {
    async setActions(actionsAPI) {    
        /*[{
            id: 'call_wHIrhMySuX0wQFgpLujmvjuU',
            type: 'function',
            function: {
                name: 'create_appointment',
                arguments: '{"date":"07/12/21","hour":"12:00"}'
            }
        }]*/
       for(const actionAPI of actionsAPI){
            console.log('Action API:', actionsAPI);
            const action = new Action(actionAPI);
            if (action.name === 'create_appointment') {
                const { date, hour } = JSON.parse(action.data);
                const dateTimeString = `${date} ${hour}`;
                const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000);
                const respond = await action.createAppointment(userId, timestamp);
                console.log(`Creating appointment for ${date} at ${hour} => ${timestamp}`);
                return respond
            }
        }
    }
}

export default actions;