import { Model } from '#conn';

class User extends Model {

    static get tableName() {
        return 'users';
    }
   
    static async findOrCreate(id, name=null) {
        let user = await this.query().findById(id);
        if (!user) {
            user = await this.query().insertAndFetch({ id: id, name: name });
            console.log(`User ${id} created`);
        }else{
            console.log(`User ${id} already exists`);
        }
        return user;
    }
        
    async setUseAI(state = false) {
        this.use_ia = state;
        await this.$query().patchAndFetch({ use_ia: state });
        console.log(`El usuario ${this.id} ha cambiado su configuración de IA a ${state ? 'activada' : 'desactivada'}.`);
        return this.use_ia;
    }

    async updateThreadId  (threadId) {
        try{
            this.thread_id = threadId;
            return await this.$query().patchAndFetch({ thread_id: threadId });
        }catch(error){
            console.error('Error al actualizar el hilo:', error);
            return false;
        }
    }
}

export default User;