// actions.js

window.setupActionSheet = function () {
  const actionSheet = document.getElementById("action-sheet");

  // Add child
  document.getElementById("addChildBtn").onclick = () => {
    if (!window.currentItem) return;
    const name = prompt("New item name:");
    if (!name) return;
    window.currentItem.children.push({
      text: name,
      children: [],
      checked: false
    });
    window.render();
    hideActionSheet();
  };

  // Edit item
  document.getElementById("editBtn").onclick = () => {
    if (!window.currentItem) return;
    const name = prompt("Edit item name:", window.currentItem.text);
    if (name) {
      window.currentItem.text = name;
      window.render();
    }
    hideActionSheet();
  };

  // ✂️ Cut branch
  document.getElementById("cutBranchBtn").onclick = () => {
    if (!window.currentItem) return;

    const current = window.stack[window.stack.length - 1];
    const index = current.children.indexOf(window.currentItem);
    if (index < 0) return;

    // Deep copy to clipboard
    window.clipboardBranch = JSON.parse(
      JSON.stringify(window.currentItem)
    );

    // Remove from parent
    current.children.splice(index, 1);

    window.render();
    hideActionSheet();
  };

  // 📋 Paste branch
  document.getElementById("pasteBranchBtn").onclick = () => {
    if (!window.currentItem || !window.clipboardBranch) return;

    // Deep copy again so clipboard can be reused
    const pasted = JSON.parse(
      JSON.stringify(window.clipboardBranch)
    );

    window.currentItem.children.push(pasted);

    window.render();
    hideActionSheet();
  };

  // Delete item
  document.getElementById("deleteBtn").onclick = () => {
    if (!window.currentItem) return;

    const current = window.stack[window.stack.length - 1];
    const index = current.children.indexOf(window.currentItem);

    if (
      index >= 0 &&
      confirm(`Delete "${window.currentItem.text}"?`)
    ) {
      current.children.splice(index, 1);
      window.render();
    }

    hideActionSheet();
  };

  // OPML actions
  document.getElementById("exportBranchBtn").onclick =
    window.saveOPMLBranch;
  document.getElementById("importBranchBtn").onclick =
    window.importBranch;

  // Cancel
  document.getElementById("cancelBtn").onclick = hideActionSheet;

  function hideActionSheet() {
    actionSheet.style.bottom = "-350px";
    window.currentItem = null;
  }
};
