/**
 * 说明：
 * row 代表行
 * column 代表列
 * block 代表 3×3 的方块，一个数独里有 9 个 block，
 * 从左到右，从上到下，从 1 开始编号，即：
 * 1 2 3
 * 4 5 6
 * 7 8 9
 */

var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var difficulty = 3;
var randomComparator = function (a, b) {
  return 0.5 - Math.random();
};
var sudoku = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var answer = [[], [], [], [], [], [], [], [], []];
var table = [[], [], [], [], [], [], [], [], []];

function checkColumn(col, x) {
  for (var i = 0; i < 9; i++) {
    if (sudoku[i][col] === x) {
      return false;
    }
  }
  // console.log("check column true");
  return true;
}

function checkRow(row, x) {
  for (var j = 0; j < 9; j++) {
    if (sudoku[row][j] === x) {
      return false;
    }
  }
  // console.log("check row true");
  return true;
}

function checkBlock(row, col, x) {
  var startRow = Math.floor(row / 3) * 3;
  var startCol = Math.floor(col / 3) * 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (sudoku[startRow + i][startCol + j] === x) {
        return false;
      }
    }
  }
  // console.log("check block true");
  return true;
}

function check(i, j, x) {
  return checkRow(i, x) && checkColumn(j, x) && checkBlock(i, j, x);
}

function tryFixit(i, j) {
  // console.log("i: " + i + " j: " + j);
  if (i >= 9) {
    return true;
  }
  // 一行一行的检查，s t 表示下一个需要检查的位置坐标
  var s = i;
  var t = j + 1;
  if (t >= 9) {
    // 下一次检查下一行
    t -= 9;
    s++;
  }
  // 当前位置有数字，尝试判断下一位, 这里使用的是answer, 表示该位置有用户输入的数字时，不需要修改
  if (answer[i][j] !== 0) {
    var success = tryFixit(s, t);
    if (success) {
      return true;
    }
  }
 
  // console.log("s: " + s + " t: " + t);
  // 0-9依次放入当前位置，检查当前位置是否符合数独要求
  for (var k = 0; k < 9; k++) {
    // 该位置有用户输入的数字时，不需要尝试判断修改
    if (answer[i][j] !== 0) {
      continue;
    }
    if (check(i, j, a[k])) {
      sudoku[i][j] = a[k];
      var success = tryFixit(s, t);
      if (success) {
        return true;
      }
      sudoku[i][j] = 0;
    }
  }
  return false;
}

/**
 * 将游戏面板的 DOM Element 保存到一个数组里
 */
function bindTable() {
  var e = document.getElementById("sudoku").firstElementChild;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      table[i].push(e);
      e = e.nextElementSibling;
    }
  }
}

/**
 * 把二维数组 a 中的数据设置到游戏面板上
 */
function setTable(a) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      table[i][j].innerHTML = '<input type="button" class="active"  onclick="clickItem(' + i + ',' + j + ');"/>';
    }
  }
}

/**
 * 更新数据，只更新内容
 */
function showTable(a) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (a[i][j] !== 0) {
        var value;
        if (a[i][j] == -1) {
          value = '?';
        } else {
          value = a[i][j];
        }
        var e = table[i][j].firstElementChild;
        if (e) {
          e.value = value;
        } else {
          table[i][j].innerHTML = value;
        }
      } else {
        var e = table[i][j].firstElementChild;
        if (e) {
          e.value = "";
        } else {
          table[i][j].innerHTML = "";
        }
      }
    }
  }
}

function clear(arr) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      arr[i][j] = 0;
    }
  }
}

/**
 * 复制一个 Numeric 型的二维数组
 */
function copy(arr) {
  var a = [[], [], [], [], [], [], [], [], []];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      a[i].push(arr[i][j]);
    }
  }
  return a;
}

function clickItem(i, j) {
  var inputElement = table[i][j].firstElementChild;

  lastItem.update(i, j, inputElement);
}

function onCardClick(index, e) {
  e.className = 'card touchhover';
  setTimeout(() => {
    e.className = 'card';
  }, 200);

  lastItem.updateInfo(index);
}

class ClickItem {
  ClickItem() {
    this.x = 0;
    this.y = 0;
    this.element = null;
  }

  reset() {
    if (this.element) {
      var name = this.element.className;
      var newName;
      if (answer[this.x][this.y] != 0) {
        newName = 'has_edit';
      } else {
        newName = 'active';
      }
      this.element.className = newName;
    }
  }

