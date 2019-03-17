/* eslint no-param-reassign: ["error", { "props": false }] */

import Vue from 'vue';
import Vuex from 'vuex';
import Chess from 'chess.js';
import TimeControl from '../time-control';
import Human from '../players/human';
import EnginePlayer from '../players/engine-player';

import Game from './modules/game';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		Game,
	},
	state: {
		chess: new Chess(),
		live: true,
		history: [],
		boardFlipped: false,
		whitePlayer: new Human({ color: 'w' }),
		blackPlayer: new Human({ color: 'b' }),
		whiteTimeControl: new TimeControl(40, 5 * 60 * 1000, 0),
		blackTimeControl: new TimeControl(40, 5 * 60 * 1000, 0),
	},
	mutations: {
		move(state, options) {
			const move = state.chess.move(options);
			if (move === undefined) return;

			const whiteOnMove = state.chess.turn() === 'w';
			if (whiteOnMove) {
				state.blackTimeControl.stop();
				state.whiteTimeControl.start();
				state.whitePlayer.requestMove();
			} else {
				state.whiteTimeControl.stop();
				state.blackTimeControl.start();
				state.blackPlayer.requestMove();
			}

			state.history.push(move);
		},
	},
	actions: {
		async start({ state }, options) {
			state.whitePlayer = new EnginePlayer(state.chess, options.white);
			state.blackPlayer = new EnginePlayer(state.chess, options.black);

			state.started = true;

			await Promise.all([
				state.whitePlayer.init(),
				state.blackPlayer.init(),
			]);

			state.whiteTimeControl.start();
			await state.whitePlayer.requestMove();
			state.whiteTimeControl.stop();
		},
	},
	getters: {
		whiteTimeLeft: state => state.whiteTC[1] * 3600000,
		blackTimeLeft: state => state.blackTC[1] * 3600000,
		whiteTimeElapsed: (state) => {
			let elapsed = state.whiteElapsed;

			if (state.started && state.chess.turn() === 'w') {
				elapsed += performance.now() - state.startedThinking;
			}

			return elapsed;
		},
		blackTimeElapsed: (state) => {
			let elapsed = state.blackElapsed;

			if (state.started && state.chess.turn() === 'b') {
				elapsed += performance.now() - state.startedThinking;
			}

			return elapsed;
		},
	},
});
