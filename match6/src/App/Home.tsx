// @ts-ignore
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function Home() {
	const { connection } = useConnection();
	const { publicKey, connected, sendTransaction } = useWallet();
	const [mint, setMint] = useState<web3.PublicKey | null>(null);
	const [information, setInformation] = useState("Waiting for wallet connection...");

	useEffect(() => {
		if (connected) {
			setInformation("Wallet connected!");
		} else {
			setInformation("No wallet connected!");
		}
	}, [publicKey, connected]);

	const create_mint = async () => {
		if (!publicKey || !connection) {
			return;
		}
		const mint_kp = web3.Keypair.generate();
		const rent = await token.getMinimumBalanceForRentExemptMint(connection);
		const transaction = new web3.Transaction();

		transaction.add(
			web3.SystemProgram.createAccount({
				fromPubkey: publicKey,
				newAccountPubkey: mint_kp.publicKey,
				space: token.MINT_SIZE,
				lamports: rent,
				programId: token.TOKEN_PROGRAM_ID,
			}),
			token.createInitializeMintInstruction(
				mint_kp.publicKey,
				0,
				publicKey,
				publicKey,
				token.TOKEN_PROGRAM_ID,
			)
		);
		await sendTransaction(transaction, connection);
		setMint(mint_kp.publicKey);
	};

	return (
		<div>
			<WalletMultiButton />
			<button onClick={create_mint}>Create Mint</button>
			{mint && <p>{mint.toBase58()}</p>}
			<br />
			{information}
		</div>
	);
}