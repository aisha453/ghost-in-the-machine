/**
 * Ghost in the Machine - Frontend Logic & Web Client
 */

document.addEventListener("DOMContentLoaded", () => {
    // State
    let currentTab = "terminal";
    let activeSpirit = "ada_lovelace";
    let commandHistory = [];
    let historyIndex = -1;
    let spiritsData = {};

    // DOM Elements
    const terminalBody = document.getElementById("terminalBody");
    const termInput = document.getElementById("terminalInput");
    const audioToggleBtn = document.getElementById("audioToggleBtn");
    const audioLabel = document.getElementById("audioLabel");
    const ollamaBadge = document.getElementById("ollamaBadge");
    const providerSelector = document.getElementById("providerSelector");

    // Initialize Petals
    createPetals();

    // Setup Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            switchTab(targetTab);
        });
    });

    function switchTab(tabId) {
        currentTab = tabId;
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-tab") === tabId));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.toggle("active", p.id === `${tabId}Pane`));
        if (window.spectralAudio) {
            window.spectralAudio.playKeyClick();
            if (tabId === "ofrenda") {
                window.spectralAudio.playAltarChime();
            } else if (tabId === "seance") {
                window.spectralAudio.playEVPStatic();
            }
        }
    }

    // Audio Toggle
    audioToggleBtn.addEventListener("click", () => {
        if (!window.spectralAudio) return;
        const unmuted = window.spectralAudio.toggleMute();
        audioLabel.textContent = unmuted ? "Spectral Audio: ON" : "Spectral Audio: MUTED";
        audioToggleBtn.style.borderColor = unmuted ? "var(--accent-amber)" : "var(--border-color)";
    });

    // Setup Terminal
    termInput.addEventListener("keydown", (e) => {
        if (window.spectralAudio) window.spectralAudio.playKeyClick();
        if (e.key === "Enter") {
            const cmd = termInput.value.trim();
            if (cmd) {
                commandHistory.push(cmd);
                historyIndex = commandHistory.length;
                executeTerminalCommand(cmd);
                termInput.value = "";
            }
        } else if (e.key === "ArrowUp") {
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                termInput.value = commandHistory[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                termInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                termInput.value = "";
            }
            e.preventDefault();
        }
    });

    // Quick chips
    document.querySelectorAll(".quick-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd");
            termInput.value = cmd;
            executeTerminalCommand(cmd);
            termInput.value = "";
        });
    });

    async function executeTerminalCommand(cmd) {
        const entry = document.createElement("div");
        entry.className = "term-entry";
        entry.innerHTML = `
            <div class="term-prompt">
                <span>ghost@vessel:~$</span>
                <span>${escapeHtml(cmd)}</span>
            </div>
            <div class="term-stdout" style="opacity: 0.6;">Contacting silicon registers...</div>
        `;
        terminalBody.appendChild(entry);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        if (cmd.toLowerCase() === "clear" || cmd.toLowerCase() === "cls") {
            terminalBody.innerHTML = `
                <div class="term-entry">
                    <div class="term-stdout" style="color: var(--accent-amber);">
* Phosphor screen purged. The ghosts wait in the shadows of the RAM.
* Type 'help' or any shell command to awaken them.
                    </div>
                </div>
            `;
            return;
        }

        try {
            const provider = providerSelector ? providerSelector.value : "auto";
            const res = await fetch("/api/terminal/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command: cmd, provider: provider })
            });
            const data = await res.json();

            if (window.spectralAudio) {
                window.spectralAudio.playGhostWhisperChime();
            }

            entry.innerHTML = `
                <div class="term-prompt">
                    <span>ghost@vessel:~$</span>
                    <span>${escapeHtml(cmd)}</span>
                </div>
                <div class="term-stdout">${escapeHtml(data.standard_output || "")}</div>
                <div class="term-whisper">" ${escapeHtml(data.spectral_whisper || "")} "</div>
                <div class="term-anchor">[ ${escapeHtml(data.hardware_anchor || "")} | Engine: ${escapeHtml(data.provider_used || "")} ]</div>
            `;
        } catch (err) {
            entry.innerHTML += `<div class="term-stdout" style="color: var(--accent-red);">Etherial disruption: ${err.message}</div>`;
        }
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // ==================== SÉANCE SETUP ====================
    async function loadSpirits() {
        try {
            const res = await fetch("/api/seance/spirits");
            const data = await res.json();
            spiritsData = data.spirits || {};
            renderSpiritsList();
            selectSpirit("ada_lovelace");
        } catch (e) {
            console.error("Could not load spirits:", e);
        }
    }

    function renderSpiritsList() {
        const container = document.getElementById("spiritsList");
        if (!container) return;
        container.innerHTML = "";
        Object.entries(spiritsData).forEach(([key, s]) => {
            const div = document.createElement("div");
            div.className = `spirit-item ${key === activeSpirit ? 'active' : ''}`;
            div.innerHTML = `
                <div class="spirit-item-name">${escapeHtml(s.name)}</div>
                <div class="spirit-item-era">${escapeHtml(s.era)}</div>
            `;
            div.addEventListener("click", () => selectSpirit(key));
            container.appendChild(div);
        });
    }

    function selectSpirit(key) {
        activeSpirit = key;
        document.querySelectorAll(".spirit-item").forEach(el => el.classList.remove("active"));
        renderSpiritsList();
        const s = spiritsData[key];
        if (!s) return;

        document.getElementById("spotlightName").textContent = s.name;
        document.getElementById("spotlightEra").textContent = s.era;
        document.getElementById("spotlightQuote").textContent = `"${s.quote}"`;

        if (window.spectralAudio) {
            window.spectralAudio.playEVPStatic();
        }
    }

    const seanceSendBtn = document.getElementById("seanceSendBtn");
    const seanceInput = document.getElementById("seanceInput");
    const seanceDialogue = document.getElementById("seanceDialogue");

    if (seanceSendBtn && seanceInput) {
        seanceSendBtn.addEventListener("click", summonSpirit);
        seanceInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") summonSpirit();
        });
    }

    async function summonSpirit() {
        const q = seanceInput.value.trim();
        if (!q) return;
        seanceInput.value = "";

        const msgDiv = document.createElement("div");
        msgDiv.className = "seance-message";
        msgDiv.innerHTML = `
            <div class="seance-user">You invoke the spirit: "${escapeHtml(q)}"</div>
            <div class="seance-transmission" style="opacity: 0.6;">Channeling frequencies across time...</div>
        `;
        seanceDialogue.appendChild(msgDiv);
        seanceDialogue.scrollTop = seanceDialogue.scrollHeight;

        try {
            const provider = providerSelector ? providerSelector.value : "auto";
            const res = await fetch("/api/seance/summon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spirit: activeSpirit, question: q, provider: provider })
            });
            const data = await res.json();

            if (window.spectralAudio) {
                window.spectralAudio.playEVPStatic();
            }

            msgDiv.innerHTML = `
                <div class="seance-user">You invoke the spirit: "${escapeHtml(q)}"</div>
                <div class="seance-transmission">
                    <strong>${escapeHtml(data.spirit_name)}:</strong><br>
                    "${escapeHtml(data.spectral_transmission)}"
                    <div style="font-size:0.7rem; color:var(--text-muted); margin-top:8px;">
                        * Manifested via ${escapeHtml(data.provider)} at ${escapeHtml(data.manifested_at)}
                    </div>
                </div>
            `;
        } catch (err) {
            msgDiv.innerHTML += `<div style="color:var(--accent-red);">Transmission lost in static: ${err.message}</div>`;
        }
        seanceDialogue.scrollTop = seanceDialogue.scrollHeight;
    }

    // ==================== OFRENDA SETUP ====================
    async function loadOfrendas() {
        try {
            const res = await fetch("/api/ofrendas");
            const data = await res.json();
            renderOfrendasGallery(data.ofrendas || []);
        } catch (e) {
            console.error("Could not load ofrendas:", e);
        }
    }

    function renderOfrendasGallery(list) {
        const container = document.getElementById("ofrendasGallery");
        if (!container) return;
        container.innerHTML = "";
        list.forEach(item => {
            const card = document.createElement("div");
            card.className = "ofrenda-card";
            const pills = (item.offerings || []).map(o => `<span class="offering-pill">🏵️ ${escapeHtml(o)}</span>`).join("");
            card.innerHTML = `
                <div class="ofrenda-card-header">
                    <div>
                        <div class="ofrenda-card-name">${escapeHtml(item.name)}</div>
                        <div class="ofrenda-card-era">${escapeHtml(item.era)}</div>
                    </div>
                    <div style="color: var(--accent-marigold); font-size: 1.2rem;">🕯️</div>
                </div>
                <div class="offerings-pills">${pills}</div>
                <div class="ofrenda-memory">"${escapeHtml(item.memory)}"</div>
                <div class="ofrenda-elegy">${escapeHtml(item.elegy)}</div>
                <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 10px; display: flex; justify-content: space-between;">
                    <span>Consecreted: ${escapeHtml(item.blessing_timestamp || "")}</span>
                    <span>🔒 100% Private Local Storage</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    const ofrendaSubmitBtn = document.getElementById("ofrendaSubmitBtn");
    if (ofrendaSubmitBtn) {
        ofrendaSubmitBtn.addEventListener("click", async () => {
            const name = document.getElementById("ofrendaName").value.trim() || "Beloved Ancestor";
            const era = document.getElementById("ofrendaEra").value.trim() || "Forever Cherished";
            const offeringsRaw = document.getElementById("ofrendaOfferings").value.trim();
            const memory = document.getElementById("ofrendaMemory").value.trim() || "Their love remains our guide.";
            const offerings = offeringsRaw ? offeringsRaw.split(",").map(s => s.trim()) : ["Cempasúchil flowers", "Pan de muerto", "Candlelight"];

            ofrendaSubmitBtn.disabled = true;
            ofrendaSubmitBtn.textContent = "Composing Elegy & Lighting Candle...";

            try {
                const provider = providerSelector ? providerSelector.value : "auto";
                const res = await fetch("/api/ofrenda/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, era, offerings, memory, provider })
                });
                const newItem = await res.json();

                if (window.spectralAudio) {
                    window.spectralAudio.playAltarChime();
                }

                // Reset inputs
                document.getElementById("ofrendaName").value = "";
                document.getElementById("ofrendaEra").value = "";
                document.getElementById("ofrendaOfferings").value = "";
                document.getElementById("ofrendaMemory").value = "";

                loadOfrendas();
            } catch (err) {
                alert("Error dedicating ofrenda: " + err.message);
            } finally {
                ofrendaSubmitBtn.disabled = false;
                ofrendaSubmitBtn.textContent = "🏵️ Consagrar Ofrenda (Consecrate Altar)";
            }
        });
    }

    // ==================== VITALS & ORACLE ====================
    async function loadVitals() {
        try {
            const res = await fetch("/api/vitals");
            const data = await res.json();
            const v = data.vitals;

            document.getElementById("vitalsHostname").textContent = v.hostname;
            document.getElementById("vitalsPlatform").textContent = v.platform;
            document.getElementById("vitalsCpu").textContent = `${v.cpu_cores} Silicon Threads`;
            document.getElementById("vitalsMem").textContent = `${v.memory.load_percent}% (${v.memory.used_mb} / ${v.memory.total_mb} MB)`;
            document.getElementById("vitalsDisk").textContent = `${v.disk.used_gb} GB used / ${v.disk.free_gb} GB void`;

            const memBar = document.getElementById("memMeterFill");
            if (memBar) memBar.style.width = `${v.memory.load_percent}%`;

            const diskBar = document.getElementById("diskMeterFill");
            if (diskBar) diskBar.style.width = `${v.disk.percent_used}%`;

            // Procs Table
            const tbody = document.getElementById("ghostProcsBody");
            if (tbody) {
                tbody.innerHTML = "";
                (data.processes || []).forEach(p => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td style="color:var(--accent-amber);">${escapeHtml(p.pid)}</td>
                        <td>${escapeHtml(p.name)}</td>
                        <td>${escapeHtml(p.memory)}</td>
                        <td style="color:var(--accent-violet);">${escapeHtml(p.spectral_status)}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        } catch (e) {
            console.error("Vitals load error:", e);
        }
    }

    async function checkOllama() {
        try {
            const res = await fetch("/api/ollama/status");
            const data = await res.json();
            if (data.available) {
                ollamaBadge.innerHTML = `<span class="badge-dot" style="background:#10b981;"></span> Ollama: ${data.active_model}`;
            } else {
                ollamaBadge.innerHTML = `<span class="badge-dot" style="background:#f59e0b;"></span> Standalone Spectral Core`;
            }
        } catch (e) {
            ollamaBadge.innerHTML = `<span class="badge-dot" style="background:#ef4444;"></span> Offline Fallback`;
        }
    }

    // Floating Petals
    function createPetals() {
        const container = document.getElementById("petalContainer");
        if (!container) return;
        const count = 15;
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.className = "petal";
            p.style.left = Math.random() * 100 + "vw";
            p.style.animationDuration = (8 + Math.random() * 10) + "s";
            p.style.animationDelay = (Math.random() * 8) + "s";
            p.style.width = (10 + Math.random() * 8) + "px";
            p.style.height = (10 + Math.random() * 8) + "px";
            container.appendChild(p);
        }
    }

    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // Initial load
    checkOllama();
    loadVitals();
    loadSpirits();
    loadOfrendas();
});
