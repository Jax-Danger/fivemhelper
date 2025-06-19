"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNuiCB = CreateNuiCB;
exports.getDistance = getDistance;
exports.getClosestPlayer = getClosestPlayer;
exports.loadAnimDict = loadAnimDict;
exports.Handcuff = Handcuff;
exports.removeHandcuffs = removeHandcuffs;
exports.dragPlayer = dragPlayer;
exports.forceIntoVehicle = forceIntoVehicle;
exports.ForceOutOfVehicle = ForceOutOfVehicle;
/**
 * Registers an NUI callback with a custom handler for communication between client and UI.
 * @param name The unique name of the NUI callback.
 * @param handler A function to handle the data received from the UI. It receives the data and a callback to send a response back.
 * @returns A function to unregister the callback (useful for cleanup).
 */
function CreateNuiCB(name, handler) {
    // Register the NUI callback type
    RegisterNuiCallbackType(name);
    // Define the event name for listening (FiveM prefixes NUI events with __cfx_nui:)
    const eventName = `__cfx_nui:${name}`;
    // Set up the event listener to handle incoming data from the UI
    const listener = (data, cb) => {
        handler(data, cb);
    };
    // Register the event listener
    on(eventName, listener);
}
/**
 * Get Distance between coordinates
 */
function getDistance(coords1, coords2) {
    console.log('getting distance');
    const dx = coords1[0] - coords2[0];
    const dy = coords1[1] - coords2[1];
    const dz = coords1[2] - coords2[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance;
}
/**
 * Get the closest player
 */
function getClosestPlayer(coords, maxDistance) {
    console.log('getting closest player');
    const players = GetActivePlayers();
    let closestId = -1;
    let closestPed = null;
    let closestCoords = null;
    maxDistance = maxDistance || 2.0;
    const currentId = PlayerId();
    for (let i = 0; i < players.length; i++) {
        const playerId = players[i];
        if (playerId !== currentId) {
            const playerPed = GetPlayerPed(playerId);
            const playerCoords = GetEntityCoords(playerPed, true);
            const distance = getDistance(coords, playerCoords);
            if (distance < maxDistance) {
                maxDistance = distance;
                closestId = playerId;
                closestPed = playerPed;
                closestCoords = playerCoords;
            }
        }
    }
    return { closestId, closestPed, closestCoords };
}
/**
 * Load animation dictonary
 */
async function loadAnimDict(dict) {
    console.log('loading dictionary');
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
        Wait(100);
    }
}
/**
 * Handcuff nearest player
 */
let handcuff = false;
async function Handcuff() {
    console.log(`attempting to handcuff`);
    const playerCoords = GetEntityCoords(PlayerPedId(), true);
    const { closestId } = getClosestPlayer(playerCoords, 2.0);
    if (closestId !== -1) {
        const serverid = GetPlayerServerId(closestId);
        console.log(serverid);
        emitNet("Handcuff", serverid);
        console.log(`Should have triggered the Handcuff server event with id ${serverid}`);
    }
    else {
        console.error(`No player found within the specified distance`);
    }
}
onNet("Handcuff", async () => {
    console.log(`Received Handcuff event from server.`);
    const lPed = GetPlayerPed(-1);
    if (!handcuff) {
        await loadAnimDict("mp_arresting");
        TaskPlayAnim(lPed, "mp_arresting", "idle", 8.0, -8, -1, 49, 0, false, false, false);
        SetEnableHandcuffs(lPed, true);
        SetCurrentPedWeapon(lPed, GetHashKey("WEAPON_UNARMED"), true);
        handcuff = true; // This should be managed per player
    }
});
/**
 * Remove player handcuffs
 */
async function removeHandcuffs() {
    console.log(`attempting to remove handcuff`);
    const playerCoords = GetEntityCoords(PlayerPedId(), true);
    const { closestId } = getClosestPlayer(playerCoords, 2.0);
    if (closestId !== -1) {
        const serverid = GetPlayerServerId(closestId);
        emitNet('RemoveHandcuff', serverid);
    }
    else {
        console.error(`No Player found within the specified distance`);
    }
}
onNet("RemoveHandcuffs", async () => {
    const lPed = GetPlayerPed(-1);
    if (handcuff) {
        ClearPedSecondaryTask(lPed);
        SetEnableHandcuffs(lPed, false);
        SetCurrentPedWeapon(lPed, GetHashKey("WEAPON_UNARMED"), true);
        handcuff = false; // This should be managed per player
    }
});
/**
 * Dragging players
 */
