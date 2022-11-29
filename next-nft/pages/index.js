import Head from "next/head";
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Trirong"
/>;
// import {Navbar} from "./navbar/Navbar.js";
import styles from "../styles/Home.module.css";
import { providers, Contract, utils } from "ethers";
import Web3Modal from "web3modal";
import { useRef, useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

//-------------------------------------------------------------------------------------------------------------------------------

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  const [address, setAddress] = useState();
  const web3ModalRef = useRef();
  const [numTokensMinted, setNumTokensMinted] = useState(0);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [owner, setOwner] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minute, setMinute] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const publicMint = async () => {
    setLoading(true);
    try {
      const signer = await getProviderOrSigner();
      const txnContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const txn = await txnContract.mint({ value: utils.parseEther("0.01") });
      await txn.wait();

      console.log("minted in public");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const presaleMint = async () => {
    setLoading(true);
    try {
      const signer = await getProviderOrSigner();
      const txnContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const txn = await txnContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      await txn.wait();
      console.log("minted in presale");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const checkIfPresaleEnded = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const txnContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const presaleEndTime = await txnContract.presaleEnded();
      const currentTimeInSeconds = Date.now() / 1000; //seconds
      const hasPresaleEnded = presaleEndTime.lt(
        Math.floor(currentTimeInSeconds)
      );

      setPresaleEnded(hasPresaleEnded);
      console.log(hasPresaleEnded);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIFPresaleStarted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const txnContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const txn = await txnContract.presaleStarted();
      setPresaleStarted(txn);
      console.log(txn);
      return txn;
    } catch (error) {
      console.error(error);
    }
  };

  const startPresale = async () => {
    setLoading(true);
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const txn = await nftContract.startPresale();
      await txn.wait();
      setPresaleStarted(true);
      setLoading(false);

      let presaleTime = 20;
      const countDown = setInterval(() => {
        const minute = Math.floor(presaleTime / 60);
        let seconds = presaleTime % 60;
        presaleTime--;
        setMinute(minute);
        setSeconds(seconds);

        console.log(minute, seconds);

        if (presaleTime <= 0) {
          clearInterval(countDown);
          console.log("base HIt");
        }
      }, 1000);
      return minute, seconds;
    } catch (error) {
      console.log(error);
    }
  };

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const txnContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const owner = await txnContract.owner();
      const user = await signer.getAddress();
      console.log(owner);
      console.log(user);
      if (owner.toLowerCase() == user.toLowerCase()) {
        setOwner(true);
        console.log("owner set to true");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNumMintedTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const txnContract = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const numTokenIds = await txnContract.tokenIds();
      setNumTokensMinted(numTokenIds.toString());
      console.log(Math.floor(numTokenIds), "token");
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("working with goerli network only");
    }

    if ((needSigner = true)) {
      const signer = web3Provider.getSigner();
      const addressA = await signer.getAddress();

      setAddress(addressA);
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: [],
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  });

  const onPageLoad = async () => {
    // await connectWallet();
    await getOwner();

    const presaleStarted = await checkIFPresaleStarted();
    if (presaleStarted) {
      await checkIfPresaleEnded();
    }
    setInterval(async () => {
      const presaleStarted = await checkIFPresaleStarted();
      if (presaleStarted) {
        await checkIfPresaleEnded();
      }
    }, 5 * 1000);

    await getNumMintedTokens();
    setInterval(async () => {
      await getNumMintedTokens();
    }, 5 * 1000);
  };

  const renderBody = () => {
    if (loading) {
      return <h4 className={styles.nexon}>Loading...</h4>;
    }

    if (owner && !presaleStarted) {
      return (
        <button onClick={startPresale} className={styles.nexon}>
          start presale
        </button>
      );
    }
    if (!presaleStarted) {
      return <h4> presale not started yet, come back later!</h4>;
    }
    if (presaleStarted && !presaleEnded) {
      return (
        <>
          <h4 className={styles.description}>
            Presale has started! If your address is whitelisted, you can mint a
            CryptoDev!
          </h4>
          <button onClick={presaleMint} className={styles.nexon}>
            presale Mint
          </button>
        </>
      );
    }
    if (presaleEnded) {
      return (
        <>
          <h4 className={styles.description}>
            Presale has ended. You can mint a CryptoDev in public sale.
            <button onClick={publicMint} className={styles.nexon}>
              {" "}
              Public Mint
            </button>
          </h4>
        </>
      );
    }
  };
  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>

      <div className={styles.main}>
        <div className={styles.nav}>
          {owner ? (
            <button onClick={startPresale} className={styles.nexon}>
              start presale
            </button>
          ) : (
            ""
          )}

          {walletConnected ? (
            <h4 className={styles.nh4}>
              Connected with : &nbsp; &nbsp; {address.slice(0, 6)}...
              {address.slice(38)}
            </h4>
          ) : (
            <button onClick={connectWallet} className={styles.nexon2}>
              Connect wallet
            </button>
          )}
        </div>

        <h1 className={styles.title}>Welcome to CryptoDevs NFT</h1>
        <h1 className={styles.count}>
          0{minute} : {seconds < 10 ? "0" : ""}
          {seconds <= 1 ? "0" : seconds}
        </h1>

        <div className={styles.mainContainer}>
          <div className={styles.box1}>
            <div className={styles.description}>
              CryptoDevs NFT is a collection for developers in web3
            </div>
            <div className={styles.description2}>
              {numTokensMinted}/20 &nbsp; have been minted already!
            </div>
            {renderBody()}
          </div>
          <div className={styles.box2}>
            <img className={styles.image} src="/ms-shr.png" />
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
