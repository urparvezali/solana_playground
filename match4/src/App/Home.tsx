import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function Home() {
	const { publicKey, sendTransaction } = useWallet();
	const { connection } = useConnection();

	const [information, setInformation] = useState("No wallet is connected!");
	const [balance, setBalance] = useState(0.0);
	const [receiver, setReceiver] = useState("");
	const [quantity, setQuantity] = useState("");
	const balance_change = async () => {
		if (!publicKey) return;
		setBalance(await connection.getBalance(publicKey));
	}
	const sendSol = async () => {
		if (!publicKey || !receiver) return;
		const transaction = new Transaction();
		const instruction = SystemProgram.transfer({
			fromPubkey: publicKey,
			toPubkey: new PublicKey(receiver),
			lamports: LAMPORTS_PER_SOL * Number.parseFloat(quantity),
		});
		transaction.add(instruction);
		setInformation("Sending Sol...");
		try {
			const signature = await sendTransaction(transaction, connection);
			console.log(signature);
		} catch (error) {
			setInformation(`${error}`);
			return;
		}
		setInformation("Sol sent!!");
		balance_change();
	}
	useEffect(() => {
		balance_change();
		setInformation("Wallet Connected!!");
	}, [publicKey]);

	return <div>
		<WalletMultiButton />
		<br /><br />
		{publicKey && `Balance: ${balance / LAMPORTS_PER_SOL} Sol`}
		<br /><br />
		<label htmlFor="receiver"> Receiver Address: </label>
		<input type="text" name="" id="" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
		<br /><br />
		<label htmlFor="quantity">Quantity to send: </label>
		<input type="number" name="" id="" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
		<br /><br />
		<button disabled={publicKey && receiver && quantity ? false : true} onClick={sendSol}>Send</button>
		<br /><br />
		{information}
	</div>
}