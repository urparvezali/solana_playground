import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";


const addrs = new PublicKey('we1Aj41BoHsybq1po6uEDnj2k1GjUUkWaUEa6Zs8etw');
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");


const signature = await connection.requestAirdrop(addrs, LAMPORTS_PER_SOL);
const x = await connection.confirmTransaction(signature, "confirmed");
console.log(x.value);



const balance = await connection.getBalance(addrs);
const balance_in_sol = balance / LAMPORTS_PER_SOL;

console.log("Balance (lamports):", balance);
console.log("Balance (SOL):", balance_in_sol);
