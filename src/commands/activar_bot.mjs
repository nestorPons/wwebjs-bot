export default {
    name: "activar_bot",
    description: "Activa el bot para el usuario",
    execute: async (self) => {
        await self.user.setUseAI(true);
        return "Bot activado";
    }
};