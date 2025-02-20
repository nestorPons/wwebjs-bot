import setUseAI from '../database/setUseIA.js'

class User{
    constructor(id, name, threadId = "", use = true)
    {
        this.id = id
        this.name = name
        this.threadId = threadId
        this.useIA = use
    }
    setUseAI(state = fasle)
    {
        setUseAI(state);
    }
}

export default User;