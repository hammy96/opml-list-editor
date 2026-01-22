// actions.js
window.setupActionSheet = function(){
  const actionSheet = document.getElementById("action-sheet");

  document.getElementById("addChildBtn").onclick = ()=>{
    if(!window.currentItem) return;
    const name = prompt("New item name:");
    if(!name) return;
    window.currentItem.children.push({ text:name, children:[], checked:false });
    window.render();
    hideActionSheet();
  };

  document.getElementById("editBtn").onclick = ()=>{
    if(!window.currentItem) return;
    const name = prompt("Edit item name:", window.currentItem.text);
    if(name) { window.currentItem.text=name; window.render(); }
    hideActionSheet();
  };

  document.getElementById("deleteBtn").onclick = ()=>{
    if(!window.currentItem) return;
    const current = window.stack[window.stack.length-1];
    const index = current.children.indexOf(window.currentItem);
    if(index>=0 && confirm(`Delete "${window.currentItem.text}"?`)){
      current.children.splice(index,1);
      window.render();
    }
    hideActionSheet();
  };

  document.getElementById("exportBranchBtn").onclick = window.saveOPMLBranch;
  document.getElementById("importBranchBtn").onclick = window.importBranch;
  document.getElementById("cancelBtn").onclick = hideActionSheet;

  function hideActionSheet(){ actionSheet.style.bottom="-350px"; window.currentItem=null; }
};
