class Action {
    constructor(actionAPI) {
        console.log(actionAPI)
        this.id = actionAPI.id;
        this.type = actionAPI.type;
        if(actionAPI.function){
            this.name = actionAPI.function.name;
            this.data = actionAPI.function.arguments;
        }
    }
    async createAppointment() {
        const { date, hour } = JSON.parse(this.data);
        console.log(`Creating appointment for ${date} at ${hour}`);

    }
}

export default Action;