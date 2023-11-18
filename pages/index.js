import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const HomePage = () => {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [walletBalance, setWalletBalance] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ownerCheckResult, setOwnerCheckResult] = useState(undefined);
  const [contractAddressResult, setContractAddressResult] = useState(undefined);
  const [withdrawAmount, setWithdrawAmount] = useState(1);
  const [depositAmount, setDepositAmount] = useState(1);
  const [isOwnerResultVisible, setIsOwnerResultVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        setLoading(true);
        const atmBalance = (await atm.getBalance()).toNumber();
        setBalance(atmBalance);

        if (account) {
          const provider = new ethers.providers.Web3Provider(ethWallet);
          const wallet = provider.getSigner(account);
          const walletBalance = ethers.utils.formatEther(await wallet.getBalance());
          setWalletBalance(walletBalance);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        setLoading(true);
        let tx = await atm.deposit(depositAmount);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
        alert('Deposit failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        setLoading(true);
        let tx = await atm.withdraw(withdrawAmount);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
        alert('Withdrawal failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message) => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    } else {
      alert(message);
    }
  };

  const isOwner = async (address) => {
    const isOwnerResult = true;
    setOwnerCheckResult(`Owner: ${account}`);
    // Hide contract address result
    setContractAddressResult(null);
    // Toggle visibility of owner check result
    setIsOwnerResultVisible(!isOwnerResultVisible);
  };


  const getContractAddress = () => {
    const specificContractAddress = contractAddress;
    setContractAddressResult(specificContractAddress);
    // Hide owner check result when getting the contract address
    setOwnerCheckResult(null);
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metamask Bank!</h1></header>

      <div>
        {!account && (
          <button onClick={connectAccount}>
            Please connect your Metamask wallet
          </button>
        )}

        {account && !balance && (
          <>
            <p>Your Account: {account}</p>
            <button onClick={getBalance}>Get Balance</button>
          </>
        )}

        {balance !== undefined && (
          <>
           <p>Your Account: {account}</p>
            <p>ATM Balance: {balance} ETH</p>
            <p>Metamask Balance: {walletBalance} ETH</p>
            <label>Deposit:&nbsp;&nbsp;</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={deposit}>Deposit {depositAmount} ETH</button><br></br>

            <label>Withdraw: </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button onClick={withdraw}>Withdraw {withdrawAmount} ETH</button><br></br><br></br>

            <label>Check Ownership:&nbsp;&nbsp;&nbsp; </label>
      <button onClick={isOwner}>Check Owner</button>
      {ownerCheckResult && <p>{ownerCheckResult}</p>}<br></br>

      <label>Contract Address: &nbsp;&nbsp;&nbsp;</label>
      <button onClick={getContractAddress}>Get Address</button>
      {contractAddressResult && <p>Contract Address: {contractAddressResult}</p>}<br></br>

            {loading && <p>Loading...</p>}
          </>
        )}
      </div>

      <style jsx>{`
        .container {
          text-align: center;
          background-color: black;
          color: #088F8F;
          border-color:#088F8F;
          border-style: solid;
          border-width: 8px;
          padding: 20px; 
          font-family: 'Arial', sans-serif; 
          font-size: 16px; 
        }
      `}
      </style>
    </main>
  );
};

export default HomePage;
