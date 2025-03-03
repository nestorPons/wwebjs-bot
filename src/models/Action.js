class Action {
    constructor(userId, actionAPI) {
        this.id = actionAPI.id;
        this.type = actionAPI.type;
        this.userId = userId;
        this.name = null;
        this.data = null;
        this.date = null;
        this.hour = null;
        this.args = null;
        if(actionAPI.function){
            this.name = actionAPI.function.name;
            const args = JSON.parse(actionAPI.function.arguments);
            this.args = args;
            this.date = args.date;
            this.hour = args.hour;
        }
    }
}

export default Action;