import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();

console.log(kp.publicKey.toBase58());
console.log(kp.secretKey);


