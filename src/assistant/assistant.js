import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const assistant = {
    id: process.env.OPENAI_ASSISTANT_ID,
    openai: new OpenAI({apiKey: process.env.OPENAI_API_KEY}),
    retrieve : async function() {
        return await this.openai.beta.assistants.retrieve(this.id);
    },
    message: async function (user, mns){
        const threadId = user.threadId;
        try{
            await this.openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: mns,
                metadata: {
                    user_id: user.id,
                    user_name: user.name,
                }
            });
            const run = await this.openai.beta.threads.runs.createAndPoll(threadId, {assistant_id: this.id})
            console.log("Run status:", run.status);
            if (run.status === 'requires_action') {ç
                //TODO: Implementar la lógica para manejar la acción requerida
                actions.setAction(run.required_action.submit_tool_outputs.tool_calls);
                console.log(run.required_action.submit_tool_outputs.tool_calls);
                return
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
            return "Error: Failed to send message";
        }
    },
    thread : {   
        create: async function() {
            return await this.openai.beta.threads.create();
        }
    }

}

assistant.thread.create = assistant.thread.create.bind(assistant);

export default assistant;