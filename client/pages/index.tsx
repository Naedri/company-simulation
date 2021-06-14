import { useState } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import { getUserInfo, logout } from "../utils/rest/auth";

import Link from "next/link";
import Layout from "../components/layout";
import {create} from "../utils/rest/simulation"
const OPTIONS = ["SIM 1", "SIM 2", "SIM 3"];

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

export default function Home(user) {
  const [value, setValue] = useState("SIM 1");

  const createSim = async () => {
    await create();
  }

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
        <Link href="/simulation/view">
            <a>Simulation</a>
          </Link>
        </div>

      </Layout>
    </>
  );
}
