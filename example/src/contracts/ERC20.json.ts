export default {
"abi":[
{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_minter","type":"address"},{"internalType":"uint256","name":"_cap","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
{"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}
],
"bytecode":"60806040523480156200001157600080fd5b5060405162000b5a38038062000b5a8339810160408190526200003491620001ea565b8351620000499060009060208701906200008d565b5082516200005f9060019060208601906200008d565b50600580546001600160a01b0319166001600160a01b03939093169290921790915560065550620002d09050565b8280546200009b906200027d565b90600052602060002090601f016020900481019282620000bf57600085556200010a565b82601f10620000da57805160ff19168380011785556200010a565b828001600101855582156200010a579182015b828111156200010a578251825591602001919060010190620000ed565b50620001189291506200011c565b5090565b5b808211156200011857600081556001016200011d565b600082601f8301126200014557600080fd5b81516001600160401b0380821115620001625762000162620002ba565b604051601f8301601f19908116603f011681019082821181831017156200018d576200018d620002ba565b81604052838152602092508683858801011115620001aa57600080fd5b600091505b83821015620001ce5785820183015181830184015290820190620001af565b83821115620001e05760008385830101525b9695505050505050565b600080600080608085870312156200020157600080fd5b84516001600160401b03808211156200021957600080fd5b620002278883890162000133565b955060208701519150808211156200023e57600080fd5b506200024d8782880162000133565b604087015190945090506001600160a01b03811681146200026d57600080fd5b6060959095015193969295505050565b600181811c908216806200029257607f821691505b60208210811415620002b457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61087a80620002e06000396000f3fe608060405234801561001057600080fd5b50600436106100d45760003560e01c8063355274ea1161008157806395d89b411161005b57806395d89b41146101d1578063a9059cbb146101d9578063dd62ed3e146101ec57600080fd5b8063355274ea1461019557806340c10f191461019e57806370a08231146101b157600080fd5b806318160ddd116100b257806318160ddd1461015157806323b872dd14610168578063313ce5671461017b57600080fd5b806306fdde03146100d957806307546172146100f7578063095ea7b31461013c575b600080fd5b6100e1610217565b6040516100ee919061071f565b60405180910390f35b6005546101179073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100ee565b61014f61014a3660046106f5565b6102a5565b005b61015a60025481565b6040519081526020016100ee565b61014f6101763660046106b9565b61031e565b610183601281565b60405160ff90911681526020016100ee565b61015a60065481565b61014f6101ac3660046106f5565b6104a3565b61015a6101bf366004610664565b60036020526000908152604090205481565b6100e161057d565b61014f6101e73660046106f5565b61058a565b61015a6101fa366004610686565b600460209081526000928352604080842090915290825290205481565b60008054610224906107c1565b80601f0160208091040260200160405190810160405280929190818152602001828054610250906107c1565b801561029d5780601f106102725761010080835404028352916020019161029d565b820191906000526020600020905b81548152906001019060200180831161028057829003601f168201915b505050505081565b33600081815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168085529083529281902085905580519384529083019190915281018290527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906060015b60405180910390a15050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526004602090815260408083203384529091528120805483929061035e9084906107aa565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600090815260036020526040812080548392906103989084906107aa565b909155505073ffffffffffffffffffffffffffffffffffffffff8216600090815260036020526040812080548392906103d2908490610792565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600081815260046020908152604080832033808552908352928190205481519485529184019290925282820152517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259181900360600190a16040805173ffffffffffffffffffffffffffffffffffffffff8086168252841660208201529081018290527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060600160405180910390a1505050565b60055473ffffffffffffffffffffffffffffffffffffffff1633146104c757600080fd5b80600260008282546104d99190610792565b909155505060065460025411156104ef57600080fd5b73ffffffffffffffffffffffffffffffffffffffff821660009081526003602052604081208054839290610524908490610792565b9091555050604080516000815273ffffffffffffffffffffffffffffffffffffffff841660208201529081018290527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90606001610312565b60018054610224906107c1565b33600090815260036020526040812080548392906105a99084906107aa565b909155505073ffffffffffffffffffffffffffffffffffffffff8216600090815260036020526040812080548392906105e3908490610792565b90915550506040805133815273ffffffffffffffffffffffffffffffffffffffff841660208201529081018290527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90606001610312565b803573ffffffffffffffffffffffffffffffffffffffff8116811461065f57600080fd5b919050565b60006020828403121561067657600080fd5b61067f8261063b565b9392505050565b6000806040838503121561069957600080fd5b6106a28361063b565b91506106b06020840161063b565b90509250929050565b6000806000606084860312156106ce57600080fd5b6106d78461063b565b92506106e56020850161063b565b9150604084013590509250925092565b6000806040838503121561070857600080fd5b6107118361063b565b946020939093013593505050565b600060208083528351808285015260005b8181101561074c57858101830151858201604001528201610730565b8181111561075e576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b600082198211156107a5576107a5610815565b500190565b6000828210156107bc576107bc610815565b500390565b600181811c908216806107d557607f821691505b6020821081141561080f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea26469706673582212204605993c7adc737254f6b79b8c686f86e6563fad601d52a3e024a0122b5cfe3e64736f6c63430008060033"
}