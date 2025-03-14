import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import actions from '#assistant/actions.mjs';

dotenv.config();

const assistant = {
    id: process.env.OPENAI_ASSISTANT_ID,
    openai: new OpenAI({apiKey: process.env.OPENAI_API_KEY}),
    canal: process.env.AIBOT_CANAL, 
    change: function(newId) {
        this.id = newId;
    },
    create: async function() {
        const newAssistant = await this.openai.beta.assistants.create({
            name: "Asistente de WhatsApp",
            instructions: "Eres un asistente de WhatsApp que responde a las preguntas de los usuarios.",
            tools: [
                {
                    type: "code_interpreter"
                },
                {
                    type: "retrieval"
                }
            ],
            model: "gpt-4-1106-preview"
        });
        this.change(newAssistant.id);
        return newAssistant.id;
    },
    retrieve : async function() {
        return await this.openai.beta.assistants.retrieve(this.id);
    },
    message: async function (user, mns = '', timestamp = Date.now()) {
        let threadId = user.thread_id; // 🔹 Aseguramos que se reutiliza el hilo existente
        try {
            const dateString = new Date(timestamp * 1000).toISOString();
            await this.openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: `
                    Fecha del mensaje: ${dateString},
                    Mensaje: ${mns}
                `
            });
    
            const run = await this.openai.beta.threads.runs.createAndPoll(threadId, {
                assistant_id: this.id
            });
    
            console.log("Run", run);
            if (run.status === 'requires_action') {
                return await actions.setActions(
                    user, 
                    run.required_action.submit_tool_outputs.tool_calls
                );
            }
    
            while (run.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const updatedRun = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
                if (updatedRun.status === 'failed') { // 🔹 Aquí usé updatedRun en lugar de run
                    console.error("Run failed:", updatedRun);
                    return `Error: Run failed with details: ${updatedRun.failures.map(f => f.message).join(", ")}`;
                }
            }
    
            const messages = await this.openai.beta.threads.messages.list(threadId, { limit: 1 });
            return messages.data[0].content[0].text.value;
    
        } catch (error) {
            console.error("Error sending message:", error);
    
            // 🔹 Solo se crea un nuevo hilo si el error indica que el hilo es inválido o ha sido eliminado
            if (error.type === `invalid_request_error` && error.message.includes("Invalid thread_id")) {
                console.log("El thread_id es inválido. Creando un nuevo hilo...");
                const newThreadId = await this.thread.create();
                await user.updateThreadId(newThreadId);
                return await this.message(user, mns, timestamp); // 🔹 Reintentamos con el nuevo hilo
            }
    
            return "Hubo un error al procesar el mensaje.";
        }
    },    
    saveAudio: async function (media, id) {
        const filePath = `./tmp/${id}.ogg`;
        const buffer = Buffer.from(media.data, 'base64');
        fs.writeFileSync(filePath, buffer);
        return filePath;
    },
    transcribeAudio: async function (filePath) { 
        console.log("Transcribiendo audio..." , filePath);
        if (fs.existsSync(filePath)) {
            console.log('El archivo existe.');
            try {
                const transcription = await this.openai.audio.transcriptions.create({
                    file: fs.createReadStream(filePath),
                    model: "whisper-1",
                });
        
                console.log("Transcripción:", transcription.text);
                return transcription.text;
            } catch (error) {
                console.error("Error al transcribir:", error);
                return "Error al transcribir el audio.";
            }
        } else {
            return('El archivo no existe.');
            
        }
    
    },
    processAudioMessage: async function (media, fileName) {
        try {
            console.log("Recibido audio, procesando...");
    
            // Guardar el audio
            const filePath = await this.saveAudio(media, fileName);
            console.log("Archivo guardado en:", filePath);
            // Transcribir con Whisper
            const transcript = await this.transcribeAudio(filePath);
            return transcript; // Puedes usarlo para responder en WhatsApp
        } catch (error) {
            console.error("Error procesando el audio:", error);
            return "No pude entender el audio.";
        }
    },
    thread : {   
        create: async () => {
            const newThread = await assistant.openai.beta.threads.create();
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