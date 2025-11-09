import React, { createContext, useState } from "react";

export const BoardData = createContext();
const BoardContext = ({ children }) => {
  const [board, setBoard] = useState({});

  return (
    <BoardData.Provider value={{ board, setBoard }}>
      {children}
    </BoardData.Provider>
  );
};

export default BoardContext;
