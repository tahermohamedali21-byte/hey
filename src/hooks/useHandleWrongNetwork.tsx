import { useConnections, useSwitchChain } from "wagmi";
import { CHAIN } from "@/data/constants";

interface HandleWrongNetworkParams {
  chainId?: number;
}

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections();
  const { switchChainAsync } = useSwitchChain();
  const isConnected = () => activeConnection[0] !== undefined;

  const handleWrongNetwork = async (params?: HandleWrongNetworkParams) => {
    const chainId = params?.chainId ?? CHAIN.id;

    const isWrongNetwork = () => activeConnection[0]?.chainId !== chainId;

    if (!isConnected()) {
      throw new Error("No active wallet connection found.");
    }

    if (isWrongNetwork()) {
      await switchChainAsync({ chainId });
    }
  };

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
