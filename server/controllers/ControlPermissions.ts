import { IPermissionSchema } from "../model/IPermissionSchema";
import { IComponentSimplified } from "../model/IComponentSimplified";

export class ControlPermissions {
    private static schema: IPermissionSchema = {};

    private constructor() {
    }

    static updatePermissions(permisssions: IPermissionSchema) {
        ControlPermissions.schema = { ...permisssions };
    }

    static statesAreProtected(states: IComponentSimplified[]) {
        states.forEach(state => {
            if (state.type in ControlPermissions.schema) {
                if (ControlPermissions.schema[state.type] && ControlPermissions.schema[state.type].locked) {
                    throw new Error(`${state.id} is locked`);
                }

                for (const stateKey in state) {
                    if (stateKey === "id" || stateKey === "type") {
                        continue;
                    }

                    if (stateKey in ControlPermissions.schema[state.type]) {
                        if (ControlPermissions.schema[state.type][stateKey]) {
                            throw new Error(`${state.id}.${stateKey} is locked`);
                        }
                    }
                }
            }
        });
    }

    static getPermissions(): IPermissionSchema {
        return ControlPermissions.schema;
    }
}
