import assistant from "./assistant.js";

const thread = {   
    assitant : assistant.openai, 
    create: async () => {
        const newThread = await this.assistant.openai.beta.threads.create();
        return newThread.id;
    },
    delete: async (threadId) => {
        try {
            await this.assistant.openai.beta.threads.del(threadId);
        }catch (error) {
            console.error("Error deleting thread:", error);
        }
        return 
    }
    
}

export default thread;