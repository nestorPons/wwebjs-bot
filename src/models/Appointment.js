import { Model } from 'objection';

class Appointment extends Model {
    static get tableName() {
        return 'appointments';
    }

    // Crear una nueva cita
    static async create(userId, timestamp) {
        const now = Date.now();
        
        if (timestamp < now) {
            console.log(`La fecha y hora de la cita deben ser posteriores a la fecha y hora actual.`);
            return false;
        }

        // Insertar y devolver la cita creada
        const appointment = await this.query().insertAndFetch({
            user_id: userId,
            timestamp: timestamp
        });

        return appointment;
    }

    // Obtener todas las citas de un usuario
    static async getAll(userId) {
        return await this.query().where('user_id', userId);
    }
}

export default Appointment;
