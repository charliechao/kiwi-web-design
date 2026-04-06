@echo off
cd /d "C:\Users\Home\Desktop\Claude Cowork\KWD_New_AI_site"
"C:\Program Files\nodejs\node.exe" node_modules\astro\astro.js dev --host 127.0.0.1 > ".codex-dev.log" 2> ".codex-dev.err"

