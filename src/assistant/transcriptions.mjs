import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

async function saveAudio(media, id) {
    const filePath = `./tmp/${id}.ogg`;
    const buffer = Buffer.from(media.data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

async function transcribeAudio(filePath) {
    console.log("API Key:", process.env.OPENAI_API_KEY);

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    console.log("Transcribiendo audio..." , filePath);
    if (fs.existsSync(filePath)) {
        console.log('El archivo existe.');
        try {
            const transcription = await openai.audio.transcriptions.create({
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

}

async function processAudioMessage(media, id) {
    try {
        console.log("Recibido audio, procesando...");

        // Guardar el audio
        const filePath = await saveAudio(media, id);

        // Transcribir con Whisper
        const transcript = await transcribeAudio(filePath);
        return transcript; // Puedes usarlo para responder en WhatsApp
    } catch (error) {
        console.error("Error procesando el audio:", error);
        return "No pude entender el audio.";
    }
}

export { processAudioMessage };