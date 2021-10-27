import { Wallet } from '@ethersproject/wallet';
import { expect } from 'chai';
import { BigNumber, ethers } from 'ethers';
import { waffle } from 'hardhat';
import { TestEnv } from './shared/fixture';
import { getTimestamp } from './shared/time';

describe('Staker', async () => {
  let admin: Wallet;
  let testEnv: TestEnv;

  async function fixture() {
    return await TestEnv.setup();
  }

  before(async () => {
    [admin] = waffle.provider.getWallets();
  });

  beforeEach(async () => {
    testEnv = await waffle.loadFixture(fixture);
  });

  context('', async () => {
    beforeEach('set incentive', async () => {
      const tx = await testEnv.rewardToken
        .connect(admin)
        .approve(testEnv.staker.address, ethers.constants.MaxUint256);
      // start time must be now or in the furute
      const startTime = (await getTimestamp(tx)).add(5);
      await testEnv.createIncentive(admin, testEnv.pool0, startTime);
      await testEnv.createIncentive(admin, testEnv.pool1, startTime);
      await testEnv.mintPosition(
        admin,
        testEnv.token0,
        testEnv.token1,
        BigNumber.from(100),
        BigNumber.from(100),
        await getTimestamp(tx)
      );
    });

    it('success', async () => {
      console.log(testEnv.pool0.address);
    });
  });
});
