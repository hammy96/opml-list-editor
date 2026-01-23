// data.js

// Root data structure
window.root = {
  text: "Root",
  checked: false,
  children: [
    { text: "one", checked: false, children: [] },
    { text: "two", checked: false, children: [] },
    { text: "three", checked: false, children: [] },
    { text: "four", checked: false, children: [] },
    { text: "five", checked: false, children: [] }
  ]
};

// Navigation stack
window.stack = [window.root];

// DOM references
window.listEl = document.getElementById("list");
window.titleEl = document.getElementById("title");
window.backBtn = document.getElementById("backBtn");

// Currently selected item (for action sheet)
window.currentItem = null;

// Clipboard for Cut / Paste Branch
window.clipboardBranch = null;

// Render function
window.render = function () {
  const current = window.stack[window.stack.length - 1];

  window.titleEl.textContent = current.text;
  window.backBtn.disabled = window.stack.length === 1;
  window.listEl.innerHTML = "";

  current.children.forEach((item, index) => {
    const li = document.createElement("li");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!item.checked;
    checkbox.style.marginRight = "0.5rem";
    checkbox.style.width = "2rem";
    checkbox.style.height = "2rem";
    checkbox.onchange = () => {
      item.checked = checkbox.checked;
    };
    li.appendChild(checkbox);

    // Label
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = item.text;
    label.onclick = () => {
      window.currentItem = item;
      document.getElementById("action-sheet").style.bottom = "0";
    };
    li.appendChild(label);

    // Enter child list
    if (item.children.length) {
      const enter = document.createElement("div");
      enter.className = "enter";
      enter.textContent = "▶";
      enter.onclick = () => {
        window.stack.push(item);
        window.render();
      };
      li.appendChild(enter);
    }

    // Drag support
    window.enableDrag(li, index);

    window.listEl.appendChild(li);
  });
};
