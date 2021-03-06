export class SimulationNotInitializedException extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SimulationNotInitializedException.prototype);
    }
}