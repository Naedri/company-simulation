import Link from "next/link";
import { logout } from "../utils/rest/auth";

export default function Home() {
  return (
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
    </ul>
  );
}
