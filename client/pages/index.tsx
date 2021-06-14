import {useState} from "react";
import {Listbox, ListboxOption} from "@reach/listbox";
import Link from "next/link";
import Layout from "../components/layout";
import Button from "../components/Button";
import {create} from "../utils/rest/simulation"
import {getUserInfo} from "../utils/rest/auth";

const OPTIONS = ["SIM 1", "SIM 2", "SIM 3"];

export async function getServerSideProps(context) {
    const {user} = await getUserInfo(context.req.cookies?.token);

    if (user) {
        return {
            props: {user},
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
    const [value, setValue] = useState("SIM 1");

    const createSim = async () => {
        await create();
    }

    const renderAdminButton = () => {
        if (user.isAdmin) {
            return (
                <Link href="/admin">
                    <a>Admin</a>
                </Link>
            )
        }
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
                    {renderAdminButton()}
                </div>
            </Layout>
        </>
    );
}
