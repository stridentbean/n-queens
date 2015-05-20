/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {

  var board = new Board({'n':n});
  var solution = [];
  for(var i =0; i < n; i++) {
    board.togglePiece(i,i);
    solution.push(board.get(i));
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = _.reduce(_.range(1,n+1), function(a,b) {
    return a * b;
  }, 1); // The Determinant of a n*n matrix gives the complete set of possible n rook solutions
  //ie:       |a b c|
  //    |3| = |d e f| = aei + bfg + cdh - ceg - bdi - afh
  //          |g h i|

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

//var row = {}; var col = {}; var major = {}; var minor = {}
//row[0] = true; col[0] = true; major[0] = true
//count
//if(!row[r] && !col[c] && !major[m] && !minor[i]) {
//  place next queen at (r,c)
//
//  update r c m i;
//}
//
//instantiate RCMI
//instantiate solutionGrid
//iterate through cols on current row
//    if safe spot determined by RCMI objects
//      place queen at row,col
//      recurse on next row
//
//

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = [];


  var board = new Board({'n':n});
  var helper = function nQueensHelper(row, myBoard) {
    for(var c = 0; c < n; c++) {
      myBoard.togglePiece(row, c);
      if (!myBoard.hasAnyQueenConflictsOn(row, c)) {
      //  var newBoard = new Board(myBoard);

        //newBoard.togglePiece(row, c);
        if (row + 1 < n) {
          var result = helper(row+1,myBoard);
          if(!!result) {
            return result;
          }
        } else {
          return myBoard;
        }
      }
      myBoard.togglePiece(row, c);

    }

  };

  var result = helper(0,board);
  if(!result) {
    solution = 0;
    result = board;
  } else {
    for(var i = 0 ; i < n; i++ ) {
      solution.push(result.get(i));
    }
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return result;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  //if (n === 4) debugger; //check major
  var solutionCount = 0;
  var board = new Board({'n':n});
  var helper = function nQueensHelper(row, myBoard) {
    for(var c = 0; c < n; c++) {
      myBoard.togglePiece(row, c);
      if (!myBoard.hasAnyQueenConflictsOn(row, c)) {
        var newBoard = new Board(myBoard);

        //newBoard.togglePiece(row, c);
        if (row + 1 < n) {
          helper(row+1,newBoard);
        } else {
          solutionCount++;
        }
      }
      myBoard.togglePiece(row, c);

    }
  };

  helper(0,board);
  console.log(solutionCount);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
