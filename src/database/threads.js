import openDatabase from './open.js';

const thread = {
    db: null,
    init : async function (){
        this.db = await openDatabase();
    },
    set : async function (userId, threadId) {;
        const respond = await this.db.run(`INSERT INTO users (id, thread_id) VALUES (?, ?)
                     ON CONFLICT(id) DO UPDATE SET thread_id = excluded.thread_id;`,
                     userId, threadId);
        return respond
    },    
    get : async function (userId){
        const row = await this.db.get(`SELECT thread_id FROM assistants WHERE id = ?`, userId);
        return row ? row.thread_id.toString() : null;
    },
    delete : async function(userId) {
        const row = await this.db.get(`UPDATE users SET thread_id = NULL WHERE id = ?;`, userId);
        return row ? row.thread_id.toString() : null;
    }
}

(async () => {await thread.init();})();

export default thread;