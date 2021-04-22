import { useRouter } from "next/router";
import { useState } from "react";
import { Page, Link, Spacer, Text, Divider, Grid } from "@geist-ui/react";
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
            background: "linear-gradient(130deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 75.52%)"
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
            background: "linear-gradient(-130deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 61.98%)"
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
            background: "linear-gradient(120deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 75.52%)"
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
            background: "linear-gradient(40deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 75.52%)"
          }}
        />
      </div>
      <Page>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
          }}
        >
          <Link
            href={`${router.asPath}about`}
            style={{ margin: 0 }}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <svg
              height="45"
              viewBox="0 0 1510 350"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66 350H-9.49949e-08L74.5 -2.38419e-05H140.5L110 143.5H122L235 -2.38419e-05H312V5.99999L179 172V181L263 347V350H190L117 206.5H96L66 350ZM740.152 5.99999L595.152 227H580.152L554.152 350H488.152L514.152 227H499.152L444.152 -2.38419e-05H514.152L552.152 167H561.152L668.152 -2.38419e-05H740.152V5.99999ZM844.305 -2.38419e-05H911.305L922.805 317H931.805L1066.3 -2.38419e-05H1135.3V5.99999L984.305 350H861.305L844.305 -2.38419e-05ZM1229.46 344L1302.46 -2.38419e-05H1509.96V63H1354.96L1337.96 143H1473.46V206H1324.46L1307.46 287H1454.96V350H1229.46V344Z"
                fill="#F5F5F5"
              />
            </svg>
          </Link>
          <Spacer y={0.5} />
          <Text h3 type="secondary" style={{ textTransform: "uppercase" }}>
            the unified archive for blockchains.
          </Text>
          <Spacer y={1} />
          <Divider>Partners</Divider>
          <Grid.Container gap={3} justify="center">
            {Partners.map((partner) => (
              <Grid key={partner.name} style={{ paddingBottom: 0 }}>
                <Link target="_blank" href={partner.link}>
                  <Logo name={partner.name} />
                </Link>
              </Grid>
            ))}
          </Grid.Container>
        </div>
        <div
          style={{
            position: "absolute",
            top: "95%",
            left: "50%",
            transform: "translateX(-50%) translateY(-95%)",
          }}
        >
          <Link target="_blank" href="mailto:team@kyve.network" underline>
            <Text type="secondary">team@kyve.network</Text>
          </Link>
        </div>
      </Page>
    </>
  );
};

export default Home;
