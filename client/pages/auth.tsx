import styles from "../styles/Auth.module.css";
import useUser from "../lib/useUser";
import {SyntheticEvent} from "react";

const Auth = () => {

    // https://stackoverflow.com/questions/66399063/next-js-authentication-with-jwt
    // just use swr and no context https://codesandbox.io/s/swr-auth-tuqtf?from-embed=&file=/libs/api-user.js
    // no context, just decode cookie
    const {setUser} = useUser({
        redirectTo: "/",
        redirectIfFound: true,
    });

    const handleSubmit = (e: SyntheticEvent, type: "LOGIN" | "SIGNUP") => {
        e.stopPropagation();
        setUser(true);
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.auth}>
                <div className={styles.spaced}>
                    <label className={styles.lbl} htmlFor={"email"}>
                        Email
                    </label>
                    <input
                        type={"email"}
                        placeholder={"jean@provider.io"}
                        id={"email"}
                        name={"email"}
                        autoComplete={"username"}
                        className={styles.ipt}
                        required
                    />
                </div>
                <div className={styles.spaced}>
                    <label className={styles.lbl} htmlFor={"password"}>
                        Password
                    </label>
                    <input
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        autoComplete={"current-password"}
                        className={styles.ipt}
                        required
                    />
                </div>
                <div className={styles.submit}>
                    <button
                        type="submit"
                        className={styles.btn}
                        onClick={(e) => handleSubmit(e, "LOGIN")}
                    >
                        Sign up
                    </button>
                    <button
                        type="submit"
                        className={styles.btn}
                        onClick={(e) => handleSubmit(e, "SIGNUP")}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Auth;
