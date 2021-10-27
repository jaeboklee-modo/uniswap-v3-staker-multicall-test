import {
  abi as STAKER_ABI,
  bytecode as STAKER_BYTECODE,
} from '@uniswap/v3-staker/artifacts/contracts/UniswapV3Staker.sol/UniswapV3Staker.json';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ArtifactData, DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const stakerArtifact: ArtifactData = {
    abi: STAKER_ABI,
    bytecode: STAKER_BYTECODE,
  };

  const factory = await get('V3-factory');
  const manager = await get('V3-nftManager');

  const staker = await deploy('V3-staker', {
    contract: stakerArtifact,
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
    args: [factory.address, manager.address, 2592000, 63072000],
  });
};

export default func;
func.tags = ['staker'];
