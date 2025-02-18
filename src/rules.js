import getUser from './database/getUser.js';

const rules = (user, message) => {
    //BRUNO "34672839400@c.us"
    //LLEDO 34601297415@c.us
    //NEREA 34613320927@c.us
    //NESTOR 34660291797@c.us
    if (message.hasMedia || message.type !== 'chat') return true;
    if (message.from != "34660291797@c.us") return true;
    if(!message.body.startsWith('.')) return true;
    return !user.useIA;
}

export default rules;