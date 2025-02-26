import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createAccount, createAssociatedTokenAccount, createMint, getAccount, getAssociatedTokenAddress, getAssociatedTokenAddressSync, getMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import { readFileSync } from "fs";
import { homedir } from "os";

async function main() {
	const connection = new Connection(clusterApiUrl("devnet"));

	const payer_kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(homedir() + "/.config/solana/id.json").toString())));
	const mint_kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync("mdLdJAJpCoL1wDioHyXJvGBgzf6NF9cCsSAVE3Q9oS9.json").toString())));

	const mint = await createMint(
		connection,
		payer_kp,
		payer_kp.publicKey,
		payer_kp.publicKey,
		0,
		mint_kp,
	).catch(async () => {
		const mint = await getMint(
			connection,
			mint_kp.publicKey,
		);
		return mint.address;
	});
	console.log(mint.toBase58());

	const token_account = await getOrCreateAssociatedTokenAccount(
		connection,
		payer_kp,
		mint_kp.publicKey,
		payer_kp.publicKey,
	);
	console.log(token_account.address.toBase58());

	const signature = await mintTo(
		connection,
		payer_kp,
		mint_kp.publicKey,
		token_account.address,
		payer_kp,
		0,
	)
	
	const res = await connection.getTokenAccountBalance(token_account.address);
	console.log(res.value);
	
	const recepient = new PublicKey("5Yor45774CKiiVUuL7J8cqCZ34fRhJAoE3ka3qhorrkf");
	const recepient_ata = await getOrCreateAssociatedTokenAccount(
		connection,
		payer_kp,
		mint_kp.publicKey,
		recepient,
	);
	const transfer_signature = await transfer(
		connection,
		payer_kp,
		token_account.address,
		recepient_ata.address,
		payer_kp,
		1,
	);
	const res2 = await connection.getTokenAccountBalance(recepient_ata.address);
	console.log(res2.value);
}
main()