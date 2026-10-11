# Smart Spellcheck

Obsidian plugin that stops spellcheck from flagging technical tokens in CS notes:

- words containing a digit: `ROB1`, `ROB100`, `x86`, `0xFFFF`, `ext4`
- ALL-CAPS acronyms (with optional plural/possessive): `IPC`, `TCP`, `ROBs`, `NIC's`
- ~1300 CS terms in `words.txt` (architecture, OS, networking, algorithms, theory, compilers, databases, ML, security): `superscalar`, `Tomasulo's`, `mutexes`, `dendrogram`

Everything else is still spellchecked normally.

## Install

Copy `main.js`, `manifest.json` and `words.txt` into `<vault>/.obsidian/plugins/smart-spellcheck/`, then enable **Smart Spellcheck** under Settings → Community plugins.

## How it works

A CodeMirror 6 editor extension marks matching words with `spellcheck="false"`, which Chromium's spellchecker skips. The regex is the `TECH` constant in `main.js` if you want to tweak what gets skipped. Add terms to `words.txt` (one per line, case-insensitive, plurals handled) and reload the plugin.

`node test.js` checks which words are skipped.

`clean_dict.py` is a one-off personal script for pruning Obsidian's `Custom Dictionary.txt` (Linux path, run with Obsidian closed). It isn't part of the plugin.
