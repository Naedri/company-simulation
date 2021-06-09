import Link from "next/link";
import { getUserInfo, logout } from "../utils/rest/auth";
import Layout from "../components/layout";

export async function getServerSideProps(context) {
  const { user } = await getUserInfo(context.req.cookies?.token);

  if (user) {
    return {
      props: { user },
    };
  }
  return {
    props: {},
    redirect: {
      destination: "login",
      permanent: false,
    },
  };
}

export default function Form({ user }) {
  return (
    <>
      <Layout user={user}>
        <h1>Welcome to web simulation!</h1>
        <ul>
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
        </ul>
      </Layout>
    </>
  );
}
