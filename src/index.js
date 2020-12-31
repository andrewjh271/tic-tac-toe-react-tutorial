import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  createRow(row_number) {
    const idx_arr = [0, 1, 2].map((v) => v + row_number * 3)
    return (
      <div className="board-row" key={row_number}>
        {idx_arr.map((idx) => this.renderSquare(idx))}
      </div>
    )
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map((v) => this.createRow(v) )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        last_move: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      asc_moves: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        last_move: this.coordinates(i)
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleMoveOrder() {
    this.setState({
      asc_moves: !this.state.asc_moves
    })
  }

  coordinates(index) {
    let col = String.fromCharCode(97 + (index % 3));
    let row = 3 - Math.floor(index / 3);
    return col + row;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)

    let moves = history.map((_step, move) => {
      let desc = move ?
        `Go to move #${move} (${history[move].last_move})`:
        'Go to game start';
      if (move === this.state.stepNumber) {
        desc = <strong>{desc}</strong>
      }
      
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (!this.state.asc_moves) {
      moves = moves.reverse();
    }

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={ () => this.toggleMoveOrder()}>
            Toggle Move Order
          </button>
          <ol start='0'>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}