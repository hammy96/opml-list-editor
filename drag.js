import { stack } from "./state.js";
import { render } from "./render.js";

const listEl = document.getElementById("list");
const ghost = document.getElementById("ghost-line");

export function enableDrag(li, index) {
  let dragging = false;

  li.addEventListener("touchstart", () => {
    dragging = true;
    li.classList.add("dragging");
  });

  li.addEventListener("touchmove", e => {
    // ✅ CHANGE: allow two-finger scrolling
    if (e.touches.length > 1) return;

    e.preventDefault();

    if (!dragging) return;

    const touchY = e.touches[0].clientY;
    const current = stack[stack.length - 1];
    const lis = Array.from(listEl.children);

    let newIndex = current.children.length - 1;
    let top = lis[lis.length - 1].getBoundingClientRect().bottom;

    for (let i = 0; i < lis.length; i++) {
      const rect = lis[i].getBoundingClientRect();
      if (touchY < rect.top + rect.height / 2) {
        newIndex = i;
        top = rect.top;
        break;
      }
    }

    ghost.style.top = top + "px";
    ghost.style.display = "block";

    const oldIndex = current.children.indexOf(current.children[index]);
    if (newIndex !== oldIndex) {
      const [moved] = current.children.splice(oldIndex, 1);
      current.children.splice(newIndex, 0, moved);
      render();
      index = newIndex;
    }
  });

  li.addEventListener("touchend", () => {
    dragging = false;
    li.classList.remove("dragging");
    ghost.style.display = "none";
  });
}
