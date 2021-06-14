import axios from "axios";
import {apiUrl} from "../../constant";
import {IComponentSimplified} from "../../model/IComponentSimplified";

let withCredConfig = {withCredentials: true};

async function create(): Promise<void> {
    await axios.get(`${apiUrl}/simulation/create`, withCredConfig);
}

async function step(): Promise<void> {
    await axios.post(`${apiUrl}/simulation/step`, {}, withCredConfig);
}

async function stop(): Promise<void> {
    await axios.post(`${apiUrl}/simulation/stop`, {}, withCredConfig);
}

async function setState(states: IComponentSimplified[]): Promise<void> {
    await axios.post(`${apiUrl}/simulation/setState`, states, withCredConfig);
}

async function getState(): Promise<IComponentSimplified[]> {
    const {data: result} = await axios.get<IComponentSimplified[]>(`${apiUrl}/simulation/getState`, withCredConfig);
    return result;
}

export {create, step, stop, setState, getState};
