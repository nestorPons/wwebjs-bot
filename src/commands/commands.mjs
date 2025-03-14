import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commands = {
    commands: new Map(),
    user: null,
    load: async function () {
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".mjs"));

        for (const file of commandFiles) {
            if (file === "commands.mjs") continue;

            const commandPath = path.join(__dirname, file);
            const command = await import(`file://${commandPath}`); // Import dinámico en ES6
            
            this.commands.set(command.default.name, command.default);
        }
    },
    isCommand: (text) => text.startsWith("/"),
    process: async function (user, text) {
        this.user = user;
        const commandName = text.slice(1);
        const response = await this.executeCommand(commandName, user);
        return response;
    },

    executeCommand: async function (commandName, user) {
        const command = this.commands.get(commandName);
        console.log(commandName)
        if (!command) {
            console.log(`Comando "${commandName}" no encontrado.`);            
            return false;
        }

        return await command.execute(this, user);
    },
};
commands.load();
export default commands;
