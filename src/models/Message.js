import assistant from "#assistant/assistant.js";

class Message {
    constructor(whatsappMessage) {
        this.id = whatsappMessage.id.id;
        this.from = whatsappMessage.from;
        this.tel = whatsappMessage.from.replace(/@c\.us$/, '');
        this.fromMe = whatsappMessage.fromMe;
        this.body = whatsappMessage.body;
        this.text = whatsappMessage.body;
        this.type = whatsappMessage.type;
        this.to = whatsappMessage.to;
        this.hasMedia = whatsappMessage.hasMedia;
        this.notifyName = whatsappMessage._data.notifyName;
        this.fromName = this.notifyName ?? this.tel; 
        this.timestamp = whatsappMessage.timestamp;
        this.whatsappMessage = whatsappMessage;
        this.media = null
        this.isAudio = false
    }

    static construct = async (whatsappMessage) => {
        const self = new Message(whatsappMessage);
        if(self.hasMedia) {
            self.media = await self.downloadMedia();
            self.isAudio = self.media.mimetype.startsWith('audio');
            if (self.isAudio) {
                const text = await assistant.processAudioMessage(self.media, self.from);
                console.log("message:", text);
                self.text = text;
            }
        }

        return self;
    }

    downloadMedia = async () => {
        return this.whatsappMessage.downloadMedia();
    }
    getChat = async () => {
        return this.whatsappMessage.getChat();
    };
}

export default Message;