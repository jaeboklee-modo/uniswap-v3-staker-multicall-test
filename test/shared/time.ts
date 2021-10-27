import { BigNumber } from 'ethers';
import { waffle } from 'hardhat';

export async function getTimestamp(tx: any) {
  return BigNumber.from((await waffle.provider.getBlock(tx.blockNumber)).timestamp);
}
