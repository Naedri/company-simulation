import Router from "next/router";
import { useEffect } from "react";
import { useUserContext } from "../modules/auth/auth-context";

const useUser = ({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string;
  redirectIfFound?: boolean;
}) => {
  const { user, setUser } = useUserContext();

  useEffect(() => {
    if (!redirectTo) return;
    if (
      (redirectTo && !redirectIfFound && !user) ||
      (redirectIfFound && user)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, setUser };
};

export default useUser;
