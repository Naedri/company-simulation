import axios from "axios";
import { apiUrl } from "../../constant";
import { IPermissionSchema } from "../../model/IPermissionSchema";

const withCredConfig = { withCredentials: true };

async function getPermissions(): Promise<IPermissionSchema> {
    const { data: result } = await axios.get<IPermissionSchema>(`${apiUrl}/permissions/`, withCredConfig);
    return result;
}

async function updatePermissions(data: IPermissionSchema): Promise<void> {
    await axios.put(`${apiUrl}/permissions/`, data, withCredConfig);
}

export { getPermissions, updatePermissions };
