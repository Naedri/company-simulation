
import { AiFillHeart } from 'react-icons/ai';
import styles from '../styles/Footer.module.css';

export default function Form() {
    return (
        <div className={styles.footer__container}>
            <div className={styles.footer__element}>
            Made with  <AiFillHeart />  by students from IMT Nantes - FIL promotion
            </div>
        </div>
    );
}
