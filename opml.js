import { root, stack, currentItem, render } from './data.js';

export function escapeXML(str){
  return str.replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/\"/g,"&quot;");
}

export function generateOPML(node){
  const isChecked = node.checked?"true":"false";
  let r=`<outline text="${escapeXML(node.text)}" checked="${isChecked}">`;
  node.children.forEach(c=>r+=generateOPML(c));
  r+="</outline>";
  return r;
}

export function saveOPMLBranch(){
  if(!currentItem) return;
  let filename = prompt("Enter filename for this branch:","branch");
  if(!filename) return;
  if(!filename.toLowerCase().endsWith(".opml")) filename+=".opml";
  const content=`<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><head><title>${escapeXML(filename)}</title></head><body>${generateOPML(currentItem)}</body></opml>`;
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([content],{type:"text/xml"}));
  a.download=filename;
  a.click();
}

export function importBranch(){
  const branchFileInput = document.getElementById("branchFileInput");
  branchFileInput.click();
  branchFileInput.onchange = e=>{
    const file = e.target.files[0];
    if(!file || !currentItem) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const parser = new DOMParser();
        const xml = parser.parseFromString(reader.result,"text/xml");
        const body = xml.querySelector("body");
        if(!body) throw new Error("Invalid OPML");
        function parseOutline(outline){
          return {
            text:outline.getAttribute("text")||"Untitled",
            checked:outline.getAttribute("checked")==="true",
            children:Array.from(outline.children)
                        .filter(c=>c.tagName.toLowerCase()==="outline")
                        .map(parseOutline)
          };
        }
        Array.from(body.children).forEach(o=>{
          if(o.tagName.toLowerCase()==="outline") currentItem.children.push(parseOutline(o));
        });
        render();
        alert("Branch imported successfully!");
      }catch(err){ alert("Failed to import branch: "+err.message); }
    };
    reader.readAsText(file);
    branchFileInput.value="";
  };
}

export function setupOPML(){
  document.getElementById("saveBtn").onclick = ()=>{
    let filename = prompt("Enter filename:","mylist");
    if(!filename) return;
    if(!filename.toLowerCase().endsWith(".opml")) filename+=".opml";
    const content=`<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><head><title>${escapeXML(filename)}</title></head><body>${generateOPML(root)}</body></opml>`;
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([content],{type:"text/xml"}));
    a.download=filename;
    a.click();
  };

  const fileInput = document.getElementById("fileInput");
  document.getElementById("importBtn").onclick = ()=>fileInput.click();
  fileInput.onchange = e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const parser = new DOMParser();
        const xml = parser.parseFromString(reader.result,"text/xml");
        const body = xml.querySelector("body");
        if(!body) throw new Error("Invalid OPML");
        function parseOutline(outline){
          return {
            text:outline.getAttribute("text")||"Untitled",
            checked:outline.getAttribute("checked")==="true",
            children:Array.from(outline.children).filter(c=>c.tagName.toLowerCase()==="outline").map(parseOutline)
          };
        }
        root.children=[];
        Array.from(body.children).forEach(o=>{
          if(o.tagName.toLowerCase()==="outline") root.children.push(parseOutline(o));
        });
        stack.length=1;
        render();
        alert("OPML imported successfully!");
      }catch(err){ alert("Failed to import OPML: "+err.message); }
    };
    reader.readAsText(file);
    fileInput.value="";
  };
}
