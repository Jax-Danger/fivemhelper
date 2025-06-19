/// <reference types="@citizenfx/client" />
export * from './test'


// FIVEM STUFF

AddEventHandler('playerSpawned', () => {
	emitNet('server:playerSpawned')
})