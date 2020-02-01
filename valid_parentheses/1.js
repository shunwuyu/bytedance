/**
 * 
 * @param {string} s
 * @return {boolean} 
 */
var isValid = function(s) {
  if (!s || s.length < 1) return true; //字符串为空
  var n = s.length; // 字符串长度
  var stack = [];  //数组栈
  //stack 栈的意思  push pop 只在数组的尾顶部插入或删除元素 栈 FILO
  // 在数组的尾部位置插入push, 数组的头部移除 shift() FIFO
  for (var i = 0; i < n; i++) { //时间复杂度O(n)
    var c = s[i];
    // console.log(c);
    // ( )
    if (c == '(') { //如果是左括号 等着右括号来消消乐的
      stack.push(c); //入栈， 数组的最后一个元素， 栈顶元素
    } else {
      // ) 将栈里的元素消一个
      if (stack.length < 1) { //第一个就是)  
        return false //无效
      }
      stack.pop(); //出栈
    }
  }
  return stack.length > 0? false:true;
}

console.log(isValid('()')); // true