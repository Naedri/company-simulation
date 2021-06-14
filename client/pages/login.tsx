import {useRouter} from "next/router";
import {useState} from "react";
import Link from "next/link";
import {getUserInfo, login} from "../utils/rest/auth";
import {ErrorClient} from "../utils/interface";
import Form from "../components/Form";
import UncontrolledInput from "../components/UncontrolledInput";
import Button from "../components/Button";

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logError, setError] = useState<ErrorClient | null>(null);
    const [logSuccess, setLogSuccess] = useState(false);

    const signInUser = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const {user, error} = await login({
            mail: event.target.email.value,
            password: event.target.password.value,
        });
        setLoading(false);
        if (user) {
            setLogSuccess(true);
            if (
                window.history.length > 1 &&
                document.referrer.indexOf(window.location.host) !== -1
            ) {
                await router.back();
            } else {
                await router.replace("/");
            }
        } else {
            if (error?.response?.status === 404)
                error.message =
                    "Informations d'identification non valides. Veuillez réessayer";
            setError(error);
        }
    };

    return (
        <>
            <header>
                <h1 className="title">Login</h1>
            </header>
            <div className="wrapper">
                <Form onSubmit={signInUser}>
                    <UncontrolledInput
                            id="email"
                            type="email"
                            name="email"

                            placeholder="johndoe@provider.com"

                        label={"Email"}
                            required
                        />
                        <UncontrolledInput
                            id="password"
                            type="password"
                            name="password"
                            label={"Password"}
                        required
                    />
                    <small>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup">
                            <a>Sign up</a>
                        </Link>
                    </small>
                    <Button type="submit"  disabled={loading}>
                        {loading ? "loading..." : "Login"}
                    </Button>
                    {logError && <p className="error">{logError.message}</p>}
                    {logSuccess && <p>Redirecting to profile...</p>}
                </Form>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const {user} = await getUserInfo(context.req.cookies?.token);

    if (user) {
        return {
            props: {},
            redirect: {
                destination: "dashboard",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
}
