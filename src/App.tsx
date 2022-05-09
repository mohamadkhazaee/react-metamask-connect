import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import { METAMASK_INFO_KEYS } from "./consts";

function App() {
  const [loading, setLoading] = useState(false);
  const { ADDRESS, SIGNITURE } = METAMASK_INFO_KEYS;
  const metamaskAddress = useMemo(() => {
    if (!loading) {
      return Cookies.get(ADDRESS);
    }
  }, [loading, ADDRESS]);

  const handleClick = async () => {
    setLoading(true);
    if (metamaskAddress) {
      Cookies.remove(ADDRESS);
      Cookies.remove(SIGNITURE);
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
      Cookies.set(SIGNITURE, accounts[0]);
      Cookies.set(ADDRESS, signature);
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
