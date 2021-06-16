import Link from "next/link";
import { AiFillHeart } from 'react-icons/ai';
import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <div className={styles.footer__container}>
            <Link href="https://github.com/Naedri/company-simulation/">
                <div className={styles.footer__element}>
                    Made with  <AiFillHeart />  by students from IMT Nantes - FIL promotion
                </div>
            </Link>
        </div>
    );
}
