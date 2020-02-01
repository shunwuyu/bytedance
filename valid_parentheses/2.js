// 空间复杂度O(1) 不用栈
function isValid(s) {
  if (!s || s.length < 1) {
    return true;
  }

  var n = s.length; // 括号字符串长度
  var sum = 0; //O(1) 用一个变量取代stack
  for (var i = 0; i < n; i++) {
    var c = s[i]; //当前字符
    if (c == '(') {
      sum++; // 代表着原来的入栈
    } else {
      // 右括号
      if(sum == 0) {
        return false;
      } else {
        sum--;
      }
    }
  }
  return sum == 0? true: false; 
}

console.log(isValid('(())('));