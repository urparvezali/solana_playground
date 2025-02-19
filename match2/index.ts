import {
	clusterApiUrl,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	sendAndConfirmTransaction,
	SystemProgram,
	Transaction
} from "@solana/web3.js";

const receiver = Keypair.generate();


const sender = Keypair.generate();
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");


const signature1 = await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL);
const x = await connection.confirmTransaction(signature1, "confirmed");

let balance = await connection.getBalance(sender.publicKey);
let balance_in_sol = balance / LAMPORTS_PER_SOL;

console.log("Balance (lamports):", balance);
console.log("Balance (SOL):", balance_in_sol);


const transaction = new Transaction();
const send_instruction = SystemProgram.transfer({
	fromPubkey: sender.publicKey,
	toPubkey: receiver.publicKey,
	lamports: LAMPORTS_PER_SOL / 10,
});
transaction.add(send_instruction);

const signature2 = await sendAndConfirmTransaction(connection, transaction, [sender]);


balance = await connection.getBalance(sender.publicKey);
balance_in_sol = balance / LAMPORTS_PER_SOL;

console.log(signature2.toString());
console.log("Balance (lamports):", balance);
console.log("Balance (SOL):", balance_in_sol);

// OUTPUT:
// Balance(lamports): 1000000000
// Balance(SOL): 1
// 6649XotRWJunLZB9N67WJdzDxEYephfacELdE1j1YYBMo9oMv878386aUAwyCs9DzHuYtEmTMRR9aH5K5kjrNQeK
// Balance(lamports): 899995000
// Balance(SOL): 0.899995