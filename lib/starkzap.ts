import { AccountInterface, uint256, Provider } from 'starknet';

type PayParams = {
  amount: string; // human readable (e.g. "10")
  tokenAddress: string;
  recipient: string;
  decimals?: number;
};

declare global {
  interface Window {
    starknet?: any;
  }
}

// safer conversion (no floating point)
function toUint256(amount: string, decimals: number) {
  const scale = BigInt(10) ** BigInt(decimals);
  const value = BigInt(amount) * scale;
  return uint256.bnToUint256(value);
}

export async function payWithStarkzap(params: PayParams) {
  try {
    if (!window.starknet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    const starknet = window.starknet;

    await starknet.requestAccounts();

    const account: AccountInterface = starknet.account;

    const decimals = params.decimals ?? 18;
    const amountUint = toUint256(params.amount, decimals);

    const tx = await account.execute([
      {
        contractAddress: params.tokenAddress,
        entrypoint: 'transfer',
        calldata: [
          params.recipient,
          amountUint.low.toString(),
          amountUint.high.toString(),
        ],
      },
    ]);

    const provider = new Provider({
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io',
    });

    await provider.waitForTransaction(tx.transaction_hash);

    return {
      success: true,
      txHash: tx.transaction_hash,
    };

  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Transaction failed',
    };
  }
}