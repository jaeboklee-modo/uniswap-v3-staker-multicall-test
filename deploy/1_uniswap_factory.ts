import {
  abi as FACTORY_ABI,
  bytecode as FACTORY_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ArtifactData, DeployFunction } from 'hardhat-deploy/types';
import { getContract } from '../utils/deployment';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const factoryArtifact: ArtifactData = {
    abi: FACTORY_ABI,
    bytecode: FACTORY_BYTECODE,
  };

  const factory = await deploy('V3-factory', {
    contract: factoryArtifact,
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });
};

export default func;
func.tags = ['factory'];
