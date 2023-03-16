"use client";

import styles from "./page.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useState, useEffect, useRef } from "react";
import LW3Punks from "../contract/LW3PunksNFT";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3modalRef = useRef();
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  const handleConnect = async () => {
    await connectWallet();
    await getTokenIdsMinted();
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const instance = await web3modalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(instance);

      const { chainId } = await provider.getNetwork();
      if (chainId !== 80001) {
        window.alert("Change the network to Mumbai");
        throw new Error("Change network to Mumbai");
      }

      const signer = provider.getSigner();
      setWalletConnected(true);
      setLoading(false);
      return signer;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      const signer = await connectWallet();
      const Contract = await getContractInstance(signer);
      const totalMinted = await Contract.tokenIds();
      setTokenIdsMinted(totalMinted.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getContractInstance = async (signer) => {
    try {
      const LW3PunksContract = new ethers.Contract(
        LW3Punks.address,
        LW3Punks.abi,
        signer
      );
      return LW3PunksContract;
    } catch (error) {
      console.log(error.message);
    }
  };

  const mintNFT = async () => {
    try {
      const signer = await connectWallet();
      const NFTContract = await getContractInstance(signer);
      const mintTx = await NFTContract.mint({
        value: ethers.utils.parseEther("0.001"),
      });
      setLoading(true);
      await mintTx.wait();
      await getTokenIdsMinted();
      setLoading(false);
      window.alert("You successfully minted a LW3Punk!");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    web3modalRef.current = new Web3Modal({
      providerOptions: {},
      network: "mumbai",
      disableInjectedProvider: false,
    });

    setInterval(async function () {
      await getTokenIdsMinted();
    }, 60 * 1000);
  });

  return (
    <main>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            It&#39;s an NFT collection for LearnWeb3 students.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 have been minted
          </div>
          {!walletConnected ? (
            <button className={styles.button} onClick={handleConnect}>
              {loading ? (
                <span>Connecting...</span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
          ) : (
            <button className={styles.button} onClick={mintNFT}>
              {" "}
              {loading ? <span>Minting...</span> : <span>Public Mint 🚀</span>}
            </button>
          )}
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by LW3Punks</footer>
    </main>
  );
}
