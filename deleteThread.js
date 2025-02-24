import assistant from './src/assistant/assistant.js';
import getUserOrCreate from './src/database/getUser.js';
import deleteThreadId from './src/database/deleteThreadId.js';

const user = getUserOrCreate('34660291797@c.us')
const threadId = user.ThreadId;
await assistant.thread.delete(threadId);
await deleteThreadId(user.id)
console.log('ELiminado hilo : ' . threadId)