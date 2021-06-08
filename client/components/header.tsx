import { useState } from "react";
import Link from "next/link";
import Error from "next/error";
import { useRouter } from "next/router";
import { getUserInfo, register } from "../utils/rest/auth";

export default function Form() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logError, setError] = useState<Error | null>(null);
    const [logSuccess, setLogSuccess] = useState(false);

    const headerStyle = {
        backgroundColor: "blue",
        color: "white",
        width: "100%",
        height: "50px"
    };

    return (
        <div className={"Header"} style={headerStyle}>
            HEADER
        </div>
    );
}
