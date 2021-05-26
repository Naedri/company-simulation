import React, { useMemo, useState } from "react";

const UserContext = React.createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // fetch with react query or useSWR
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
