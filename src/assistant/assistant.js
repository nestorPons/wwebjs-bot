import OpenAI from 'openai';
import dotenv from 'dotenv';
import actions from './actions.js';
import User from '../models/User.js';
dotenv.config();

const assistant = {
    id: process.env.OPENAI_ASSISTANT_ID,
    openai: new OpenAI({apiKey: process.env.OPENAI_API_KEY}),
    retrieve : async function() {
        return await this.openai.beta.assistants.retrieve(this.id);
    },
    message: async function (user = User, mns = '', timestamp = Date.now()) {
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
                return await actions.setActions(user.id, run.required_action.submit_tool_outputs.tool_calls);
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
            console.error("Error sending message:", error);
            await this.thread.delete(user);
            await this.thread.create(user);
            this.message(user, mns, timestamp);
        }
    },
    thread : {   
        create: async function(user = User) {
            const newThread = await this.openai.beta.threads.create();
            await user.createThreadId(newThread);
            return newThread
        },
        delete: async function(threadId, user = User) {
            await this.openai.beta.threads.del(threadId);
            await user.deleteThreadId();
            return 
        }
    }

}

assistant.thread.create = assistant.thread.create.bind(assistant);

export default assistant;