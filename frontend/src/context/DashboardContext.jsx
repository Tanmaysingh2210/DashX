import { createContext, useState } from "react";
import api from "../api/axios";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    const res = await api.get("/dashboard/summary");
    setData(res.data);
    setLoading(false);
  };

  return (
    <DashboardContext.Provider value={{ data, loading, fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};
