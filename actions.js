import { currentItem, stack, render } from './data.js';
import { addChildAndEnter } from './utils.js';
import { saveOPMLBranch, importBranch } from './opml.js';

export function setupActionSheet(){
  const actionSheet = document.getElementById("action-sheet");
  document.getElementById("addChildBtn").onclick = ()=>{
    if(!currentItem) return;
    addChildAndEnter(currentItem);
    hideActionSheet();
  };
  document.getElementById("editBtn").onclick = ()=>{
    if(!currentItem) return;
    const name = prompt("Edit item name:", currentItem.text);
    if(name) { currentItem.text=name; render(); }
    hideActionSheet();
  };
  document.getElementById("deleteBtn").onclick = ()=>{
    if(!currentItem) return;
    const current = stack[stack.length-1];
    const index = current.children.indexOf(currentItem);
    if(index>=0 && confirm(`Delete "${currentItem.text}"?`)){
      current.children.splice(index,1);
      render();
    }
    hideActionSheet();
  };
  document.getElementById("exportBranchBtn").onclick = saveOPMLBranch;
  document.getElementById("importBranchBtn").onclick = importBranch;
  document.getElementById("cancelBtn").onclick = hideActionSheet;

  function hideActionSheet(){ actionSheet.style.bottom="-350px"; currentItem=null; }
}
