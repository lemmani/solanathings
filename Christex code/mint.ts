import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import "@solana/web3.js";
import secret from './guideSecret.json';
import bs58 from 'bs58';

const umi = createUmi('https://frosty-cosmopolitan-bush.solana-devnet.quiknode.pro/2b294e5c5f54a3cf3ea5562f4a0fe964c11a9219/'); //Replace with your QuickNode RPC Endpoint

// Convert the privateKey string to a Uint8Array
const privateKeyArray = bs58.decode(secret.privateKey);
const userWallet = umi.eddsa.createKeypairFromSecretKey(privateKeyArray);
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

// Remaining code...

const metadata = {
    name: "Emmanuel",
    symbol: "EMM",
    uri: "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202310/trading_cryptocurrencies_effectively_using_priceaction-sixteen_nine.jpg?size=948:533",
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 1000000_00000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi).then(() => {
    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
});
