class User{
    constructor(id, name, threadId = "", use = true)
    {
        this.id = id
        this.name = name
        this.threadId = threadId
        this.useIA = use
    }
}

export default User;