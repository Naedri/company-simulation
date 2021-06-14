import axios from "axios";
import { apiUrl } from "../../constant";
import { UserResponse } from "../../interface";


const withCredConfig = { withCredentials: true };

async function login({
                         mail,
                         password,
                     }: {
    mail: string;
    password: string;
}): Promise<UserResponse> {
    try {
        const apiResponse = await axios.post(
            `${apiUrl}/users/login`,
            { mail, password },
            withCredConfig
        );
        return { user: apiResponse.data, error: null };
    } catch (e) {
        console.log(e);
        return { user: null, error: e };
    }
}

async function logout(): Promise<{ success: boolean; error: Error | null }> {
    try {
        await axios.post(`${apiUrl}/users/logout`, {}, withCredConfig);
        return { success: true, error: null };
    } catch (e) {
        return { success: false, error: e };
    }
}

async function register({ mail, password }): Promise<UserResponse> {
    try {
        const apiResponse = await axios.post(`${apiUrl}/users/register`, {
            mail,
            password,
        }, withCredConfig);
        return { user: apiResponse.data, error: null };
    } catch (e) {
        return { user: null, error: e };
    }
}

async function getUserInfo(token = null): Promise<UserResponse> {
    const config: any = withCredConfig;
    if (token) {
        config.headers = { Cookie: `token=${token}` };
    }
    try {
        const apiResponse = await axios.get(`${apiUrl}/users/me`, config);
        return { user: apiResponse.data, error: null };
    } catch (e) {
        return { user: null, error: e };
    }
}

export { login, logout, register, getUserInfo };
