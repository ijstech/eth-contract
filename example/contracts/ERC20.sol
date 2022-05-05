// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.6;

contract ERC20 {

    event Approval(address owner, address spender, uint256 value);
    event Transfer(address from, address to, uint256 value);

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public minter;
    uint256 public cap;

    constructor(string memory _name, string memory _symbol, address _minter, uint256 _cap) {
        name = _name;
        symbol = _symbol;
        minter = _minter;
        cap = _cap;
    }

    function mint(address _address, uint256 amount) external {
        require(msg.sender == minter);
        totalSupply += amount;
        require(totalSupply <= cap);
        balanceOf[_address] += amount;
        emit Transfer(address(0), _address, amount);
    }

    function transfer(address _address, uint256 amount) external {
        balanceOf[msg.sender] -= amount;
        balanceOf[_address] += amount;
        emit Transfer(msg.sender, _address, amount);
    }
    function transferFrom(address from, address to, uint256 amount) external {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Approval(from, msg.sender, allowance[from][msg.sender]);
        emit Transfer(from, to, amount);
    }
    function approve(address spender, uint256 amount) external {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
    } 
}