import axios from "axios";
import { apiUrl } from "../../constant";
import { UserResponse } from "../../interface";

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
      { withCredentials: true }
    );
    return { user: apiResponse.data, error: null };
  } catch (e) {
    console.log(e);
    return { user: null, error: e };
  }
}

async function logout(): Promise<{ success: boolean; error: Error | null }> {
  try {
    await axios.post(`${apiUrl}/users/logout`, {}, { withCredentials: true });
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
    });
    return { user: apiResponse.data, error: null };
  } catch (e) {
    return { user: null, error: e };
  }
}

async function getUserInfo(token = null): Promise<UserResponse> {
  try {
    const apiResponse = await axios.get(`${apiUrl}/users/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    });
    return { user: apiResponse.data, error: null };
  } catch (e) {
    return { user: null, error: e };
  }
}

export { login, logout, register, getUserInfo };
