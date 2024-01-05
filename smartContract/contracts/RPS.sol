// SPDX-License-Identifier: WTFPL-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RPS is ReentrancyGuard {
    enum Move {
        Null,
        Rock,
        Paper,
        Scissors,
        Spock,
        Lizard
    }

    struct Game {
        address j1;
        address j2;
        bytes32 c1Hash;
        Move c2;
        uint256 stake;
        uint256 lastAction;
        bool resolved;
        uint timeout;
    }

    event GameResolved(
        uint256 indexed gameId,
        address indexed player1,
        address indexed player2,
        uint256 stake,
        address resolver,
        uint256 timestamp
    );

    Game[] public games;

    // events
    event NewGame(
        uint256 indexed gameId,
        address indexed player1,
        address indexed player2,
        uint256 stake,
        uint256 timeout
    );
    event Player2MoveCommitted(
        uint256 indexed gameId,
        Move move,
        uint256 timestamp
    );

    // modifiers
    modifier onlyPlayers(uint256 _gameId) {
        require(
            msg.sender == games[_gameId].j1 || msg.sender == games[_gameId].j2,
            "Not a participant"
        );
        _;
    }

    function createGame(
        bytes32 _c1Hash,
        address _j2,
        uint256 _timeout
    ) external payable nonReentrant {
        Game memory newGame;
        newGame.j1 = msg.sender;
        newGame.j2 = _j2;
        newGame.c1Hash = _c1Hash;
        newGame.stake = msg.value;
        newGame.lastAction = block.timestamp;
        newGame.timeout = _timeout;

        games.push(newGame);
        emit NewGame(
            games.length - 1,
            newGame.j1,
            newGame.j2,
            newGame.stake,
            newGame.timeout
        );
    }

    function play(
        uint256 _gameId,
        Move _c2
    ) external payable onlyPlayers(_gameId) nonReentrant {
        require(games[_gameId].c2 == Move.Null, "c2 already committed");
        require(_c2 != Move.Null);
        require(msg.value == games[_gameId].stake);
        games[_gameId].lastAction = block.timestamp;

        games[_gameId].c2 = _c2;

        emit Player2MoveCommitted(_gameId, _c2, block.timestamp);
    }

    function hash(uint8 _c, uint256 _salt) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_c, _salt));
    }

    function solve(Move _c1, uint256 _gameId) external {
        Game storage game = games[_gameId];

        require(_c1 != Move.Null);
        require(game.c2 != Move.Null, "j2 must have played");
        require(msg.sender == game.j1, "j1 can call the solve function");
        require(!game.resolved, "Game already resolved");
        require(hash(uint8(_c1), _gameId) == game.c1Hash);

        if (win(c1(_gameId), game.c2))
            payable(game.j1).transfer(2 * game.stake);
        else if (win(game.c2, c1(_gameId)))
            payable(game.j2).transfer(2 * game.stake);
        else {
            payable(game.j1).transfer(game.stake);
            payable(game.j2).transfer(game.stake);
        }

        emit GameResolved(
            _gameId,
            game.j1,
            game.j2,
            game.stake,
            msg.sender,
            block.timestamp
        );
        game.resolved = true;
        game.stake = 0;
    }

    function j1Timeout(
        uint256 _gameId
    ) external onlyPlayers(_gameId) nonReentrant {
        Game storage game = games[_gameId];

        require(game.c2 != Move.Null, "J2 should have played already");
        require(!game.resolved, "Game already resolved");
        require(
            block.timestamp > games[_gameId].lastAction + game.timeout,
            "Game not over yet"
        );

        payable(games[_gameId].j2).transfer(2 * games[_gameId].stake);
        games[_gameId].resolved = true;
        game.stake = 0;

        emit GameResolved(
            _gameId,
            game.j1,
            game.j2,
            game.stake,
            msg.sender,
            block.timestamp
        );
    }

    function j2Timeout(
        uint256 _gameId
    ) external onlyPlayers(_gameId) nonReentrant {
        Game storage game = games[_gameId];

        require(game.c2 == Move.Null, "J2 should not have played already");
        require(!game.resolved, "Game already resolved");
        require(
            block.timestamp > games[_gameId].lastAction + game.timeout,
            "Game not over yet"
        );

        payable(games[_gameId].j1).transfer(games[_gameId].stake);
        games[_gameId].resolved = true;
        game.stake = 0;

        emit GameResolved(
            _gameId,
            game.j1,
            game.j2,
            game.stake,
            msg.sender,
            block.timestamp
        );
    }

    function c1(uint256 _gameId) internal view returns (Move) {
        return Move((uint(games[_gameId].c1Hash) % 5) + 1);
    }

    function win(Move _c1, Move _c2) internal pure returns (bool) {
        if (_c1 == _c2) return false;
        else if (_c1 == Move.Null) return false;
        else if (uint(_c1) % 2 == uint(_c2) % 2) return (_c1 < _c2);
        else return (_c1 > _c2);
    }

    // getter functions
    function getGamesLength() external view returns (uint) {
        return games.length;
    }
}
