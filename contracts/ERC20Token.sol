// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ERC20Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public supply;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    event Transfer(address sender, address receiver, uint256 tokens);
    event Approval(address sender, address delegate, uint256 tokens);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _supply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        supply = _supply;
        balances[msg.sender] = _supply;
    }

    function totalSupply() external view returns (uint256) {
        return supply;
    }

    function balanceOf(address tokenOwner) external view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens)
        external
        returns (bool)
    {
        require(
            balances[msg.sender] >= numTokens,
            "You do not have enough Tokens"
        );
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens)
        external
        returns (bool)
    {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate)
        external
        view
        returns (uint256)
    {
        return allowed[owner][delegate];
    }

    function transferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) external returns (bool) {
        require(
            allowed[owner][msg.sender] >= numTokens,
            "Delegate does not have enough allowance"
        );
        balances[owner] -= numTokens;
        balances[buyer] += numTokens;
        allowed[owner][msg.sender] -= numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}
