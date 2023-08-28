const input = ["a", "b", "c"];

// for (let i = 97; i < 123; i++) {
//   console.log(String.fromCharCode(i));
// }

let i = 0;
let inputIteration = 0;
setInterval((interval) => {
  console.log(interval);
  if (String.fromCharCode(i) === input[inputIteration]) {
  }
  i++;
}, 500);
