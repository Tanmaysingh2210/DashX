import { createContext, useState } from "react";

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [filter, setFilter] = useState("ALL");

  return (
    <CalendarContext.Provider value={{ filter, setFilter }}>
      {children}
    </CalendarContext.Provider>
  );
};
