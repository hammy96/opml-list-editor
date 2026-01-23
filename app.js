
// app.js
window.render();
window.backBtn.onclick = () => {
  if(window.stack.length>1){
    window.stack.pop();
    window.render();
  }
};
document.getElementById("addBtn").onclick = () => {
  const name = prompt("New item name:");
  if(!name) return;
  window.stack[window.stack.length-1].children.push({ text:name, children:[], checked:false });
  window.render();
};

window.setupActionSheet();
window.setupOPML();
