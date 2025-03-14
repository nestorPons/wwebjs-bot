export default {
    name: "help",
    description: "Muestra la lista de comandos disponibles",
    execute: async (self) => {
        if (!self.commands || self.commands.size === 0) {
            return "No hay comandos disponibles.";
        }

        let response = "📜 *Lista de comandos disponibles:*\n\n";
        self.commands.forEach((command) => {
            response += `➤ */${command.name}* - ${command.description}\n`;
        });

        return response;
    }
};
