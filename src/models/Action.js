import appointment from '../database/appointments.js'

class Action {
    constructor(userId, actionAPI) {
        this.id = actionAPI.id;
        this.type = actionAPI.type;
        this.userId = userId;
        if(actionAPI.function){
            this.name = actionAPI.function.name;
            this.data = actionAPI.function.arguments;
        }
    }
    async createAppointment(timestamp) {
        appointment.create(this.userId, timestamp)
        console.log(`Creating appointment for ${date} at ${hour}`);
    }
}

export default Action;