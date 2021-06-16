import React, { Dispatch, SetStateAction, useMemo, useState } from "react";

type User = {
  mail: string;
  id: number;
};

const UserContext = React.createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
}>(null);

function UserProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUserContext() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserContext };
