import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
	useWallet,
	useConnection,
} from "@solana/wallet-adapter-react";
import {
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

export const Home: NextPage = () => {
	const { connection } = useConnection();
	const { publicKey, connected } = useWallet();
	const [balance, setBalance] = useState(0);
	const [information, setInformation] = useState("Waiting for wallet connection...");


	useEffect(() => {
		if (connected) {
			setInformation("Wallet connected!");
			if (publicKey) {
				getAndSetBalance();
			}
		} else {
			setInformation("No wallet connected!");
		}
	}, [connected, publicKey]);

	const getAndSetBalance = async () => {
		if (!publicKey) {
			setInformation(`No wallet connected for checking balance! "${publicKey}"`);
			return;
		}

		try {
			setInformation("Fetching balance...");
			const balanceLamports = await connection.getBalance(publicKey);
			setBalance(balanceLamports / LAMPORTS_PER_SOL);
			setInformation(`Balance: ${balanceLamports / LAMPORTS_PER_SOL} SOL on ${publicKey}`);
		} catch (error) {
			setInformation(`Error fetching balance: ${error}`);
		}
	};

	const getFaucet = async () => {
		if (!publicKey) {
			setInformation(`No wallet connected for getting faucet! "${publicKey}"`);
			return;
		}

		try {
			setInformation("Requesting airdrop...");
			const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

			setInformation("Confirming airdrop...");
			await connection.confirmTransaction(signature, "confirmed");

			setInformation("Airdrop successful!");
			getAndSetBalance();
		} catch (error) {
			setInformation(`Airdrop failed: ${error}`);
		}
	};

	return (
		<div>
			<WalletMultiButton />
			<br /><br />
			<button onClick={getAndSetBalance}>
				Check Balance: {balance !== null ? `${balance} SOL` : "Loading..."}
			</button>
			<br /><br />
			<button onClick={getFaucet}>
				Get Faucet
			</button>
			<br />
			<p>{information}</p>
		</div>

	);
};
