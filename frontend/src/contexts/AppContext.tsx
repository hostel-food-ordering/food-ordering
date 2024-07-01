import React, { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { validateAuthToken } from "../fetch/auth";
import Toast from "../components/Toast";

type AppContextType = {
  isLoggedIn: boolean;
  showToast: (
    message: ToastMessage["message"],
    type: ToastMessage["type"]
  ) => void;
};

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isSuccess } = useQuery<undefined>(
    "validateToken",
    validateAuthToken,
    {
      retry: false,
    }
  );

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isSuccess,
        showToast: (message, type) => setToast({ message, type }),
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContextType;
};
