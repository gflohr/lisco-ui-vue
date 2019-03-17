import ChessTools from 'chess-tools';

import AbstractPlayer from './abstract-player';

const { Connection, Manager } = ChessTools.Engines;

export default class EnginePlayer extends AbstractPlayer {
	constructor(options) {
		super();
		this.name = options.name;
		this.connectionType = options.connection;
		this.managerType = options.manager;
		this.path = options.path;
	}

	init() {
		return new Promise((resolve, reject) => {
			if ('local' === this.connectionType) {
				if (typeof this.path === 'undefined') {
					throw new Error("Local process connection requires 'path'");
				}
				this.connection = new Connection.LocalProcess(this.path);
			} else {
				reject(new Error(`Unknown connection type '${this.connectionType}'`));
			}

			if ('UCI' === this.managerType) {
				this.manager = new Manager.UCI(this.connection, { name: this.name });
			} else {
				reject(new Error(`Unknown connection type '${this.managerType}'`));
			}

			this.manager.on('initialized', () => {
				resolve();
			});
		});
	}

	async requestMove() {
		console.log(`${this.name} has to move`);
	}
}
