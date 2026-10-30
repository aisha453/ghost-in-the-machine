# 💀 GHOST IN THE MACHINE (La Máquina de las Ánimas)
### *An Offline, Open-Weight Haunted Terminal & Día de los Muertos Digital Ofrenda Suite*

> **Built for the "Ghost in the Machine" Open-Source AI Challenge**  
> *Honoring the past, channeling lost computational spirits, and preserving sacred memories on 100% sovereign, local hardware.*

---

## 🌟 Overview

**Ghost in the Machine** is an atmospheric, offline-first application powered by open-source AI at its core. It merges Halloween's eerie tech lore with the sacred, celebratory remembrance of **Día de los Muertos (Day of the Dead)**:

1. **📟 The Haunted Terminal (`tty-ghost`)**:
   - Possesses your terminal with retro CRT phosphor scanlines and procedural Web Audio ambient sound.
   - Inspects real hardware vitals (CPU cores, RAM saturation, disk void, active "ghost processes" in Ring-3 memory).
   - Whispers back eerie, poetic commentary on every shell command you run.

2. **🔮 The Digital Séance Chamber**:
   - Channels the spirits of departed pioneers and extinct computing systems across the veil of time:
     - **Ada Lovelace (1843)** — The Analytical Engine & mathematical poetry
     - **Rear Admiral Grace Hopper (1947)** — Compiler genesis & the first literal moth bug
     - **Dennis Ritchie & Ken Thompson (1975)** — Bell Labs Unix v6 & the simplicity of pipes
     - **Apollo 11 AGC (1969)** — Rope core RAM & the critical 1202 program alarm
     - **Macromedia Flash (1996–2020)** — Nostalgic .swf animations & early web independence
     - **Symbolics LISP Machine (1981)** — Esoteric homoiconic recursion & parenthesis magic

3. **🏵️ Altar Digital de Muertos (Día de los Muertos Ofrenda)**:
   - A virtual glowing altar glowing with animated candlelight and falling cempasúchil (marigold) petals.
   - Preserves remembrances for departed loved ones, ancestors, and mentors alongside offerings (*pan de muerto*, *café de olla*, sweet memories).
   - Generates lyrical, bilingual commemorative elegies using local open-weight AI.
   - **100% Private & Sovereign**: Saves all memorial archives locally to disk. Intimate family memories, grief, and ancestral photos never leave your machine and are never uploaded to corporate servers.

4. **⚡ Hardware Necro-Telemetry**:
   - Communicates directly with the physical machine, calculating memory weight, storage crypts, and thread entropy.

---

## 🧠 Open-Source AI Architecture

- **Open-Weight Model Support**: Seamlessly connects to local **Ollama** running open-weight models such as `qwen3-vl:2b`, `llama3.2`, `mistral`, or `phi3`.
- **Autonomous Zero-Latency Spectral Engine**: Built-in deterministic/procedural neural persona engine providing instant responses with 0ms lag, guaranteeing 100% uptime even if the local model is offline or during high CPU contention.
- **Procedural Web Audio Engine**: Generates binaural hums, EVP static bursts, keyboard clicks, and altar chimes in real-time via the browser Web Audio API—requiring **zero external audio files or downloads**.

---

## 🚀 Quickstart Guide

### 1. Requirements
- Python 3.9+
- Standard libraries + `uvicorn` and `starlette` (installed automatically or available in environment)
- Optional: [Ollama](https://ollama.com) running locally with any model (`ollama run qwen3-vl:2b` or `ollama run llama3.2`).

### 2. Launch the Web Interface
Run the Starlette server:
```bash
python app.py
```
Open your browser to:
👉 **`http://127.0.0.1:8888`**

### 3. Launch the Standalone CLI Haunted Shell
For command-line purists who want a haunted shell directly inside PowerShell or Terminal:
```bash
python ghost_cli.py
```
Commands to try in the CLI:
- `diagnose` — Extract live silicon telemetry and ghost processes
- `seance ada_lovelace` — Summon Ada Lovelace
- `ofrenda` — Dedicate a Día de los Muertos memorial
- `whoami`, `ls`, `git status` — Hear the machine whisper back

---

## 📁 Repository Structure

```
ghost-in-the-machine/
├── app.py                      # Starlette async server & API endpoints
├── ghost_cli.py                # Standalone CLI haunted shell companion
├── spectral_engine.py          # Multi-backend AI harness (Ollama + Offline Core)
├── hardware_oracle.py          # Direct OS hardware inspector (CPU, RAM, Disk, Procs)
├── ofrendas_archive.json       # Sovereign local storage of consecrated ofrendas
├── static/
│   ├── css/
│   │   └── ghost.css           # CRT scanlines, candle flames, marigold animations
│   ├── js/
│   │   ├── app.js              # Interactive UI, terminal, séance, ofrenda controller
│   │   └── audio_synth.js      # Procedural Web Audio API sound generator
│   └── index.html              # Gothic retro CRT console interface
├── README.md                   # Project documentation
└── SUBMISSION.md               # Complete Hackathon Submission Write-up
```

---

## 🕯️ Why Open Innovation Matters

See [SUBMISSION.md](SUBMISSION.md) for the complete essay and breakdown on why open-source AI and offline sovereignty are paramount for keeping private family memories alive and resurrecting computational history.
