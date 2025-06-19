"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
// Commands class
class Command {
    constructor(commandName, handler, restricted) {
        this.commandName = commandName;
        this.handler = handler;
        this.restricted = restricted;
        this.register();
    }
    register() {
        RegisterCommand(this.commandName, (source, args) => {
            this.handler(source, args);
        }, this.restricted);
        console.log(`Command "${this.commandName}" registered`);
    }
}
exports.Command = Command;
