import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { validateAuthToken } from "../fetch/auth";
import { userCart } from "../fetch/user";

type AppContextType = {
  isLoggedIn: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isSuccess } = useQuery("validateToken", validateAuthToken, {
    retry: false,
  });

  useQuery("userCart", userCart, { retry: false, enabled: isSuccess });

  return (
    <AppContext.Provider value={{ isLoggedIn: isSuccess }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContextType;
};
