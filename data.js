// data.js
window.root = {
  text: "Root",
  checked: false,
  children: [
    { text:"one", checked:false, children:[] },
    { text:"two", checked:false, children:[] },
    { text:"three", checked:false, children:[] },
    { text:"four", checked:false, children:[] },
    { text:"five", checked:false, children:[] }
  ]
};

window.stack = [window.root];
window.listEl = document.getElementById("list");
window.titleEl = document.getElementById("title");
window.backBtn = document.getElementById("backBtn");
window.currentItem = null;

window.render = function() {
  const current = window.stack[window.stack.length-1];
  window.titleEl.textContent = current.text;
  window.backBtn.disabled = window.stack.length === 1;
  window.listEl.innerHTML = "";

  current.children.forEach((item, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!item.checked;
    checkbox.style.marginRight = "0.5rem";
    checkbox.style.width = "2rem";
    checkbox.style.height = "2rem";
    checkbox.onchange = () => { item.checked = checkbox.checked; };
    li.appendChild(checkbox);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = item.text;
    label.onclick = () => {
      window.currentItem = item;
      document.getElementById("action-sheet").style.bottom="0";
    };
    li.appendChild(label);

    if(item.children.length){
      const enter = document.createElement("div");
      enter.className="enter";
      enter.textContent="▶";
      enter.onclick = () => { window.stack.push(item); window.render(); };
      li.appendChild(enter);
    }

    window.enableDrag(li, index);
    window.listEl.appendChild(li);
  });
};
