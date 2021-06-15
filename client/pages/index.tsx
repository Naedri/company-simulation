import { useEffect, useState } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import { create } from "../utils/rest/simulation";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { getUserInfo } from "../utils/rest/auth";
import Link from "next/link";
import Layout from "../components/layout";
import Button from "../components/Button";

import styles from '../styles/Index.module.css';

const OPTIONS = ["sim1", "sim2", "sim3"];

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

export default function Home({ user }) {
  const [value, setValue] = useState("");
  const { addToast } = useToasts();
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes("error")) {
      addToast("Create a simulation first.", {
        appearance: "error",
        autoDismiss: true,
      });
      router.replace("/");
    }
  }, [router, addToast]);

  const createSim = async () => {
    await create(value).catch((e) =>
      addToast("Simulation already exists", {
        appearance: "error",
        autoDismiss: true,
      })
    );
    await router.push("/simulation/view");
  };
  const renderAdminButton = () => {
    if (user.isAdmin) {
      return (
          <Link href="/admin">
            <a>Admin</a>
          </Link>
      );
    }
  };

  return (
    <>
      <Layout user={user}>
        <div className={styles.container} id="index">
            <h2 className={styles.index__header}>Create your simulation</h2>

            <div id="index-simulation" className={styles.index}>
            <div id="index-choice" className = {styles.index__step}>
              <span className={styles.index__title}>1. Choose a template</span>
              <Listbox aria-labelledby="sim-choice" value={value} onChange={setValue} style={{ color: "rgb(0, 74, 119)" }} >
                {OPTIONS.map((opt) => (
                      <ListboxOption key={opt} value={opt}>
                        {opt}
                      </ListboxOption>
                  ))}
              </Listbox>
            </div>

            <div id="index-start" className = {styles.index__step}>
              <span className={styles.index__title}>2. Confirm your choice</span>
              <Button onClick={() => createSim()} disabled={value === ""}>Start</Button>
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
}
