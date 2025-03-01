// @ts-ignore
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { Buffer } from "buffer";
// window.Buffer = Buffer;

export function Home() {
	const { connection } = useConnection();
	const { publicKey, connected, sendTransaction } = useWallet();
	const [mint, setMint] = useState("");
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
			setInformation("Wallet not connected!");
			return;
		}
		const mint_kp = web3.Keypair.generate();
		const transaction = new web3.Transaction();
		try {
			const rent = await token.getMinimumBalanceForRentExemptMint(connection);
			setInformation("Got rent");

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
			setInformation("added Transaction");
			const sigx = await sendTransaction(transaction, connection, {
				signers: [mint_kp],
			});

			setInformation(`Created Mint! Hash: ${sigx}`);
			setMint(mint_kp.publicKey.toBase58());
		} catch (e) {
			setInformation(`${e}`);
		}
	};

	const [tokenaddr, setTokenaddr] = useState("");
	const [tokenowner, setTokenowner] = useState("");
	const [ata, setAta] = useState("");
	const create_ata = async () => {
		if (!publicKey || !connected || !connection) {
			setInformation("Wallet not connected!!");
			return;
		}
		const tnx = new web3.Transaction();
		try {
			const ata_addr = await token.getAssociatedTokenAddress(
				new web3.PublicKey(tokenaddr),
				new web3.PublicKey(tokenowner),
			);
			setInformation(`Got ata: ${ata_addr.toBase58()}`);
			tnx.add(
				token.createAssociatedTokenAccountInstruction(
					publicKey,
					new web3.PublicKey(ata_addr),
					new web3.PublicKey(tokenowner),
					new web3.PublicKey(tokenaddr),
				)
			);
			setInformation(`Sending Transaction..`);
			const sigx = await sendTransaction(tnx, connection);
			setInformation(`Account created! Hash: ${sigx}`);
			setAta(ata_addr.toBase58());
		} catch (error) {
			setInformation(`${error}`);
		}

	};

	const [tomint, setTomint] = useState("");
	const [tokentomint, setTokentomint] = useState("");
	const [amount, setAmount] = useState("");
	const mintto = async () => {
		if (!publicKey || !connected || !connection) {
			setInformation("Wallet not connected!!!");
			return;
		}
		try {
			const tnx = new web3.Transaction();
			const ata = await token.getAssociatedTokenAddress(
				new web3.PublicKey(tokentomint),
				new web3.PublicKey(tomint),
			);
			setInformation(`Got the ata: ${ata.toBase58()}`);
			tnx.add(
				token.createAssociatedTokenAccountInstruction(
					publicKey,
					ata,
					new web3.PublicKey(tomint),
					new web3.PublicKey(tokentomint),
				)
			);
			try {
				const sigx = await sendTransaction(tnx, connection);
				setInformation(`ATA created. Hash: ${sigx}`);
			} catch (e) {
				setInformation(`Maybe ata already created: ${e}`);
			}
			const tnx2 = new web3.Transaction();
			tnx2.add(
				token.createMintToInstruction(
					new web3.PublicKey(tokentomint),
					ata,
					publicKey,
					Number.parseInt(amount),
				)
			);
			const sigx2 = await sendTransaction(tnx2, connection);
			setInformation(`Minted. Hash: ${sigx2}`);
		} catch (e) {
			setInformation(`${e}`);
		}
	}
	return (
		<div>
			<WalletMultiButton />
			<br /> <br />
			INFO: {information}
			<br /> <br />
			<button onClick={create_mint}>Create Mint</button>
			<br />
			Mint: {mint}
			<br /><br />
			Token: <input type="text" name="" id="" onChange={(e) => { setTokenaddr(e.target.value) }} value={tokenaddr} />
			<br />
			Owner: <input type="text" name="" id="" onChange={(e) => { setTokenowner(e.target.value) }} value={tokenowner} />
			<br />
			<button onClick={create_ata}>Create ATA</button>
			<br />
			ATA: {ata}
			<br /><br />
			Account to mint: <input type="text" name="" id="" onChange={(e) => setTomint(e.target.value)} value={tomint} />
			<br />
			Token to mint: <input type="text" name="" id="" onChange={e => setTokentomint(e.target.value)} />
			<br />
			Amount: <input type="text" name="" id="" onChange={e => setAmount(e.target.value)} />
			<br />
			<button onClick={mintto}>Click to mint</button>
		</div>
	);
}