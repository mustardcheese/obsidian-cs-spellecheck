// Run: node test.js — stubs Obsidian/CodeMirror and checks which words get spellcheck disabled.
const Module = require("module"), fs = require("fs"), assert = require("assert");
const load = Module._load;
Module._load = (n, ...a) =>
  n === "obsidian" ? { Plugin: class { registerEditorExtension(e) { this.ext = e; } } }
  : n === "@codemirror/view" ? { ViewPlugin: { define: () => ({}) }, Decoration: { mark: () => "SKIP" },
      MatchDecorator: class { constructor(c) { globalThis.cfg = c; } } }
  : load(n, ...a);
const P = require("./main.js");
const p = new P();
p.app = { vault: { adapter: { read: async () => fs.readFileSync(__dirname + "/words.txt", "utf8") } } };
p.manifest = { dir: "." };
p.onload().then(() => {
  const skipped = (w) => cfg.decoration([w]) === "SKIP";
  for (const w of "ROB1 ROB100 x86 0xFFFF IPC ROBs NIC’s Tomasulo Tomasulo's Tomasulos superscalar Superscalar mutexes syscalls inodes dendrogram".split(" "))
    assert(skipped(w), `should skip ${w}`);
  for (const w of "recieve teh commited Compsability superscaler tomasolu mutx".split(" "))
    assert(!skipped(w), `should check ${w}`);
  console.log("ok");
});
