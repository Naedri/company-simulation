import { useState } from "react";
import Link from "next/link";
import Error from "next/error";
import { useRouter } from "next/router";
import { getUserInfo, register } from "../utils/rest/auth";
import { FaKissWinkHeart } from 'react-icons/fa';

import styles from '../styles/Footer.module.css';

export default function Form() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logError, setError] = useState<Error | null>(null);
    const [logSuccess, setLogSuccess] = useState(false);

    return (
        <div className={"footer"}>
            <div className={styles.draft}></div>
            Made with <FaKissWinkHeart /> by IMT Nantes - FIL
        </div>
    );
}