  update(i, j, e) {
    this.reset();
    this.x = i;
    this.y = j;
    this.element = e;
    var name = this.element.className;
    this.element.className = 'cur_edit';
  }

  updateInfo(value) {
    if (this.element) {
      // 更新数字时，直接移除标记
      this.element.className = 'cur_edit';

      if (value == -1) {
        answer[this.x][this.y] = 0;
        this.element.value = '';
      } else {
        answer[this.x][this.y] = value;
        this.element.value = value;
      }
    }
  }

}

var lastItem = new ClickItem();

function checkInput(i, j, x) {
  return checkRowinput(i, j, x) && checkColInput(i, j, x) && checkBlockInput(i, j, x);
}

function checkRowinput(row, col, x) {
  for (var j = 0; j < 9; j++) {
    if (j === col) {
      continue;
    }
    var value = sudoku[row][j];
    if (value === 0) {
      continue;
    }
    if (value === x) {
      return false;
    }
  }
  return true;
}

function checkColInput(row, col, x) {
  for (var i = 0; i < 9; i++) {
    if (i === row) {
      continue;
    }
    var value = sudoku[i][col];
    if (value === 0) {
      continue;
    }
    if (value === x) {
      return false;
    }
  }
  return true;
}

function checkBlockInput(row, col, x) {
  var startRow = Math.floor(row / 3) * 3;
  var startCol = Math.floor(col / 3) * 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var posX = startRow + i;
      var posY = startCol + j;
      if (row === posX && col === posY) {
        continue;
      }
      var value = sudoku[posX][posY];
      if (value === 0) {
        continue;
      }
      if (value === x) {
        return false;
      }
    }
  }
  return true;
}

function tryShudu() {
  // console.log(answer);
  sudoku = copy(answer);

  // console.log(sudoku);

  // 检查输入是否符合数独要求
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (sudoku[i][j] !== 0) {
        if (!checkInput(i, j, sudoku[i][j])) {
          showToast("需要输入符合数独要求的数字，确保每一行，每一列，每一个方块内0-9只出现一次");
          return false;
        }
      }
    }
  }

  a.sort(randomComparator);
  var success = tryFixit(0, 0);
  if (!success) {
    showToast("解题失败");
  }
  return success;
}

function showShuduAnswer() {
  if (tryShudu()) {
    showTable(sudoku);
    showToast("解题成功");
  }
}

function reset() {
  showTable(answer);
}

function initTable() {
  clear(sudoku); // 把 sudoku 的值都赋值为 0
  answer = copy(sudoku);
  setTable(answer);

  // initTest();
}

function initTest() {
  clear(answer);
  answer[0][0]=8;
  answer[1][2]=3;
  answer[1][3]=6;
  answer[2][1]=7;
  answer[2][4]=9;
  answer[2][6]=2;
  answer[3][1]=5;
  answer[3][5]=7;
  answer[4][4]=4;
  answer[4][5]=5;
  answer[4][6]=7;
  answer[5][3]=1;
  answer[5][7]=3;
  answer[6][2]=1;
  answer[6][7]=6;
  answer[6][8]=8;
  answer[7][2]=8;
  answer[7][3]=5;
  answer[7][7]=1;
  answer[8][1]=9;
  answer[8][6]=4;

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (answer[i][j] !== 0) {
        var e = table[i][j].firstElementChild;
        if (e) {
          e.className = "has_edit";
          e.value = answer[i][j];
        } else {
          table[i][j].innerHTML = answer[i][j];
          table[i][j].className = "has_edit";
        }
      } else {
        var e = table[i][j].firstElementChild;
        if (e) {
          e.value = "";
        } else {
          table[i][j].innerHTML = "";
        }
      }
    }
  }
}

function showToast(msg,duration){  
  duration=isNaN(duration)?3000:duration;  
  var m = document.createElement('div');  
  m.innerHTML = msg;  
  m.style.cssText="width:auto; padding-left: 20px; padding-right:20px; background:#000; opacity:0.6; height:auto;min-height: 30px; color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:50%; left:50%; transform: translate(-50%, 0); z-index:999999;";  
  document.body.appendChild(m);  
  setTimeout(function() {  
      var d = 0.5;  
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';  
      m.style.opacity = '0';  
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);  
  }, duration);  
} 

(function loading() {
  bindTable();
  initTable();
})();