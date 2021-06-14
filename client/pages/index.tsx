import { useEffect, useState } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import { getUserInfo, logout } from "../utils/rest/auth";
import Link from "next/link";
import Layout from "../components/layout";
import { create } from "../utils/rest/simulation";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import Button from "../components/Button"
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

export default function Home({user}) {
  const [value, setValue] = useState(OPTIONS[0]);
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

  return (
    <>
      <Layout user={user}>

        <div>
        <span id="sim-choice">Choose a simulation from example</span>
        <Listbox aria-labelledby="sim-choice" value={value} onChange={setValue}>
          {OPTIONS.map((opt) => (
            <ListboxOption key={opt} value={opt}>
              {opt}
            </ListboxOption>
          ))}
        </Listbox>
        <Button onClick={() => createSim()}>Create sim</Button>
      </div>

      </Layout>
    </>
  );
}
