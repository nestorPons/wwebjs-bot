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
}

export default Action;