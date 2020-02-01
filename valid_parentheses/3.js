function longestValidParentheses(s) {
  //最长有效匹配括号长度 leetcode32
  // 有效括号的升级版 + 长度
  var max = 0; //最大长度
  if (s.length == 0 || s.length == 1) return max; //没得匹配
  var stack = []; //使用了栈来实现匹配  空间复杂度O(n)
  // 嵌套循环  比较一下
  // 每位括号它的有效匹配长度是可以跟有效匹配是一样的
  for (var i = 0; i < s.length; i++) {
    var tmpMax = 0; //当前位括号的匹配长度 重新开始
    for (var j = i; j < s.length; j++) { //从i开始， 自己也算+1
      if(s[j] == '(') { //左括号
        stack.push('('); //入栈
        tmpMax++;
      } else if (s[j] == ')') {
        //右括号
        if (stack.length < 1) {
          //栈空的，当前位置括号有效匹配， 结束了 算
          max = max<tmpMax?tmpMax:max;
          break;
        } else {
          stack.pop(); //出栈
          tmpMax++;
        }
      }
    }
    if (stack.length == 0) { //都匹配 从当前位置到最后一个字符都是有效括号， 
      max = max < tmpMax?tmpMax:max
    }
    stack = []; //清空为本次括号的服务
  }
  return max;
}

console.log(longestValidParentheses(')()())'));
console.log(longestValidParentheses('((((('));