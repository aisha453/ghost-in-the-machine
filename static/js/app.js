/**
 * Ghost in the Machine - Advanced Interactive Haunted Client
 * Features:
 * - Interactive Floating Ghost Apparitions (Click/hover to provoke)
 * - Creepy Glowing Demon Eyes appearing in dark corners
 * - Live Electro-Magnetic Field (EMF) Ghost Meter
 * - Spooky Procedural Soundboard Toolbar
 * - Jumpscare Flash Apparition
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
    const possessionPct = document.getElementById("possessionPct");
    const jumpscareOverlay = document.getElementById("jumpscareOverlay");
    const headerSkull = document.getElementById("headerSkull");

    // Initialize Atmosphere
    createAtmosphereParticles();
    spawnFloatingGhosts(4);
    startCreepyEyesLoop();

    // ==================== SOUNDBOARD CONTROLS ====================
    const sndMusic = document.getElementById("sndMusic");
    const sndThunder = document.getElementById("sndThunder");
    const sndBanshee = document.getElementById("sndBanshee");
    const sndHeartbeat = document.getElementById("sndHeartbeat");
    const sndCreak = document.getElementById("sndCreak");
    const sndWhisper = document.getElementById("sndWhisper");
    const sndStinger = document.getElementById("sndStinger");

    if (sndMusic) {
        sndMusic.addEventListener("click", () => {
            if (window.spectralAudio) {
                const isPlaying = window.spectralAudio.toggleGhostMusic();
                sndMusic.textContent = isPlaying ? "🎵 Ghost Music: ON" : "🎵 Ghost Music: OFF";
                sndMusic.style.borderColor = isPlaying ? "#f472b6" : "rgba(244, 114, 182, 0.5)";
                sndMusic.style.boxShadow = isPlaying ? "0 0 14px rgba(244, 114, 182, 0.7)" : "none";
                updateAudioUI(true);
            }
        });
    }

    function playSpookyAction(btn, soundFn, emfLevel = 3) {
        if (btn) {
            btn.classList.add("active-sound");
            setTimeout(() => btn.classList.remove("active-sound"), 350);
        }
        if (window.spectralAudio) {
            window.spectralAudio.unmute();
            updateAudioUI(true);
            try {
                soundFn();
            } catch (err) {
                console.error("Sound play error:", err);
            }
        }
        triggerEMF(emfLevel);
    }

    if (sndThunder) sndThunder.addEventListener("click", () => {
        playSpookyAction(sndThunder, () => window.spectralAudio.playThunder(), 4);
    });
    if (sndBanshee) sndBanshee.addEventListener("click", () => {
        playSpookyAction(sndBanshee, () => window.spectralAudio.playBansheeScreech(), 5);
    });
    if (sndHeartbeat) sndHeartbeat.addEventListener("click", () => {
        playSpookyAction(sndHeartbeat, () => window.spectralAudio.playHeartbeat(), 3);
    });
    if (sndCreak) sndCreak.addEventListener("click", () => {
        playSpookyAction(sndCreak, () => window.spectralAudio.playCreak(), 3);
    });
    if (sndWhisper) sndWhisper.addEventListener("click", () => {
        playSpookyAction(sndWhisper, () => window.spectralAudio.playGhostWhispers(), 3);
    });
    if (sndStinger) sndStinger.addEventListener("click", () => {
        triggerJumpscare();
    });

    if (headerSkull) {
        headerSkull.addEventListener("click", () => {
            triggerJumpscare();
        });
    }

    function unmuteIfNeeded() {
        if (window.spectralAudio) {
            window.spectralAudio.unmute();
            updateAudioUI(true);
        }
    }

    function updateAudioUI(unmuted) {
        if (!audioLabel || !audioToggleBtn) return;
        audioLabel.textContent = unmuted ? "Spectral Audio: ON" : "Spectral Audio: OFF";
        audioToggleBtn.style.borderColor = unmuted ? "var(--accent-blood)" : "var(--border-blood)";
        audioToggleBtn.style.boxShadow = unmuted ? "0 0 14px rgba(255, 30, 56, 0.5)" : "none";
        if (sndMusic && window.spectralAudio) {
            const isPlaying = window.spectralAudio.isMusicPlaying;
            sndMusic.textContent = isPlaying ? "🎵 Ghost Music: ON" : "🎵 Ghost Music: OFF";
            sndMusic.style.borderColor = isPlaying ? "#f472b6" : "rgba(244, 114, 182, 0.5)";
            sndMusic.style.boxShadow = isPlaying ? "0 0 14px rgba(244, 114, 182, 0.7)" : "none";
        }
    }

    // ==================== EMF GHOST DETECTOR ====================
    function triggerEMF(level = 3) {
        const pips = [
            document.getElementById("emf1"),
            document.getElementById("emf2"),
            document.getElementById("emf3"),
            document.getElementById("emf4"),
            document.getElementById("emf5")
        ];
        pips.forEach((pip, idx) => {
            if (pip) {
                if (idx < level) {
                    pip.className = `emf-pip active-${idx + 1}`;
                } else {
                    pip.className = "emf-pip";
                }
            }
        });

        if (window.spectralAudio) {
            window.spectralAudio.playEMFBeep(level);
        }

        // Decay back to safe level after 2.5s
        setTimeout(() => {
            pips.forEach((pip, idx) => {
                if (pip) {
                    if (idx < 2) {
                        pip.className = `emf-pip active-${idx + 1}`;
                    } else {
                        pip.className = "emf-pip";
                    }
                }
            });
        }, 2500);
    }

    // ==================== JUMPSCARE APPARITION ====================
    function triggerJumpscare() {
        unmuteIfNeeded();
        if (window.spectralAudio) {
            window.spectralAudio.playJumpscareStinger();
            window.spectralAudio.playBansheeScreech();
        }
        triggerEMF(5);

        if (jumpscareOverlay) {
            jumpscareOverlay.classList.add("trigger");
            setTimeout(() => {
                jumpscareOverlay.classList.remove("trigger");
            }, 420);
        }
    }

    // Random Possession Twitches
    setInterval(() => {
        if (possessionPct) {
            const val = (89.5 + Math.random() * 9.8).toFixed(1);
            possessionPct.textContent = `${val}%`;
            if (Math.random() < 0.25 && window.spectralAudio) {
                window.spectralAudio.playHeartbeat();
            }
        }
    }, 4500);

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
                window.spectralAudio.playGhostBreath();
                triggerEMF(4);
            }
        }
    }

    // Audio Toggle
    audioToggleBtn.addEventListener("click", () => {
        if (!window.spectralAudio) return;
        const unmuted = window.spectralAudio.toggleMute();
        updateAudioUI(unmuted);
        if (unmuted) {
            window.spectralAudio.playGhostBreath();
            window.spectralAudio.playHeartbeat();
        }
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
        // Trigger EMF spike & Glitch screen
        triggerEMF(Math.floor(Math.random() * 2) + 4);
        const termWindow = document.querySelector(".terminal-window");
        if (termWindow) {
            termWindow.classList.add("screen-glitch");
            setTimeout(() => termWindow.classList.remove("screen-glitch"), 250);
        }

        const entry = document.createElement("div");
        entry.className = "term-entry";
        entry.innerHTML = `
            <div class="term-prompt">
                <span>ghost@vessel:~$</span>
                <span>${escapeHtml(cmd)}</span>
            </div>
            <div class="term-stdout" style="opacity: 0.6; color: var(--accent-blood);">Communing with silicon registers across ring-3...</div>
        `;
        terminalBody.appendChild(entry);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        if (cmd.toLowerCase() === "clear" || cmd.toLowerCase() === "cls") {
            terminalBody.innerHTML = `
                <div class="term-entry">
                    <div class="term-stdout" style="color: var(--accent-blood);">
* Phosphor screen purged. The ghosts wait in the shadows of the L3 cache.
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
                if (Math.random() < 0.4) window.spectralAudio.playHeartbeat();
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
            entry.innerHTML += `<div class="term-stdout" style="color: var(--accent-blood);">Etherial disruption: ${err.message}</div>`;
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

        triggerEMF(4);
        if (window.spectralAudio) {
            window.spectralAudio.playEVPStatic();
            window.spectralAudio.playGhostBreath();
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

        triggerEMF(5);
        const seanceMain = document.querySelector(".seance-main");
        if (seanceMain) {
            seanceMain.classList.add("screen-glitch");
            setTimeout(() => seanceMain.classList.remove("screen-glitch"), 250);
        }

        const msgDiv = document.createElement("div");
        msgDiv.className = "seance-message";
        msgDiv.innerHTML = `
            <div class="seance-user">You invoke the spirit: "${escapeHtml(q)}"</div>
            <div class="seance-transmission" style="opacity: 0.6; color: #f472b6;">Channeling frequencies across computational time...</div>
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
                window.spectralAudio.playGhostBreath();
                if (Math.random() < 0.35) window.spectralAudio.playThunder();
            }

            msgDiv.innerHTML = `
                <div class="seance-user">You invoke the spirit: "${escapeHtml(q)}"</div>
                <div class="seance-transmission">
                    <strong>${escapeHtml(data.spirit_name)}:</strong><br>
                    "${escapeHtml(data.spectral_transmission)}"
                    <div style="font-size:0.7rem; color:#c084fc; margin-top:8px;">
                        * Manifested via ${escapeHtml(data.provider)} &bull; ${escapeHtml(data.manifested_at)}
                    </div>
                </div>
            `;
        } catch (err) {
            msgDiv.innerHTML += `<div style="color:var(--accent-blood);">Transmission lost in static: ${err.message}</div>`;
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
                    <div style="color: var(--accent-marigold); font-size: 1.4rem; filter: drop-shadow(0 0 8px #f97316);">🕯️</div>
                </div>
                <div class="offerings-pills">${pills}</div>
                <div class="ofrenda-memory">"${escapeHtml(item.memory)}"</div>
                <div class="ofrenda-elegy">${escapeHtml(item.elegy)}</div>
                <div style="font-size: 0.7rem; color: #fed7aa; margin-top: 12px; display: flex; justify-content: space-between;">
                    <span>Consecrated: ${escapeHtml(item.blessing_timestamp || "")}</span>
                    <span>🔒 100% Sovereign Local Storage</span>
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
            ofrendaSubmitBtn.textContent = "Composing Elegy & Lighting Flame...";

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
                    window.spectralAudio.playGhostWhisperChime();
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
                        <td style="color:var(--accent-blood); font-weight:bold;">${escapeHtml(p.pid)}</td>
                        <td style="color:#f1f5f9;">${escapeHtml(p.name)}</td>
                        <td>${escapeHtml(p.memory)}</td>
                        <td style="color:#f472b6;">${escapeHtml(p.spectral_status)}</td>
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
                ollamaBadge.innerHTML = `<span class="badge-dot" style="background:#00ff66;"></span> Ollama: ${data.active_model}`;
            } else {
                ollamaBadge.innerHTML = `<span class="badge-dot" style="background:#ff8c00;"></span> Autonomous Ghost Core`;
            }
        } catch (e) {
            ollamaBadge.innerHTML = `<span class="badge-dot" style="background:#ff1e38;"></span> Offline Fallback`;
        }
    }

    // ==================== FLOATING INTERACTIVE GHOSTS ====================
    function spawnFloatingGhosts(count = 4) {
        const container = document.getElementById("ghostSpectresContainer");
        if (!container) return;

        const ghostSvg = `
            <svg viewBox="0 0 64 64" fill="none">
                <path d="M16 32 C16 16 48 16 48 32 C48 48 44 56 40 52 C36 48 34 56 30 52 C26 48 24 56 20 52 C16 48 16 40 16 32 Z" 
                      fill="rgba(244, 114, 182, 0.25)" stroke="rgba(244, 114, 182, 0.7)" stroke-width="1.5" />
                <circle cx="26" cy="30" r="3.5" fill="#ff1e38" />
                <circle cx="38" cy="30" r="3.5" fill="#ff1e38" />
                <ellipse cx="32" cy="40" rx="3" ry="5" fill="#05060a" />
            </svg>
        `;

        for (let i = 0; i < count; i++) {
            const ghost = document.createElement("div");
            ghost.className = "ghost-apparition";
            ghost.innerHTML = ghostSvg;
            ghost.style.left = (10 + Math.random() * 80) + "vw";
            ghost.style.top = (15 + Math.random() * 65) + "vh";
            ghost.style.animationDelay = (i * 2.5) + "s";
            ghost.style.animationDuration = (12 + Math.random() * 8) + "s";

            // Click or hover interaction
            ghost.addEventListener("click", () => {
                unmuteIfNeeded();
                if (window.spectralAudio) {
                    window.spectralAudio.playBansheeScreech();
                }
                triggerEMF(5);
                ghost.style.transform = "scale(2.5) rotate(45deg)";
                ghost.style.opacity = "0";
                setTimeout(() => {
                    ghost.style.left = Math.random() * 80 + "vw";
                    ghost.style.top = Math.random() * 70 + "vh";
                    ghost.style.transform = "scale(1)";
                    ghost.style.opacity = "0.4";
                }, 4000);
            });

            container.appendChild(ghost);
        }
    }

    // ==================== CREEPY GLOWING EYES IN SHADOWS ====================
    function startCreepyEyesLoop() {
        const container = document.getElementById("creepyEyesContainer");
        if (!container) return;

        setInterval(() => {
            const eyes = document.createElement("div");
            eyes.className = "creepy-eyes";
            eyes.innerHTML = `<span class="eye-orb"></span><span class="eye-orb"></span>`;
            eyes.style.left = (5 + Math.random() * 88) + "vw";
            eyes.style.top = (10 + Math.random() * 75) + "vh";
            container.appendChild(eyes);

            setTimeout(() => eyes.classList.add("active"), 100);

            setTimeout(() => {
                eyes.classList.remove("active");
                setTimeout(() => eyes.remove(), 1500);
            }, 4500);
        }, 8500);
    }

    // Floating Cempasúchil Petals + Rising Embers
    function createAtmosphereParticles() {
        const container = document.getElementById("particleContainer");
        if (!container) return;
        
        // 12 Falling Marigold Petals
        for (let i = 0; i < 12; i++) {
            const p = document.createElement("div");
            p.className = "petal";
            p.style.left = Math.random() * 100 + "vw";
            p.style.animationDuration = (7 + Math.random() * 9) + "s";
            p.style.animationDelay = (Math.random() * 6) + "s";
            container.appendChild(p);
        }

        // 16 Rising Glowing Embers
        for (let i = 0; i < 16; i++) {
            const e = document.createElement("div");
            e.className = "ember";
            e.style.left = Math.random() * 100 + "vw";
            e.style.animationDuration = (5 + Math.random() * 8) + "s";
            e.style.animationDelay = (Math.random() * 6) + "s";
            e.style.width = (3 + Math.random() * 4) + "px";
            e.style.height = e.style.width;
            container.appendChild(e);
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
