import {Listbox, ListboxOption} from "@reach/listbox";
import {useState} from "react";


const OPTIONS = ["EXAMPLE 1", "EXAMPLE 2", "EXAMPLE 3"];

export default function Home() {
  const [value, setValue] = useState("EXAMPLE 1");

  return (
    <>
      <div>
        <span id="sim-choice">Choose a simulation from example</span>
        <Listbox aria-labelledby="sim-choice" value={value} onChange={setValue}>
          {OPTIONS.map(opt =><ListboxOption key={opt} value={opt}>{opt}</ListboxOption>)}
        </Listbox>
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
