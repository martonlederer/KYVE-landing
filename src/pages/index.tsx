import { useRouter } from "next/router";
import { useState } from "react";
import { Spacer } from "@geist-ui/react";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Nav from "../components/Nav";
import styles from "../styles/views/home.module.sass";
import {
  ArrowRight,
  GitHub,
  Mail,
  MessageSquare,
  Twitter,
} from "react-feather";

const Partners = [
  { name: "Arweave", link: "https://www.arweave.org" },
  { name: "Polkadot", link: "https://polkadot.network" },
  { name: "TheGraph", link: "https://thegraph.com" },
  { name: "Solana", link: "https://solana.com" },
  { name: "Cosmos", link: "https://cosmos.network" },
  { name: "Avalanche", link: "https://www.avalabs.org" },
  { name: "Skale", link: "https://skale.network" },
];

const Home = () => {
  const router = useRouter();
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <>
      <div className={styles.Landing}>
        <Nav />
        <div
          className={styles.Bubble}
          style={{
            transform: "rotate(-141deg)",
            top: "6em",
            right: "-2em",
            width: "16vw",
            height: "16vw",
            animationDelay: ".6s"
          }}
        />
        <div className={styles.LandingContent}>
          <h1>The unified archive for blockchains.</h1>
          <div className={styles.Socials}>
            <a
              href="https://twitter.com/kyvenetwork"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </a>
            <a
              href="https://github.com/KYVENetwork"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </a>
            <a
              href="https://discord.gg/qbAeuCDa6A"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare />
            </a>
            <a
              href="mailto:team@kyve.network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail />
            </a>
          </div>
        </div>
        <div
          className={styles.Bubble}
          style={{ transform: "rotate(60deg)", bottom: 0, left: "-8vw" }}
        />
      </div>
      <div className={styles.Section}>
        <div className={styles.SectionContent}>
          <h2>What is KYVE?</h2>
          <h1>Archiving the web on Arweave.</h1>
          <p>
            <span>$KYVE</span> is an initiative to store any data stream, with built-in
            validation. By leveraging the{" "}
            <a
              href="https://arweave.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arweave
            </a>{" "}
            blockchain, we can permanently and immutably store this data.
          </p>
          <Button>
            What we archive
            <ArrowRight />
          </Button>
        </div>
        <div
          className={styles.Bubble}
          style={{
            transform: "translateY(-50%)",
            width: "60vh",
            height: "60vh",
            right: "-20vh",
            top: "50%",
            background: "linear-gradient(130deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 75.52%)",
            animationDelay: ".3s"
          }}
        />
      </div>
      <div className={styles.Section + " " + styles.SmallSection}>
        <div
          className={styles.Bubble}
          style={{
            transform: "translateY(-50%)",
            width: "47vh",
            height: "47vh",
            left: "-12vh",
            top: "50%",
            background: "linear-gradient(-130deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 61.98%)",
            animationDelay: ".22s"
          }}
        />
        <div className={styles.SectionContent + " " + styles.SectionLeft}>
          <h2>The KYVE network</h2>
          <h1>Decentralised archivers and validators.</h1>
          <p>
            The network is powered by decentralised archivers and validators. These nodes reside in pools, each pool focusing on archiving a specific data stream. Pools are funded by <span>$KYVE</span> tokens, and anyone can fund these storage initiatives by depositing tokens.
          </p>
        </div>
      </div>
      <div className={styles.Section}>
        <div className={styles.SectionContent}>
          <h2>DAO governance</h2>
          <h1>Community organized decisions.</h1>
          <p>
            A designated archiver is appointed by a DAO (Decentralized Autonomous Organisation) for each pool. Nodes are incentivised by a unique staking system, which involves them locking their <span>$KYVE</span> tokens while being active in the pool.
            <Spacer y={.3} />
            Validators will "get together" and vote on whether the designated archiver is properly doing it's job. If the validators come to a consensus that the archiver is no longer acting honestly or reliably, a new archiver will be decided upon in the DAO. Validators can seemlessly transition into an archiver if need be.
          </p>
        </div>
        <div
          className={styles.Bubble}
          style={{
            width: "18vh",
            height: "18vh",
            right: "4vw",
            top: "20%",
            background: "linear-gradient(120deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 75.52%)",
            animationDelay: ".87s"
          }}
        />
        <div
          className={styles.Bubble}
          style={{
            transform: "translateY(-50%)",
            width: "22vh",
            height: "22vh",
            right: "18%",
            top: "50%",
            background: "linear-gradient(40deg, rgba(255, 255, 255, 0.4) 17.23%, rgba(255, 255, 255, 0.1) 72.16%)"
          }}
        />
        <div
          className={styles.Bubble}
          style={{
            width: "14.5vh",
            height: "14.5vh",
            right: "2vw",
            top: "60%",
            background: "linear-gradient(40deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 75.52%)",
            animationDelay: ".24s"
          }}
        />
      </div>
      <div className={styles.Section + " " + styles.SmallSection + " " + styles.PartnerSection}>
        <div className={styles.SectionContent + " " + styles.SectionTop}>
          <h2>Partners</h2>
          <h1>Our users are our<br />backers.</h1>
          <Spacer y={2} />
          <div className={styles.Partners}>
            {Partners.map((partner) => (
                <a className={styles.Partner} href={partner.link} key={partner.name} target="_blank" rel="noopener noreferer">
                  <Logo name={partner.name} />
                </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
