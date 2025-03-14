export default {
    name: "desactivar_bot",
    description: "Desactiva el bot para el usuario",
    execute: async (self) => {
        await self.user.setUseAI(false);
        return "Bot desactivado";
    }
};