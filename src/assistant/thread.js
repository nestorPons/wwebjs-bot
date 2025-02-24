import assistant from "./assistant.js";

const thread = {   
    openai : assistant.openai, 
    create: async function() {
        return await this.openai.beta.threads.create();
    },
    delete: async function(threadId) {
        const response = await this.openai.beta.threads.del(threadId);
    }
}

export default thread;