class Message {
    constructor(whatsappMessage) {
        this.from = whatsappMessage.from;
        this.fromMe = whatsappMessage.fromMe;
        this.body = whatsappMessage.body;
        this.text = whatsappMessage.body;
        this.type = whatsappMessage.type;
        this.to = whatsappMessage.to;
        this.hasMedia = whatsappMessage.hasMedia;
        this.notifyName = whatsappMessage._data.notifyName;
        this.timestamp = whatsappMessage.timestamp;
        this.whatsappMessage = whatsappMessage;
    }
    getChat = async () => {
        return this.whatsappMessage.getChat();
    };
}

export default Message;