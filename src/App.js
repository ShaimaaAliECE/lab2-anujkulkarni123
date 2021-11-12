import React, { Component } from 'react';
import './App.css';

const Row = ({ row, playTurn }) => {
  return (
    <tr>
      {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} playTurn={playTurn} />)}
    </tr>
  );
};

const Cell = ({ value, columnIndex, playTurn }) => {
  let color = 'white';
  if (value === 1) {
    color = 'red';
  } else if (value === 2) {
    color = 'yellow';
  }
    
  return (
    <td>
      <div className="cell" onClick={() => {playTurn(columnIndex)}}>
        <div className={color}></div>
      </div>
    </td>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      p1: 1,
      p2: 2,
      currentPlayer: 1,
      board: [],
      gameOver: false,
      winMessage: '',
    };
    //bind play function to App component
    this.playTurn = this.playTurn.bind(this);
  }
  
 
  // Starts new game
  initBoard() {
    // Create a blank 6x7 matrix
    let board = [];
    for (let r = 0; r < 6; r++) {
      let row = [];
      for (let c = 0; c < 7; c++) { row.push(null) }
      board.push(row);
    }
    
    this.setState({
      board,
      currentPlayer: this.state.player1,
      gameOver: false,
      winMessage: ''
    });
  }

  //Play a turn and check for win
  playTurn(c) {
    if (!this.state.gameOver) {
      // Place piece on board
      let board = this.state.board;
      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = this.state.currentPlayer;
          break;
        }
      }

      // Check status of board
      let result = this.checkWin(board);
      if (result === this.state.p1) {
        this.setState({ board, gameOver: true, winMessage: 'RED wins!' });
      } else if (result === this.state.p2) {
        this.setState({ board, gameOver: true, winMessage: 'YELLOW wins!' });
      } else if (result === 'draw') {
        this.setState({ board, gameOver: true, winMessage: 'Draw game.' });
      } else {
        this.setState({ board, currentPlayer: this.togglePlayer() });
      }
    } else {
      this.setState({ winMessage: 'Game over. Please start a new game.' });
    }
  }
  
  //switching players
  togglePlayer() {
    return (this.state.currentPlayer === this.state.p1) ? this.state.p2 : this.state.p1;
  }

  checkVertical(board) {
    // Check only if row is 3 or greater
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r + 1][c] &&
              board[r][c] === board[r + 2][c] &&
              board[r][c] === board[r + 3][c]) {
            return board[r][c];    
          }
        }
      }
    }
  }
  
  checkHorizontal(board) {
    // Check only if column is 3 or less
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r][c + 1] && 
              board[r][c] === board[r][c + 2] &&
              board[r][c] === board[r][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkDraw(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === null) {
          return null;
        }
      }
    }
    return 'draw';    
  }

  checkWin(board) { 
    return this.checkVertical(board) || this.checkHorizontal(board) || this.checkDraw(board);
  }

  componentWillMount()  {
    this.initBoard();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Connect 4 with React</p>
        </header>

        <table>
            <thead>
            </thead>
            <tbody>
              {this.state.board.map((row, i) => (<Row key={i} row={row} playTurn={this.playTurn} />))}
            </tbody>
        </table>

        <div className="button-container">
          <button onClick={() => {this.initBoard()}}>New Game</button>
        </div>

        <div className="message">
        <p className="win-message">{this.state.winMessage}</p>
        </div>
      </div>
    );
  }
}

export default App;
