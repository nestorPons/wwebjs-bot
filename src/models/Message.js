class Message {
    constructor(whatsappMessage) {
        this.from = whatsappMessage.from;
        this.body = whatsappMessage.body;
        this.text = whatsappMessage.body.slice(1);
        this.type = whatsappMessage.type;
        this.hasMedia = whatsappMessage.hasMedia;
        this.notifyName = whatsappMessage.notifyName;
        this.timestamp = whatsappMessage.timestamp;
        this.whatsappMessage = whatsappMessage;
    }
    getChat = async () => {
        return this.whatsappMessage.getChat();
    };
}

export default Message;