import { Listbox, ListboxOption } from "@reach/listbox";
import { useState } from "react";
import Link from "next/link";
import Button from "../components/Button";
import {create} from "../utils/rest/simulation"
const OPTIONS = ["SIM 1", "SIM 2", "SIM 3"];

export default function Home() {
  const [value, setValue] = useState("SIM 1");

  const createSim = async () => {
    await create();
  }

  return (
    <>
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
      {/*
  <NavBar />
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
  </ul> */}
    </>
  );
}
