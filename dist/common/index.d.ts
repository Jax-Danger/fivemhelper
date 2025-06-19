export declare class Command {
    private commandName;
    private handler;
    private restricted;
    constructor(commandName: string, handler: (source: number, args: string[]) => void, restricted: boolean);
    private register;
}
