const { Plugin } = require("obsidian");
const { ViewPlugin, MatchDecorator, Decoration } = require("@codemirror/view");

// Tokens containing a digit (ROB1, fd2, x86, 0xFFFF) or ALL-CAPS acronyms with optional plural/possessive (IPC, ROBs, NIC's).
// ponytail: the ALL-CAPS rule also hides typos in shouted words; narrow it if that ever matters.
const TECH = /^(?:\w*\d\w*|[A-Z]{2,}(?:['’]?s)?)$/;
const WORD = /\b[A-Za-z0-9]+(?:['’][A-Za-z]+)?\b/g;
const SKIP = Decoration.mark({ attributes: { spellcheck: "false" } });

// Known term, or a plural/possessive of one: mutexes, ROBs, Tomasulo's.
const known = (terms, w) => {
  w = w.toLowerCase().replace(/['’]s?$/, "");
  return terms.has(w) || (w.endsWith("s") && terms.has(w.slice(0, -1))) || (w.endsWith("es") && terms.has(w.slice(0, -2)));
};

const skipTech = (terms) => {
  const decorator = new MatchDecorator({
    regexp: WORD,
    decoration: (m) => (TECH.test(m[0]) || known(terms, m[0]) ? SKIP : null),
  });
  return ViewPlugin.define(
    (view) => ({
      decorations: decorator.createDeco(view),
      update(u) { this.decorations = decorator.updateDeco(u, this.decorations); },
    }),
    { decorations: (v) => v.decorations }
  );
};

module.exports = class SmartSpellcheck extends Plugin {
  async onload() {
    const text = await this.app.vault.adapter.read(`${this.manifest.dir}/words.txt`).catch(() => "");
    const terms = new Set(text.split("\n").map((l) => l.trim().toLowerCase()).filter((l) => l && !l.startsWith("#")));
    this.registerEditorExtension(skipTech(terms));
  }
};

