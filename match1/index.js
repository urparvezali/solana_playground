import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();

console.log(kp.publicKey.toBase58());
// console.log(kp.secretKey);

let str = "";
for (let i = 0; i < kp.secretKey.length; i++) {
	str += String.fromCharCode(kp.secretKey[i]);
}
console.log(str);
