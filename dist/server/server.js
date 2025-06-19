"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nothing = void 0;
// Below are the events for the client side exports of the script:
onNet("Handcuff", (target) => {
    console.log("cuffing...", target);
    emitNet("Handcuff", target);
});
onNet("RemoveHandcuff", (target) => {
    console.log("removing cuffs...", target);
    emitNet("RemoveHandcuff", target);
});
onNet("Drag", (target, dragger) => {
    // Emit back to the target client with both IDs
    console.log("dragging...", target);
    emitNet("Drag", target, target, dragger);
});
onNet("ForceIntoVehicle", (target, index) => {
    console.log("Forcing into vehicle...", target);
    emitNet("ForceIntoVehicle", target, target, index);
});
onNet("ForceOutOfVehicle", (target, index) => {
    console.log("forcing out of vehicle...", target);
    emitNet("ForceOutOfVehicle", target, index);
});
