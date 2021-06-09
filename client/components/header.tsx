import { useState, ReactComponentElement } from "react";
import Link from "next/link";
import Error from "next/error";
import { useRouter } from "next/router";
import { getUserInfo, register } from "../utils/rest/auth";
import styles from '../styles/Header.module.css';
import { GiFactory } from 'react-icons/gi';

// import { ReactComponentElement as logoIMT } from '../utils/icons/IMT_LOGO.svg';

export default function Form() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logError, setError] = useState<Error | null>(null);
    const [logSuccess, setLogSuccess] = useState(false);



/*
    <Link href="/dashboard"><li className={`${styles.menu__item} ${this.props.dashboardOpen ? styles.menu__link__active : ''}`}>Dashboard</a></li></Link>
    <Link href="/login"><li className={`${styles.menu__item} ${this.props.loginOpen ? styles.menu__link__active : ''}`}>Login</a></li></Link>
    <Link href="/signin"><li className={`${styles.menu__item} ${this.props.signinOpen ? styles.menu__link__active : ''}`}>Signin</a></li></Link>
*/

    return (
        <div className={styles.container}>
            <header className={`${styles.menu} ${styles.menu__border__bottom}`}>
                <div className={styles.menu__title}>
                    <div className={styles.menu__logo}>
                        <GiFactory />
                    </div>
                    <span>Web Simulation</span>

                </div>
                <ul className={styles.menu__navigation}>
                    <Link href="/dashboard"><li className={styles.menu__item}><a className={styles.menu__link}>Dashboard</a></li></Link>
                    <Link href="/login"><li className={styles.menu__item}><a className={styles.menu__link}>Logout</a></li></Link>
                </ul>
            </header>
        </div>
    );
}
