import OpenAI from 'openai';
import dotenv from 'dotenv';
import actions from './actions.js';
import User from '../models/User.js';
dotenv.config();

const assistant = {
    id: process.env.OPENAI_ASSISTANT_ID,
    openai: new OpenAI({apiKey: process.env.OPENAI_API_KEY}),
    canal: process.env.AIBOT_CANAL, 
    change: function(newId) {
        this.id = newId;
    },
    retrieve : async function() {
        return await this.openai.beta.assistants.retrieve(this.id);
    },
    message: async function (user= new User, mns = '', timestamp = Date.now()) {
        const threadId = user.threadId;
        try{
            const dateString = new Date(timestamp * 1000).toISOString()
            await this.openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: `
                    Fecha del mensaje: ${dateString},
                    Mensaje: ${mns}
                `
            });
            const run = await this.openai.beta.threads.runs.createAndPoll(threadId, {assistant_id: this.id})
            if (run.status === 'requires_action') {
                return await actions.setActions(
                    user, 
                    run.required_action.submit_tool_outputs.tool_calls
                );
            }
            while (run.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const updatedRun = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
                console.log("Run status:", updatedRun.status);
                if (run.status === 'failed') {
                    console.error("Run failed:", updatedRun);
                    return `Error: Run failed with details: ${updatedRun.failures.map(f => f.message).join(", ")}`;
                }
            }

            const messages = await this.openai.beta.threads.messages.list(threadId, {limit:1});
            return messages.data[0].content[0].text.value;
        
        } catch (error) {
            if(error.type == `invalid_request_error`){
                await this.thread.delete(user.threadId);
                await user.deleteThreadId();
                const threadId = await this.thread.create();
                await user.createThreadId(threadId);
                return await this.message(user, mns, timestamp);
            }else{
                console.error("Error sending message:", error);
            }
        }
    },

    thread : {   
        create: async (userName) => {
            const newThread = await assistant.openai.beta.threads.create();
            const run = await assistant.openai.beta.threads.runs.create(
                newThread,
                { 
                    assistant_id: assistant.id,
                    instructions: `El chat del quien envia el mensaje es de ${userName}` 
                }
              );
            return newThread.id;
        },
        delete: async (threadId) => {
            try {
                await assistant.openai.beta.threads.del(threadId);
            }catch (error) {
                console.error("Error deleting thread:", error);
            }
            return 
        }
    }

}

assistant.thread.create = assistant.thread.create.bind(assistant);

export default assistant;