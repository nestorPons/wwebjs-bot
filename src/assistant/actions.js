const actions = {
    id : null,
    data : null,
    action : null,
    setAction: function(action) {
        console.log('ACTION :' . action)
        //this.id = action.id;
        //this.action = action.function.name;
        //this.data = action.function.arguments;

    },
    getAction: function() {
        return this.action;
    }
}