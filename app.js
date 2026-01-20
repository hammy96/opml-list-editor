import { root, stack, render, listEl, titleEl, backBtn } from './data.js';
import { enableDrag } from './drag.js';
import { setupActionSheet } from './actions.js';
import { setupOPML } from './opml.js';

// ----- INITIAL RENDER -----
render();

// ----- NAVIGATION -----
backBtn.onclick = () => { if(stack.length>1){ stack.pop(); render(); } };
document.getElementById("addBtn").onclick = () => {
  const name = prompt("New item name:");
  if(!name) return;
  stack[stack.length-1].children.push({ text:name, children:[], checked:false });
  render();
};

// ----- SETUP -----
setupActionSheet();
setupOPML();
