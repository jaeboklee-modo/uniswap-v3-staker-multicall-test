import { Contract } from '@ethersproject/contracts';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('WETH', {
    contract: 'Token',
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });

  await deploy('Token0', {
    contract: 'Token',
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });

  await deploy('Token1', {
    contract: 'Token',
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });

  await deploy('Token2', {
    contract: 'Token',
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });

  await deploy('RewardToken', {
    contract: 'Token',
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });
};

export default func;
func.tags = ['tokens'];
