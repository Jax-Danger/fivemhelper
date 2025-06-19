/**
 * Registers an NUI callback with a custom handler for communication between client and UI.
 * @param name The unique name of the NUI callback.
 * @param handler A function to handle the data received from the UI. It receives the data and a callback to send a response back.
 * @returns A function to unregister the callback (useful for cleanup).
 */
export declare function CreateNuiCB(name: string, handler: (data: any, cb: (response: any) => void) => void): void;
/**
 * Get Distance between coordinates
 */
export declare function getDistance(coords1: number[], coords2: number[]): number;
/**
 * Get the closest player
 */
export declare function getClosestPlayer(coords: any, maxDistance: number): {
    closestId: number;
    closestPed: any;
    closestCoords: any;
};
/**
 * Load animation dictonary
 */
export declare function loadAnimDict(dict: string): Promise<void>;
export declare function Handcuff(): Promise<void>;
/**
 * Remove player handcuffs
 */
export declare function removeHandcuffs(): Promise<void>;
export declare function dragPlayer(): void;
/**
 * Force into vehicle
*/
export declare function forceIntoVehicle(): void;
export declare function ForceOutOfVehicle(): void;
