// context/HomeContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserData, userService } from "../services/userService";

type HomeContextType = {
  data: UserData | null;
  user: User | null;
  fetchData: () => Promise<void>;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<UserData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      if (!currentUser) {
        setUser(null);
        setData(null);
        return;
      }
      setUser(currentUser);

      const accountResult = await userService.checkUserAccount(currentUser.id);
      setData(accountResult.data || null);
    } catch (err) {
      console.error("Failed to fetch home data", err);
    }
  }, []);

  return (
    <HomeContext.Provider value={{ user, data, fetchData }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome must be used within HomeProvider");
  return ctx;
};
