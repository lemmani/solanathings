import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

(async () => {
  //
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from([
      154,239,67,52,76,207,236,84,63,221,4,87,93,142,46,229,240,109,
      165,73,14,74,108,124,48,138,203,24,73,149,235,193,99,155,56,27,
      151,211,253,118,27,211,61,150,17,15,18,40,145,176,52,230,154,
      213,238,53,142,192,17,226,28,200,13,101
    ])
  );
  //
  console.log('public key', keypair.publicKey.toString());
  console.log('private key', keypair.secretKey.toString());
  //
  const connection = new Connection(clusterApiUrl('devnet'));
  const balance = await connection.getBalance(keypair.publicKey);
  //
  console.log('balance', balance / LAMPORTS_PER_SOL);
})();
