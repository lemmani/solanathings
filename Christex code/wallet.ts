import { Keypair, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import * as fs from 'fs';
import bs58 from 'bs58';

// STEP 1 - Connect to Solana Network
const endpoint = 'https://frosty-cosmopolitan-bush.solana-devnet.quiknode.pro/2b294e5c5f54a3cf3ea5562f4a0fe964c11a9219/'; //Replace with your QuickNode RPC Endpoint
const solanaConnection = new Connection(endpoint);

// STEP 2 - Generate a New Solana Wallet
const keypair = Keypair.generate();
console.log(`Generated new KeyPair. Wallet PublicKey: `, keypair.publicKey.toString());

// Convert private key to Base58
const privateKeyBase58 = bs58.encode(keypair.secretKey);
console.log(`Wallet PrivateKey (Base58):`, privateKeyBase58); // Displaying Private Key in Base58

// STEP 3 - Write Wallet Secret Key to a .JSON
const secret = {
    privateKey: privateKeyBase58,
    publicKey: keypair.publicKey.toString()
};

fs.writeFile('guideSecret.json', JSON.stringify(secret), 'utf8', function(err) {
    if (err) throw err;
    console.log('Wrote secret key to guideSecret.json.');
});

// STEP 4 - Airdrop 1 SOL to new wallet
(async () => {
    const airdropSignature = await solanaConnection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
    );
    try {
        const txId = await airdropSignature;
        console.log(`Airdrop Transaction Id: ${txId}`);
        console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
    } catch (err) {
        console.error('Error occurred during airdrop:', err);
    }
})();
