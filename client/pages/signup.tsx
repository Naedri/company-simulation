import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { getUserInfo, register } from "../utils/rest/auth";

import { ErrorClient } from "../utils/interface";
import Form from "../components/Form";
import UncontrolledInput from "../components/UncontrolledInput";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logError, setError] = useState<ErrorClient | null>(null);
  const [logSuccess, setLogSuccess] = useState(false);
  // Drop context and just use ssr...

  const signUpUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { user, error } = await register({
      mail: event.target.email.value,
      password: event.target.password.value,
    });
    setLoading(false);
    if (user) {
      setLogSuccess(true);
      await router.replace("/");
    } else {
      if (error?.response?.status === 409)
        error.message = "Cette adresse mail est déjà utilisée.";
      setError(error);
    }
  };

  return (
    <>
      <header>
        <h1 className="title">Sign up</h1>
      </header>
      <div className="wrapper">
        <Form onSubmit={signUpUser}>
          <UncontrolledInput
            label={"email"}
            id="email"
            type="email"
            name="email"
            required
            placeholder="johndoe@provider.com"
          />
          <UncontrolledInput
            label={"Password"}
            id="password"
            type="password"
            name="password"
            required
          />
          <small>
            Already have an account?{" "}
            <Link href="/login">
              <a>Login</a>
            </Link>
          </small>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "loading..." : "Sign Up"}
          </button>
          {logError && <p className="error">{logError.message}</p>}
          {logSuccess && <p>Redirecting to profile...</p>}
        </Form>
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
