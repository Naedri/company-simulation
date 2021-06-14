import Link from "next/link";
import styles from '../styles/Header.module.css';
import { GiFactory } from 'react-icons/gi';
import { forwardRef } from "react";
import { logout } from "../utils/rest/auth";

export default function Header({ user }) {
    // eslint-disable-next-line react/display-name
    const LogoutButton = forwardRef <any, any> (({ onClick, href }, ref) => {
        return (
            <a className={styles.menu__link} href={href} onClick={async () => {
                await logout();
            }} ref={ref}>
                Logout
            </a>
        );
    });
    return (
        <div className={styles.container}>
            <header className={`${styles.menu} ${styles.menu__border__bottom}`}>
                <div className={styles.menu__title}>
                    <div className={styles.menu__logo}>
                        <GiFactory/>
                    </div>
                    <span>Web Simulation</span>

                </div>
                {user && <div>
                    <p className={styles.menu__item__mail}>{user?.mail}</p>
                </div>}
                <ul className={styles.menu__navigation}>
                    <Link href="/dashboard">
                        <li className={styles.menu__item}><a className={styles.menu__link}>Dashboard</a></li>
                    </Link>
                    <Link href="/simulation/view">
                        <li className={styles.menu__item}>
                        <a className={styles.menu__link}>Simulation</a>
                        </li>
                    </Link>
                    <Link href="/login" passHref>
                        <li className={styles.menu__item}><LogoutButton/></li>
                    </Link>
                </ul>
            </header>
        </div>
    );
}
