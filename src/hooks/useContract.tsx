import {arweave} from "../extensions";
import {useEffect, useState} from "react";


const useContract = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(null);
  const [height, setHeight] = useState(null);

  const fetchData = async () => {
    const res = await fetch("https://cache.kyve.network");
    const state = await res.json();

    setState(state);
    setHeight((await arweave.network.getInfo()).height);
  };

  useEffect(() => {
    (async () => {
      await fetchData();
      setLoading(false);

      setInterval(async () => {
        await fetchData();
      }, 60000);
    })();
  }, []);

  return {loading, state, height};
};

export default useContract;