let DraggedPlayer = -1;
let draggedBy = -1;
let drag = false;
function dragPlayer() {
    console.log("dragging player");
    const playerCoords = GetEntityCoords(PlayerPedId(), true);
    const nearestPlayer = getClosestPlayer(playerCoords, 2.0);
    const nearestPlayerId = nearestPlayer.closestId;
    if (nearestPlayerId !== -1) {
        const serverId = GetPlayerServerId(nearestPlayerId);
        DraggedPlayer = serverId;
        // Emit to server with both source (dragger) and target (draggee) IDs
        emitNet("Drag", serverId, GetPlayerServerId(PlayerId()));
    }
    else {
        console.log("There is no player nearby!");
    }
}
onNet("Drag", (target, dragger) => {
    const myServerId = GetPlayerServerId(PlayerId());
    // freeze target
    const lPed = GetPlayerPed(-1);
    if (target === myServerId) {
        draggedBy = dragger;
        drag = !drag;
        if (drag) {
            SetEnableHandcuffs(lPed, true);
        }
        else {
            SetEnableHandcuffs(lPed, false);
        }
    }
});
/**
 * Force into vehicle
*/
function forceIntoVehicle() {
    console.log(`attempting to force into vehicle`);
    const playerPed = PlayerPedId();
    const plCoords = GetEntityCoords(playerPed, true);
    const nearestPlayer = exports["TSLib"].getClosestPlayer(plCoords, 2.0);
    const closestPlayer = nearestPlayer.closestId;
    console.log(closestPlayer, GetPlayerServerId(closestPlayer));
    if (closestPlayer <= 0) {
        return console.log("No player found");
    }
    emitNet("ForceIntoVehicle", GetPlayerServerId(closestPlayer), closestPlayer);
}
onNet("ForceIntoVehicle", (target, index) => {
    console.log(1);
    // Assuming target is a player index, get the ped handle for the target player
    const targetPed = GetPlayerPed(index);
    const playerPed = PlayerPedId();
    const plCoords = GetEntityCoords(playerPed, true);
    const [x, y, z] = [plCoords[0], plCoords[1], plCoords[2]];
    const vehicle = GetClosestVehicle(x, y, z, 5, 0, 127); // Get the closest vehicle within 5 units
    console.log(vehicle);
    if (vehicle) {
        console.log(2);
        const vehicleCoords = GetEntityCoords(vehicle, true);
        const distance = GetDistanceBetweenCoords(plCoords[0], plCoords[1], plCoords[2], vehicleCoords[0], vehicleCoords[1], vehicleCoords[2], true);
        if (distance < 5) {
            console.log(targetPed);
            console.log(`Warping player ${target} into seat: 2`);
            // Use targetPed instead of target to correctly warp the ped into the vehicle
            TaskWarpPedIntoVehicle(targetPed, vehicle, 2);
        }
    }
    else {
        console.log("No vehicle available or no nearest player found.");
    }
});
function ForceOutOfVehicle() {
    console.log(`attempting to force out of vehicle`);
    const playerPed = PlayerPedId();
    const plCoords = GetEntityCoords(playerPed, true);
    const nearestPlayer = exports["TSLib"].getClosestPlayer(plCoords, 2.0);
    const closestPlayer = nearestPlayer.closestId;
    console.log(closestPlayer, GetPlayerServerId(closestPlayer));
    if (closestPlayer <= 0) {
        return console.log("No player found");
    }
    emitNet("ForceOutOfVehicle", GetPlayerServerId(closestPlayer), closestPlayer);
}
onNet("ForceOutOfVehicle", (index) => {
    const playerPed = GetPlayerPed(index);
    const vehicle = GetVehiclePedIsIn(playerPed, true);
    if (vehicle !== 0)
        TaskLeaveAnyVehicle(playerPed, vehicle, 16);
    else
        console.error(`Player is not in a vehcle`);
});
