import OpenAI from 'openai';
import dotenv from 'dotenv';
import database from './database.js';
dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function getAssistant(userName, userId) {
    let assistant = null;
    assistant = await database.getAssistantAndThreadId(userId);

    if (assistant && assistant.id) {
        try {
            await openai.beta.assistants.retrieve(assistant.id);
            return assistant;
        } catch (error) {
            return await createNewAssistant(userName, userId);
        }
    }

    if (!assistant) {
        console.log("No assistant linked, creating new one.");
        return await createNewAssistant(userName, userId);
    }

}

async function createNewAssistant(userName, userId) { // Crear un nuevo asistente y un nuevo hilo
    const assistant = await openai.beta.assistants.create({
        name: userName,
        description: ``,
        instructions: `Eres un asistente de Néstor Pons. Responde las preguntas de forma clara y concisa.`,
        model: "gpt-3.5-turbo",
    });
    const thread = await openai.beta.threads.create();
    console.log("New assistant created with ID:", assistant.id);
    database.saveAssistantAndThreadId(userId, assistant.id, thread.id);
    return {id: assistant.id, threadId: thread.id};
}

async function sendMessage(assistant, mns) {
    const threadId = assistant.threadId;
    if (!assistant || !assistant.threadId) {
        console.error("Invalid assistant or threadId:", assistant);
        return "Error: Invalid assistant data";
    }

    try {
        const message = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: mns
        });

        const run = await openai.beta.threads.runs.createAndPoll(threadId, {assistant_id: assistant.id});

        while (run.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de revisar nuevamente
            const updatedRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
            if (run.status === 'failed') {
                console.error("Run failed:", updatedRun);
                return `Error: Run failed with details: ${updatedRun.failures.map(f => f.message).join(", ")}`;
            }
        }

        const messages = await openai.beta.threads.messages.list(threadId, {limit:1});
        return messages.data[0].content[0].text.value;
        
    } catch (error) {
        console.error("Error sending message:", error);
        return "Error: Failed to send message";
    }
}

export default {getAssistant, sendMessage};
