import Link from "next/link";
import { logout } from "../utils/rest/auth";
import Layout from "../components/layout";

export default function Form() {
    return (
        <>
        <Layout>
            <h1>
                Welcome to web simulation!
            </h1>
            <li>
                <Link href="/dashboard">
                    <a>dashboard</a>
                </Link>
            </li>
            <li>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </li>
            <li>
                <button onClick={() => logout()}>Logout</button>
            </li>
            </Layout>
        </>
    );
}
