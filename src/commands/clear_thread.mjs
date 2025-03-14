export default {
    name: "clear_thread",
    description: "Limpia el ID del hilo del usuario",
    execute: async (self) => {
        self.user.thread_id = null;
        return "Hilo limpiado";
    }
};