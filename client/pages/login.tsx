import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { getUserInfo, login } from "../utils/rest/auth";
import { ErrorClient } from "../utils/interface";

export default function Form() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logError, setError] = useState<ErrorClient | null>(null);
  const [logSuccess, setLogSuccess] = useState(false);

  const signInUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { user, error } = await login({
      mail: event.target.email.value,
      password: event.target.password.value,
    });
    setLoading(false);
    if (user) {
      setLogSuccess(true);
      await router.replace("/");
    } else {
      if (error?.response?.status === 404) error.message = "Informations d'identification non valides. Veuillez réessayer";
      setError(error);
    }
  };

  return (
    <>
      <header>
        <h1 className="title">Login</h1>
      </header>
      <div className="wrapper">
        <form className="add-form" onSubmit={signInUser}>
          <div className="field stack">
            <label htmlFor="email" className="field__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="field__input"
              placeholder="johndoe@provider.com"
            />
          </div>
          <div className="field stack">
            <label htmlFor="password" className="field__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="field__input"
            />
          </div>
          <small>
            Don&apos;t have an account?{" "}
            <Link href="/signup">
              <a>Sign up</a>
            </Link>
          </small>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "loading..." : "Login"}
          </button>
          {logError && <p className="error">{logError.message}</p>}
          {logSuccess && <p>Redirecting to profile...</p>}
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { user } = await getUserInfo(context.req.cookies?.token);

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
