import LOGGER from "../../utils/logger";
import { Socket, Server } from "socket.io";
import { ControlSimulations } from "../../controllers/ControlSimulations";

export default class SimulationSockets {
    public static init(server: Server) {
        server.on("connection", (socket: Socket) => {
            LOGGER.INFO("SimulationSockets", `New user logged on socket "${socket.id}"`);
            this.runGetStepFromSimulation(socket);
            this.stopGetStepFromSimulation(socket);
        });
    }

    private static runGetStepFromSimulation(socket: Socket) {
        LOGGER.INFO("runGetStepFromSimulation", `User ${socket.id} subscribe`);
        socket.on("runGetStepFromSimulation", ({ userId }: { userId: string }) => {
            LOGGER.INFO("runGetStepFromSimulation", `User ${userId} execute`);
            ControlSimulations.stepFromSimulation(userId, (nextState, hasNextStep) => {
                if (hasNextStep) {
                    LOGGER.INFO("getStepFromSimulation", "Emit update");
                    socket.emit("updateSimulation", nextState);
                } else {
                    LOGGER.INFO("getStepFromSimulation", "Emit stop");
                    socket.emit("stopSimulation", nextState);
                }
            });
        });
    }

    private static stopGetStepFromSimulation(socket: Socket) {
        LOGGER.INFO("stopGetStepFromSimulation", `User ${socket.id} subscribe`);
        socket.on("stopGetStepFromSimulation", ({ userId }: { userId: string }) => {
            LOGGER.INFO("stopGetStepFromSimulation", `User ${userId} execute`);
            ControlSimulations.stopFromSimulation(userId, (nextState) => {
                socket.emit("stopSimulation", nextState);
            });
        });
    }
}
