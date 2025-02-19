import { NextPage } from "next";
import { Home } from "./app/Home";
import { useMemo } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import {
	WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
// import "@solana/wallet-adapter-react-ui/styles.css";

export const App: NextPage = () => {
	const endpoint = clusterApiUrl("devnet");
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()],
		[]
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					<Home />
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};
