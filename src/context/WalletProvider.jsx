import { createContext, useState, useContext } from 'react';
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [wallet, setWallet] = useState(user?.wallet || null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
