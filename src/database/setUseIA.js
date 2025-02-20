import openDatabase from './open.js';

const setUseIA = async (userId, state = false) => {
    const db = await openDatabase();
    stateInt = state ? 1 : 0;
    const row = await db.get(`UPDATE users SET use_ia = ? WHERE id = ?;`, stateInt, userId);
    return row ? row.thread_id.toString() : null;
}

export default setUseIA;
