import { Spacer } from "@geist-ui/react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "react-feather";
import Button from "../components/Button";
import Footer from "../components/Footer";
import homeStyles from "../styles/views/home.module.sass";
import styles from "../styles/views/404.module.sass";

const NotFound = () => (
  <>
    <div className={styles.NotFound}>
      <div
        className={homeStyles.Bubble}
        style={{
          top: "6em",
          right: "-2em",
          width: "16vw",
          height: "16vw",
          animationDelay: ".6s",
          background:
            "linear-gradient(50deg, rgba(255, 255, 255, .26) 0%, rgba(255, 255, 255, 0) 61.98%)",
        }}
      />
      <div className={styles.Content}>
        <h1>404</h1>
        <h2>Page not found</h2>
        <div className={styles.Btns}>
          <Link href="/">
            <a>
              Home
              <ArrowRight />
            </a>
          </Link>
          <Spacer y={1} />
          <Button onClick={() => window.open("https://docs.kyve.network")}>
            Docs
            <ExternalLink />
          </Button>
        </div>
      </div>
      <div className={homeStyles.Bubble} style={{ bottom: 0, left: "-8vw" }} />
    </div>
    <Footer />
  </>
);

export default NotFound;
