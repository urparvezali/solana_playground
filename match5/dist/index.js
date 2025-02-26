"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const fs_1 = require("fs");
const os_1 = require("os");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
        const payer_kp = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse((0, fs_1.readFileSync)((0, os_1.homedir)() + "/.config/solana/id.json").toString())));
        // const mint_kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync("mSwxyCpeNvUTbMcQ3fcsF9oW2r7gBoSTP72Lv2TQEYV.json").toString())));
        // const token_account_kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync("afgz6hJbitoTy5Pp57x2Z8g66j8EQZwEfk7z6jxQs6x.json").toString())));
        const mint = yield (0, spl_token_1.createMint)(connection, payer_kp, payer_kp.publicKey, payer_kp.publicKey, 0);
        console.log(mint.toBase58());
        const token_account = yield (0, spl_token_1.createAccount)(connection, payer_kp, new web3_js_1.PublicKey("AjapzeYrL7NFaKYCmmv5nuV815MoCwi2MD6YeesuvVUd"), payer_kp.publicKey);
        console.log(token_account.toBase58());
    });
}
main();
