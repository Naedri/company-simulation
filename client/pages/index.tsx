import {Listbox, ListboxOption} from "@reach/listbox";
import {useEffect, useState} from "react";
import Link from "next/link";
import Button from "../components/Button";
import {create} from "../utils/rest/simulation"
import {useRouter} from "next/router";
import {useToasts} from "react-toast-notifications";

const OPTIONS = ["sim1", "sim2", "sim3"];

export default function Home() {
    const [value, setValue] = useState(OPTIONS[0]);
    const {addToast} = useToasts();
    const router = useRouter();

    useEffect(() => {
        if (router.asPath.includes("error")) {
            addToast("Create a simulation first.", {
                appearance: "error",
                autoDismiss: true,
            });
            router.replace("/");
        }
    }, [router, addToast])

    const createSim = async () => {
        await create(value).catch(e => addToast("Simulation already exists", {
            appearance: "error",
            autoDismiss: true,
        }));
        await router.push("/simulation/view");
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
