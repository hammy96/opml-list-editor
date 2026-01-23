
// drag.js
window.ghost = document.getElementById("ghost-line");

window.enableDrag = function(li, index){
  let dragging=false;
  li.addEventListener("touchstart", ()=>{
    dragging=true; li.classList.add("dragging");
  });
  li.addEventListener("touchmove", e=>{
    if(!dragging) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const current = window.stack[window.stack.length-1];
    const lis = Array.from(window.listEl.children);
    let newIndex = current.children.length-1;
    let top = lis[lis.length-1].getBoundingClientRect().bottom;
    for(let i=0;i<lis.length;i++){
      const rect = lis[i].getBoundingClientRect();
      if(touchY < rect.top + rect.height/2){
        newIndex=i; top=rect.top; break;
      }
    }
    window.ghost.style.top = top+"px";
    window.ghost.style.display = "block";
    const oldIndex = current.children.indexOf(current.children[index]);
    if(newIndex !== oldIndex){
      const [moved] = current.children.splice(oldIndex,1);
      current.children.splice(newIndex,0,moved);
      window.render();
      index=newIndex;
    }
  });
  li.addEventListener("touchend", ()=>{
    dragging=false;
    li.classList.remove("dragging");
    window.ghost.style.display="none";
  });
};
