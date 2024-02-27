import { Keypair, Connection, clusterApiUrl, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";

// Constants
const MINT_SIZE = 165;
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

// Function to get minimum balance for rent exempt mint
async function getMinimumBalanceForRentExemptMint(connection) {
  return await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
}

// Function to create mint using built-in function
async function createMintBuiltIn(connection, feePayer, mintAuthority, freezeAuthority, decimals) {
  return await createMint(connection, feePayer, mintAuthority, freezeAuthority, decimals);
}

// Function to create mint composed by yourself
async function createMintComposed(connection, feePayer, alicePublicKey, decimals) {
  const mintKeypair = Keypair.generate();
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      alicePublicKey,
      null // You can set freeze authority here
    )
  );
  return { tx, mintKeypair };
}

// Function to create associated token account using built-in function
async function createAssociatedTokenAccountBuiltIn(connection, feePayer, mint, owner) {
  return await createAssociatedTokenAccount(connection, feePayer, mint, owner);
}

// Function to create associated token account composed by yourself
async function createAssociatedTokenAccountComposed(connection, feePayer, owner, mint) {
  const associatedTokenAccountPublicKey = await findAssociatedTokenAddress(owner, mint);
  const tx = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      feePayer.publicKey,
      associatedTokenAccountPublicKey,
      owner,
      mint
    )
  );
  return { tx, associatedTokenAccountPublicKey };
}

// Function to mint tokens using built-in function
async function mintToBuiltIn(connection, feePayer, mint, receiver, mintAuthority, amount, decimals) {
  return await mintToChecked(connection, feePayer, mint, receiver, mintAuthority, amount, decimals);
}

// Function to mint tokens composed by yourself
async function mintToComposed(connection, mint, receiver, mintAuthority, amount, decimals) {
  const tx = new Transaction().add(
    createMintToCheckedInstruction(
      mint,
      receiver,
      mintAuthority,
      amount,
      decimals
    )
  );
  return tx;
}

(async () => {
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from([
      154,239,67,52,76,207,236,84,63,221,4,87,93,142,46,229,240,109,
      165,73,14,74,108,124,48,138,203,24,73,149,235,193,99,155,56,27,
      151,211,253,118,27,211,61,150,17,15,18,40,145,176,52,230,154,
      213,238,53,142,192,17,226,28,200,13,101
    ])
  );
  
  const connection = new Connection(clusterApiUrl('devnet'));
  const balance = await connection.getBalance(keypair.publicKey);
  
  console.log('public key:', keypair.publicKey.toString());
  console.log('private key:', keypair.secretKey.toString());
  console.log('balance:', balance / LAMPORTS_PER_SOL);
})();
