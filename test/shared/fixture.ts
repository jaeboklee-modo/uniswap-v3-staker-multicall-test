import { Token } from '../../typechain';
import { waffle, deployments, ethers } from 'hardhat';
import { BigNumber, Contract, Wallet } from 'ethers';
import { abi as POOL_ABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import { FeeAmount, getMaxTick, getMinTick, TICK_SPACINGS } from '../../utils/ticks';

export class TestEnv {
  pool0: Contract;
  pool1: Contract;
  nft: Contract;
  staker: Contract;
  token0: Token;
  token1: Token;
  token2: Token;
  rewardToken: Token;
  private _fee = FeeAmount.MEDIUM;

  constructor(
    pool0: Contract,
    pool1: Contract,
    nft: Contract,
    staker: Contract,
    token0: Token,
    token1: Token,
    token2: Token,
    rewardToken: Token
  ) {
    this.pool0 = pool0;
    this.pool1 = pool1;
    this.nft = nft;
    this.staker = staker;
    this.token0 = token0;
    this.token1 = token1;
    this.token2 = token2;
    this.rewardToken = rewardToken;
  }

  public async createIncentive(admin: Wallet, pool: Contract, startTimestamp: BigNumber) {
    const incentiveKey = {
      pool: pool.address,
      rewardToken: this.rewardToken.address,
      startTime: startTimestamp,
      endTime: startTimestamp.add(100),
      refundee: admin.address,
    };
    const reward = '100';

    await this.staker.createIncentive(incentiveKey, reward);
  }

  public async mintPosition(
    account: Wallet,
    token0: Token,
    token1: Token,
    token0Amount: BigNumber,
    token1Amount: BigNumber,
    txTimestamp: BigNumber
  ) {
    const params = {
      token0: token0.address,
      token1: token1.address,
      fee: this._fee,
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: account.address,
      amount0Desired: token0Amount,
      amount1Desired: token1Amount,
      amount0Min: 0,
      amount1Min: 0,
      deadline: txTimestamp.add(1000),
    };
    await this.nft.mint(params);
  }

  public static async setup() {
    await deployments.fixture(['tokens', 'factory', 'periphery', 'staker']);

    const { get } = deployments;

    const fee = FeeAmount.MEDIUM;

    const token0Deployment = await get('Token0');
    const token1Deployment = await get('Token1');
    const token2Deployment = await get('Token2');
    const rewardTokenDeployment = await get('RewardToken');

    const token0 = (await ethers.getContractAt(
      token0Deployment.abi,
      token0Deployment.address
    )) as Token;
    const token1 = (await ethers.getContractAt(
      token1Deployment.abi,
      token1Deployment.address
    )) as Token;
    const token2 = (await ethers.getContractAt(
      token2Deployment.abi,
      token2Deployment.address
    )) as Token;
    const rewardToken = (await ethers.getContractAt(
      rewardTokenDeployment.abi,
      rewardTokenDeployment.address
    )) as Token;

    const factoryDeployment = await get('V3-factory');

    const factory = await ethers.getContractAt(factoryDeployment.abi, factoryDeployment.address);
    await factory.createPool(token0.address, token1.address, fee);
    await factory.createPool(token1.address, token2.address, fee);

    const pool0addr = await factory.getPool(token0.address, token1.address, fee);
    const pool1addr = await factory.getPool(token1.address, token2.address, fee);

    const pool0 = await ethers.getContractAt(POOL_ABI, pool0addr);
    const pool1 = await ethers.getContractAt(POOL_ABI, pool1addr);

    const nftDeployment = await get('V3-nftManager');
    const nft = await ethers.getContractAt(nftDeployment.abi, nftDeployment.address);

    const stakerDeployment = await get('V3-staker');
    const staker = await ethers.getContractAt(stakerDeployment.abi, stakerDeployment.address);

    return new TestEnv(pool0, pool1, nft, staker, token0, token1, token2, rewardToken);
  }
}
