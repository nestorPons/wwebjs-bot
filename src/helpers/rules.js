import dotenv from 'dotenv';
dotenv.config();

const rules = async (user, message, groupId) => {
    //BRUNO "34672839400@c.us"
    //LLEDO 34601297415@c.us
    //NEREA 34613320927@c.us
    //NESTOR 34660291797@c.us
    
    if (message.fromMe) {
        console.log('Message from me');
        if (!message.text.startsWith('.')) return false;
        message.text = message.body.slice(1);
        return true;
    }

    return user.use_ia || message.to == groupId;
}

export default rules;