import dotenv from 'dotenv';
dotenv.config();

const rules = async (user, message, groupId) => {
    //BRUNO "34672839400@c.us"
    //LLEDO 34601297415@c.us
    //NEREA 34613320927@c.us
    //NESTOR 34660291797@c.us
    const respond = null;
    switch (message.text) {
        case "clear_thread":
            user.threadId  = null;
            break;
        case "Activar bot":
            await user.setUseAI(true);
            return  "Bot activado";
        case "Desactivar bot":
            await user.setUseAI(false);
            return  "Bot desactivado";
    }

    if(message.hasMedia || message.type !== 'chat') return false;
    return user.useIA || message.to == groupId;
}

export default rules;