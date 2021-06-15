import LOGGER from "../../utils/logger";
import { Socket, Server } from "socket.io";
import { ControlSimulations } from "../../controllers/ControlSimulations";

export default class SimulationSockets {
    static init(server:Server) {
        server.on("connection", (socket:Socket) => {
            LOGGER.INFO("SimulationSockets", `New user logged on socket "${socket.id}"`);
            socket.on("getStepFromSimulation", ({userId}) => {
                LOGGER.INFO("getStepFromSimulation", `User ${userId} subscribe`);
                ControlSimulations.stepFromSimulation(userId, (nextState, hasNextStep) => {
                    if (hasNextStep) {
                        LOGGER.INFO("getStepFromSimulation", "Emit update");
                        socket.emit("updateSimulation", nextState);
                    }else{
                        LOGGER.INFO("getStepFromSimulation", "Emit stop");
                        socket.emit("stopSimulation");
                    }
                });
            });
        });
    }
}
