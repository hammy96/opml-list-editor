const SLOT_A = "app.save.A";
const SLOT_B = "app.save.B";
const ACTIVE = "app.save.active";

function getNodePath(node) {
  const path = [];
  while (node && node !== root) {
    path.unshift(node.id);
    node = parentMap.get(node);
  }
  return path;
}

function getNodeByPath(path) {
  let node = root;
  for (const id of path) {
    node = node.children.find(c => c.id === id);
    if (!node) return root;
  }
  return node;
}

function serializeState() {
  return { root, idCounter, currentNodePath: getNodePath(currentNode) };
}

function restoreState(state) {
  idCounter = state.idCounter;
  root.children = state.root.children;
  parentMap.clear();
  currentNode = getNodeByPath(state.currentNodePath);
}

async function checksum(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function saveState() {
  const json = JSON.stringify(serializeState());
  const hash = await checksum(json);
  const slot = localStorage.getItem(ACTIVE) === "A" ? "B" : "A";
  localStorage.setItem(slot === "A" ? SLOT_A : SLOT_B,
    JSON.stringify({ timestamp: Date.now(), payload: json, checksum: hash })
  );
  localStorage.setItem(ACTIVE, slot);
}

async function loadState() {
  async function read(k) {
    const r = localStorage.getItem(k);
    if (!r) return null;
    const o = JSON.parse(r);
    return (await checksum(o.payload)) === o.checksum ? o : null;
  }
  const a = await read(SLOT_A);
  const b = await read(SLOT_B);
  const c = a && b ? (a.timestamp > b.timestamp ? a : b) : (a || b);
  if (c) restoreState(JSON.parse(c.payload));
}

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 1000);
}
