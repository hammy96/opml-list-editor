import { stack, listEl } from './data.js';

export const ghost = document.getElementById("ghost-line");

export function enableDrag(li, index){
  let dragging=false;
  li.addEventListener("touchstart", ()=>{ dragging=true; li.classList.add("dragging"); });
  li.addEventListener("touchmove", e=>{
    if(!dragging) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const current = stack[stack.length-1];
    const lis = Array.from(listEl.children);
    let newIndex = current.children.length-1;
    let top = lis[lis.length-1].getBoundingClientRect().bottom;

    for(let i=0;i<lis.length;i++){
      const rect = lis[i].getBoundingClientRect();
      if(touchY < rect.top + rect.height/2){
        newIndex=i; top=rect.top; break;
      }
    }

    ghost.style.top = top+"px";
    ghost.style.display = "block";

    const oldIndex = current.children.indexOf(current.children[index]);
    if(newIndex !== oldIndex){
      const [moved] = current.children.splice(oldIndex,1);
      current.children.splice(newIndex,0,moved);
      import('./data.js').then(m=>m.render());
      index=newIndex;
    }
  });

  li.addEventListener("touchend", ()=>{
    dragging=false;
    li.classList.remove("dragging");
    ghost.style.display="none";
  });
}
