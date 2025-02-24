const rules = (user, message) => {
    //BRUNO "34672839400@c.us"
    //LLEDO 34601297415@c.us
    //NEREA 34613320927@c.us
    //NESTOR 34660291797@c.us
    if(message.text == 'off') {
        user.setUseAI(false);
        return false;
    }
    if(message.hasMedia || message.type !== 'chat') return false;
    if(message.from != "34660291797@c.us") return false;
    if(!message.body.startsWith('.')) return false;
    return user.useIA;
}

export default rules;