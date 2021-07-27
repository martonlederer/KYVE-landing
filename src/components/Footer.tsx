import { ExternalLink } from "react-feather";
import Link from "next/link";
import styles from "../styles/components/Footer.module.sass";

const Footer = () => (
  <div className={styles.Footer}>
    <svg
      height="45"
      viewBox="0 0 1510 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.Logo}
    >
      <path
        d="M66 350H-9.49949e-08L74.5 -2.38419e-05H140.5L110 143.5H122L235 -2.38419e-05H312V5.99999L179 172V181L263 347V350H190L117 206.5H96L66 350ZM740.152 5.99999L595.152 227H580.152L554.152 350H488.152L514.152 227H499.152L444.152 -2.38419e-05H514.152L552.152 167H561.152L668.152 -2.38419e-05H740.152V5.99999ZM844.305 -2.38419e-05H911.305L922.805 317H931.805L1066.3 -2.38419e-05H1135.3V5.99999L984.305 350H861.305L844.305 -2.38419e-05ZM1229.46 344L1302.46 -2.38419e-05H1509.96V63H1354.96L1337.96 143H1473.46V206H1324.46L1307.46 287H1454.96V350H1229.46V344Z"
        fill="#F5F5F5"
      />
    </svg>
    <div className={styles.Links}>
      <div className={styles.Column}>
        <h2>About</h2>
        <Link href="/">Home</Link>
        <a href={`/litepaper.pdf`} target="_blank" rel="noopener noreferrer">
          Litepaper
        </a>
      </div>
      <div className={styles.Column}>
        <h2>Explore</h2>
        <Link href="/faucet">Faucet</Link>
        <Link href="/gov/accounts">Accounts</Link>
        <Link href="/gov/pools">Pools</Link>
      </div>
      <div className={styles.Column}>
        <h2>Community</h2>
        <a
          href="https://twitter.com/kyvenetwork"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter <ExternalLink />
        </a>
        <a
          href="https://blog.kyve.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog <ExternalLink />
        </a>
        <a
          href="https://discord.gg/E73KZwaa4S"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord <ExternalLink />
        </a>
        <a
          href="https://t.me/kyvenet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram <ExternalLink />
        </a>
        <a
          href="mailto:team@kyve.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact <ExternalLink />
        </a>
      </div>
      <div className={styles.Column}>
        <h2>Tech</h2>
        <a
          href="https://docs.kyve.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation <ExternalLink />
        </a>
        <a href="https://arweave.org" target="_blank" rel="noopener noreferrer">
          Arweave <ExternalLink />
        </a>
        <a
          href="https://github.com/KYVENetwork/kyve"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ExternalLink />
        </a>
      </div>
    </div>
    <div className={styles.Copyright}>
      Copyright © {new Date().getFullYear()} KYVE Network. All right reserved.
    </div>
  </div>
);

export default Footer;
