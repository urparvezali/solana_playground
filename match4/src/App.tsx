import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";
import { Home } from "./App/Home";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";

export function App() {
	const endpoint = clusterApiUrl("devnet");
	const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

	return <ConnectionProvider endpoint={endpoint}>
		<WalletProvider wallets={wallets} autoConnect>
			<WalletModalProvider>
				<Home />
			</WalletModalProvider>
		</WalletProvider>
	</ConnectionProvider>
}

