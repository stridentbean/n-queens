function BitwiseBoard(params) {
  if (_.isUndefined(params) || _.isNull(params)) {
    console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
    console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
    console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
  } else if (params instanceof BitwiseBoard) {
    this['n'] = params['n'];
    this['board'] = params['board'].slice();
  } else if (params.hasOwnProperty('n')) {
    this['n'] = params['n'];
    this['board'] = this.makeEmptyBoard(this['n']);
  } else {
    this['n'] = params.length;
    this['board'] = params;
  }

  return this;
}

BitwiseBoard.prototype.rows = function() {
  return _(_.range(this['n'])).map(function(rowIndex) {
    return this['board'][rowIndex];
  }, this);
};

BitwiseBoard.prototype.togglePiece = function(rowIndex, colIndex) {
  this['board'][rowIndex] = this['board'][rowIndex] ^ Math.pow(2, this['n'] - colIndex - 1);
};

BitwiseBoard.prototype._getFirstRowColumnIndexForMajorDiagonalOn = function(rowIndex, colIndex) {
  return colIndex - rowIndex;
};

BitwiseBoard.prototype._getFirstRowColumnIndexForMinorDiagonalOn = function(rowIndex, colIndex) {
  return colIndex + rowIndex;
};

BitwiseBoard.prototype.hasAnyRooksConflicts = function() {
  return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
};

BitwiseBoard.prototype.hasAnyQueenConflictsOn = function(rowIndex, colIndex) {
  return (
    this.hasRowConflictAt(rowIndex) ||
    this.hasColConflictAt(colIndex) ||
    this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
    this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
  );
};

BitwiseBoard.prototype.hasAnyQueensConflicts = function() {
  return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
};

BitwiseBoard.prototype._isInBounds = function(rowIndex, colIndex) {
  return (
    0 <= rowIndex && rowIndex < this['n'] &&
    0 <= colIndex && colIndex < this['n']
  );
};

BitwiseBoard.prototype.hasRowConflictAt = function(rowIndex) {
  var temp = (this['board'][rowIndex]).toString(2);
  var result = _.reduce(temp, function(total, next) { return total + parseInt(next || 0); }, 0);
  return result > 1;
};

BitwiseBoard.prototype.hasAnyRowConflicts = function() {
  for(var i = 0; i < this['n']; i++) {
    if (this.hasRowConflictAt(i)) {
      return true;
    }
  }
  return false;
};

// BitwiseBoard.prototype.hasColConflictAt = function(colIndex) {
//   var result = this['board'][0], and;
//   for (var i = 0; i < this['n'] - 1; i++) {
//     and = result & this['board'][i+1];
//     if (and > 0) return true;
//     result = this['board'][i] | this['board'][i+1];
//   }
//   return false;
// };

BitwiseBoard.prototype.hasAnyColConflicts = function() {
  var result = this['board'][0], and;
  for (var i = 0; i < this['n'] - 1; i++) {
    and = result & this['board'][i+1];
    if (and > 0) return true;
    result = this['board'][i] | this['board'][i+1];
  }
  return false;
};

// BitwiseBoard.prototype.hasMajorDiagonalConflictAt = function(m) {
//   var count = 0;
//   for(var i = 0; i < this['n'] - Math.abs(m); i++) {
//     count += parseInt((this['board'][m >= 0 ? i : Math.abs(m) + i]).toString(2)[m >= 0 ? Math.abs(m) + i : i] || 0);
//   }
//   return count > 1;
// };

BitwiseBoard.prototype.hasAnyMajorDiagonalConflicts = function() {
  var result = this['board'][0], and;
  for (var i = 0; i < this['n'] - 1; i++) {
    var shift = this['board'][i+1] << (i+1);
    and = result & shift;
    if (and > 0) return true;
    result = this['board'][i] | shift;
  }
  return false;
};

// BitwiseBoard.prototype.hasMinorDiagonalConflictAt = function(m) {
//   var count = 0;
//   for (var i = 0; i < this['n']; i++) {
//     if (this._isInBounds(i,m)) {
//       count+= parseInt((this['board'][i]).toString(2)[m] || 0);
//     }
//     m--;
//   }
//   return count > 1;
// };

BitwiseBoard.prototype.hasAnyMinorDiagonalConflicts = function() {
  var result = this['board'][0], and;
  for (var i = 0; i < this['n'] - 1; i++) {
    var shift = this['board'][i+1] >> (i+1);
    and = result & shift;
    if (and > 0) return true;
    result = this['board'][i] | shift;
  }
  return false;
};

BitwiseBoard.prototype.makeEmptyBoard = function(n) {
  return _(_.range(n)).map(function() {
    return 0;
  });
};
