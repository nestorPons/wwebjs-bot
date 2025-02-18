class User{
    constructor(id, name, threadId = "", use = true)
    {
        this.id = id
        this.name = name
        this.thread = threadId
        this.useIA = use
    }
}