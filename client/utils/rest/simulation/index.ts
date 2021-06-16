import axios from "axios";
import { apiUrl } from "../../constant";
import { IComponent } from "../../model/IComponent";

const withCredConfig = { withCredentials: true };

async function create(exampleId = ""): Promise<void> {
    return axios.get(`${apiUrl}/simulation/create/${exampleId}`, withCredConfig);
}

async function step(): Promise<void> {
    return axios.post(`${apiUrl}/simulation/step`, {}, withCredConfig);
}

async function stop(): Promise<void> {
    return axios.post(`${apiUrl}/simulation/stop`, {}, withCredConfig);
}

async function setState(states: IComponent[]): Promise<void> {
    return axios.patch(`${apiUrl}/simulation/setState`, states, withCredConfig);
}

async function getState(token = null): Promise<[data?: IComponent[], error?: Error]> {
    const config: any = withCredConfig;
    if (token) {
        config.headers = { Cookie: `token=${token}` };
    }
    try {
        const { data: result } = await axios.get<IComponent[]>(`${apiUrl}/simulation/getState`, config);
        return [result, undefined];
    } catch (e) {
        return [undefined, e];
    }
}

export { create, step, stop, setState, getState };
