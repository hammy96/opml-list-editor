// opml.js
// OPML import/export utilities (no ES modules)

/* ---------- Utilities ---------- */

window.escapeXML = function (str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

window.generateOPML = function (node) {
  const checked = node.checked ? "true" : "false";
  let out = `<outline text="${window.escapeXML(node.text)}" checked="${checked}">`;

  node.children.forEach(child => {
    out += window.generateOPML(child);
  });

  out += "</outline>";
  return out;
};

/* ---------- Export FULL TREE ---------- */

window.setupOPML = function () {
  // Save entire outline
  document.getElementById("saveBtn").onclick = () => {
    let filename = prompt("Enter filename:", "mylist");
    if (!filename) return;

    if (!filename.toLowerCase().endsWith(".opml")) {
      filename += ".opml";
    }

    const content =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<opml version="2.0">` +
      `<head><title>${window.escapeXML(filename)}</title></head>` +
      `<body>${window.generateOPML(window.root)}</body>` +
      `</opml>`;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/xml" }));
    a.download = filename;
    a.click();
  };

  // Import entire outline
  const fileInput = document.getElementById("fileInput");
  document.getElementById("importBtn").onclick = () => fileInput.click();

  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(reader.result, "text/xml");
        const body = xml.querySelector("body");
        if (!body) throw new Error("Invalid OPML");

        function parseOutline(outline) {
          return {
            text: outline.getAttribute("text") || "Untitled",
            checked: outline.getAttribute("checked") === "true",
            children: Array.from(outline.children)
              .filter(c => c.tagName.toLowerCase() === "outline")
              .map(parseOutline)
          };
        }

        window.root.children = [];
        Array.from(body.children).forEach(o => {
          if (o.tagName.toLowerCase() === "outline") {
            window.root.children.push(parseOutline(o));
          }
        });

        window.stack.length = 1;
        window.render();
        alert("OPML imported successfully!");
      } catch (err) {
        alert("Failed to import OPML: " + err.message);
      }
    };

    reader.readAsText(file);
    fileInput.value = "";
  };
};

/* ---------- Export SELECTED BRANCH ---------- */

window.saveOPMLBranch = function () {
  if (!window.currentItem) return;

  let filename = prompt("Enter filename for this branch:", "branch");
  if (!filename) return;

  if (!filename.toLowerCase().endsWith(".opml")) {
    filename += ".opml";
  }

  const content =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<opml version="2.0">` +
    `<head><title>${window.escapeXML(filename)}</title></head>` +
    `<body>${window.generateOPML(window.currentItem)}</body>` +
    `</opml>`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/xml" }));
  a.download = filename;
  a.click();
};

/* ---------- Import INTO SELECTED BRANCH ---------- */

window.importBranch = function () {
  const input = document.getElementById("branchFileInput");
  input.click();

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file || !window.currentItem) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(reader.result, "text/xml");
        const body = xml.querySelector("body");
        if (!body) throw new Error("Invalid OPML");

        function parseOutline(outline) {
          return {
            text: outline.getAttribute("text") || "Untitled",
            checked: outline.getAttribute("checked") === "true",
            children: Array.from(outline.children)
              .filter(c => c.tagName.toLowerCase() === "outline")
              .map(parseOutline)
          };
        }

        Array.from(body.children).forEach(o => {
          if (o.tagName.toLowerCase() === "outline") {
            window.currentItem.children.push(parseOutline(o));
          }
        });

        window.render();
        alert("Branch imported successfully!");
      } catch (err) {
        alert("Failed to import branch: " + err.message);
      }
    };

    reader.readAsText(file);
    input.value = "";
  };
};
