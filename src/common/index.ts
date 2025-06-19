// Commands class
export class Command {
	private commandName: string;
	private handler: (source: number, args: string[]) => void;
	private restricted: boolean;

	constructor(
		commandName: string,
		handler: (source: number, args: string[]) => void,
		restricted: boolean
	) {
		this.commandName = commandName;
		this.handler = handler;
		this.restricted = restricted;

		this.register();
	}


	private register() {
		RegisterCommand(
			this.commandName,
			(source: number, args: string[]) => {
				this.handler(source, args);
			},
			this.restricted
		);
		console.log(`Command "${this.commandName}" registered`)
	}
}



