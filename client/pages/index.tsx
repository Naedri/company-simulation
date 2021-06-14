import { useState } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import { getUserInfo, logout } from "../utils/rest/auth";

import Link from "next/link";
import Layout from "../components/layout";

const OPTIONS = ["EXAMPLE 1", "EXAMPLE 2", "EXAMPLE 3"];

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
  const [value, setValue] = useState("EXAMPLE 1");

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
          <Link href="/simulation/view">
            <a>Simulation</a>
          </Link>
        </div>

      </Layout>
    </>
  );
}
