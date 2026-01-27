function escapeXML(s) {
  return s.replace(/[<>&"]/g, c =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c])
  );
}

function nodeToOPML(node, indent = "    ") {
  const childIndent = indent + "  ";
  let r = `${indent}<outline text="${escapeXML(node.text)}">`;
  if (node.children.length) {
    r += "\n" + node.children.map(c => nodeToOPML(c, childIndent)).join("\n");
    r += `\n${indent}</outline>`;
  } else r += "</outline>";
  return r;
}

function exportOPML(node) {
  const body = node.children.map(c => nodeToOPML(c)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><body>${body}</body></opml>`;
}

function saveOPML() {
  download(exportOPML(root), "outline.opml");
}

function loadOPML() {
  pickFile(text => {
    const doc = new DOMParser().parseFromString(text, "text/xml");
    root.children = [...doc.querySelectorAll("body > outline")].map(parseOutline);
    currentNode = root;
    parentMap.clear();
    render(root.children);
    scheduleSave?.();
  });
}

function exportBranch() {
  download(exportOPML({ children: [selectedNode] }), "branch.opml");
  closeSheet();
}

function importBranch() {
  pickFile(text => {
    const doc = new DOMParser().parseFromString(text, "text/xml");
    [...doc.querySelectorAll("body > outline")]
      .map(parseOutline)
      .forEach(n => selectedNode.children.push(n));
    closeSheet();
    render(currentNode.children);
    scheduleSave?.();
  });
}

function parseOutline(el) {
  const n = createNode(el.getAttribute("text") || "");
  el.querySelectorAll(":scope > outline").forEach(c =>
    n.children.push(parseOutline(c))
  );
  return n;
}

function pickFile(cb) {
  const i = document.createElement("input");
  i.type = "file";
  i.accept = ".opml,.xml";
  i.onchange = () => {
    const r = new FileReader();
    r.onload = () => cb(r.result);
    r.readAsText(i.files[0]);
  };
  i.click();
}

function download(text, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/xml" }));
  a.download = name;
  a.click();
}
