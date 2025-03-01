// @ts-ignore
import "./App.css";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { Home } from "./App/Home";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export function App() {
	const endpoint = clusterApiUrl("devnet");
	const wallets = useMemo(() => [
		new PhantomWalletAdapter(),
		new SolflareWalletAdapter(),
	], []);

	return <ConnectionProvider endpoint={endpoint}>
		<WalletProvider wallets={wallets} autoConnect>
			<WalletModalProvider>
				<Home />
			</WalletModalProvider>
		</WalletProvider>
	</ConnectionProvider>
}

