import { useMemo, useState } from "react";
import Cookies from "js-cookie";

export const METAMASK_INFO_KEYS = {
  ADDRESS: "METAMASK_ACCOUNT_ADDRESS",
  SIGNITURE: "METAMASK_ACCOUNT_SIGNITURE",
};
declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const metamaskAddress = useMemo(() => {
    if (!loading) {
      return Cookies.get(METAMASK_INFO_KEYS.ADDRESS);
    }
  }, [loading]);

  const handleClick = async () => {
    setLoading(true);
    if (metamaskAddress) {
      Cookies.remove(METAMASK_INFO_KEYS.ADDRESS);
      Cookies.remove(METAMASK_INFO_KEYS.SIGNITURE);
      alert("logged out!");
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      await window.ethereum.enable();
      const message = "Hello from Ethereum Stack Exchange!";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, accounts[0]],
      });
      Cookies.set(METAMASK_INFO_KEYS.SIGNITURE, accounts[0]);
      Cookies.set(METAMASK_INFO_KEYS.ADDRESS, signature);
      setLoading(false);
    } else {
      alert("No Metamask Wallet Detected!");
      setLoading(false);
    }
  };
  return (
    <div className="App">
      <button onClick={handleClick}>
        {metamaskAddress ? "Connected!" : "Not Connected!"}
      </button>
      {metamaskAddress && (
        <div className="info-container">
          <h5>Wallet Address:</h5>
          <p>{metamaskAddress}</p>
        </div>
      )}
    </div>
  );
}

export default App;
