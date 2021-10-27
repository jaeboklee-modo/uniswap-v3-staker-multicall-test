import {
  abi as NFT_DESCRIPTOR_ABI,
  bytecode as NFT_DESCRIPTOR_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json';

import {
  abi as DESCRIPTOR_ABI,
  bytecode as DESCRIPTOR_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json';
import {
  abi as MANAGER_ABI,
  bytecode as MANAGER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ArtifactData, DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const factory = await get('V3-factory');
  const weth = await get('WETH');

  const nftDescriptorArtifact: ArtifactData = {
    abi: NFT_DESCRIPTOR_ABI,
    bytecode: NFT_DESCRIPTOR_BYTECODE,
  };

  const nftDescriptor = await deploy('NFTDescriptor', {
    contract: nftDescriptorArtifact,
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
  });

  const descriptorFactory = await hre.ethers.getContractFactory(
    'NonfungibleTokenPositionDescriptor'
  );

  const descriptorArtifact: ArtifactData = {
    abi: DESCRIPTOR_ABI,
    bytecode: descriptorFactory.bytecode,
  };

  const descriptor = await deploy('V3-descriptor', {
    contract: descriptorArtifact,
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
    libraries: { NFTDescriptor: nftDescriptor.address },
    args: [weth.address],
  });

  const managerArtifact: ArtifactData = {
    abi: MANAGER_ABI,
    bytecode: MANAGER_BYTECODE,
  };

  const manager = await deploy('V3-nftManager', {
    contract: managerArtifact,
    skipIfAlreadyDeployed: true,
    from: deployer,
    log: true,
    args: [factory.address, weth.address, weth.address],
  });
};

export default func;
func.tags = ['periphery'];
