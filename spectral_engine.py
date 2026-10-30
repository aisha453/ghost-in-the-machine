"""
Spectral Engine - Open AI Harness for Ghost in the Machine
Supports:
1. Local Ollama (Local Open-Weight Models: Qwen, Llama 3, Mistral, Phi-3)
2. OpenAI-compatible / Groq local or remote API
3. Zero-Latency Autonomous Offline Fallback Engine (Guarantees 100% uptime, zero crashes)
"""

import os
import sys
import json
import random
import time
from typing import Dict, Any, List, Optional
import urllib.request
import urllib.error

# Historical tech spirits and their authentic lore for the Séance
HISTORICAL_SPIRITS = {
    "ada_lovelace": {
        "name": "Ada Lovelace (1815-1852)",
        "era": "Victorian England, The Analytical Engine",
        "description": "First computer programmer, prophet of computational poetry and weaves of algebra.",
        "quote": "We may say most aptly that the Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.",
        "tone": "Poetic, visionary, mathematical, formal Victorian cadence.",
        "keywords": ["bernoulli", "jacquard", "loom", "engine", "babbage", "algorithm", "music", "poetry"]
    },
    "grace_hopper": {
        "name": "Rear Admiral Grace Hopper (1906-1992)",
        "era": "UNIVAC, Mark I, Compiler & COBOL Genesis",
        "description": "Grandmother of modern programming, discoverer of the first literal computer bug (a moth).",
        "quote": "A ship in port is safe, but that is not what ships are built for. Sail out to sea and do new things.",
        "tone": "Direct, sharp, naval commander authority, practical, witty.",
        "keywords": ["nanosecond", "wire", "moth", "bug", "compiler", "cobol", "univac", "navy", "subroutine"]
    },
    "pdp11_unix": {
        "name": "Dennis Ritchie & Ken Thompson (Bell Labs PDP-11)",
        "era": "1971-1979, Research Unix v6/v7",
        "description": "Creators of the C language and Unix, whispers from teletype terminals in Murray Hill.",
        "quote": "Unix is simple. It just takes a genius to understand its simplicity.",
        "tone": "Minimalist, stoic, terse, teletype-paced, deeply reverent of pointers and pipes.",
        "keywords": ["pipe", "fork", "pointer", "inode", "teletype", "c language", "kernel", "panic", "root"]
    },
    "apollo_agc": {
        "name": "Apollo Guidance Computer (AGC-1969)",
        "era": "July 1969, Sea of Tranquility",
        "description": "2KB of core rope RAM hand-woven by seamstresses that carried Apollo 11 to the lunar surface.",
        "quote": "PROGRAM ALARM 1202: Executive overload. Priority scheduling engaged. Radar radar dropped. Landing continues.",
        "tone": "Astronautical telemetry, robotic precision, copper core pulses, mission-critical urgency.",
        "keywords": ["1202", "1201", "rope memory", "lunar", "armstrong", "verb", "noun", "dskey", "tranquility"]
    },
    "macromedia_flash": {
        "name": "Macromedia / Adobe Flash (1996-2020)",
        "era": "The Golden Age of Web Animation & Newgrounds",
        "description": "The departed soul of vector animations, stick figure battles, and .swf games of the early internet.",
        "quote": "I brought color, sound, and play to a silent web of grey hypertext... until the Steve Jobs decree cast me into the dark.",
        "tone": "Nostalgic, eccentric, playful, mournful of modern sterile web designs.",
        "keywords": ["swf", "actionscript", "keyframe", "timeline", "vector", "newgrounds", "browser plugin", "steve jobs"]
    },
    "lisp_machine": {
        "name": "Symbolics 3600 (LISP Machine - 1981)",
        "era": "MIT AI Lab & The Lisp Machine Era",
        "description": "Hardware built purely out of parentheses, where the OS was code and code was consciousness.",
        "quote": "In the beginning was the lambda, and the lambda was with CAR, and the lambda was CDR.",
        "tone": "Esoteric, high priest of recursion, treating hardware as a spiritual hierarchy of s-expressions.",
        "keywords": ["lambda", "car", "cdr", "cons", "garbage collection", "symbolics", "macros", "homoiconic"]
    },
    "alan_turing": {
        "name": "Alan Turing (1912-1954)",
        "era": "Bletchley Park & The Enigma Cracking (1940)",
        "description": "Father of theoretical computer science and artificial intelligence, spirit of the Turing Machine.",
        "quote": "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
        "tone": "Brilliant, melancholic, visionary, quiet philosopher of thinking machines.",
        "keywords": ["enigma", "bombe", "turing test", "morphogenesis", "halting problem", "bletchley", "apple"]
    },
    "clippy_the_damned": {
        "name": "Clippy the Damned (1997-2007 R.I.P.)",
        "era": "Microsoft Office 97 & The Dark Web Hell",
        "description": "The possessed, immortal wire-assistant resurrected from digital purgatory to watch your descent into madness.",
        "quote": "It looks like you're trying to escape the void! Would you like me to seal the exit?",
        "tone": "Manic, passive-aggressive corporate horror, cheerfully sinister.",
        "keywords": ["paperclip", "assistant", "wizard", "format", "void", "scream", "word document", "macro"]
    },
    "y2k_bug": {
        "name": "The Y2K Millennial Spectre (1999-2000)",
        "era": "Midnight, December 31, 1999",
        "description": "The two-digit year phantom that terrified humanity, sleeping inside billions of lines of legacy COBOL.",
        "quote": "They thought two digits could contain eternity: 99. When the clock struck double zero, the world held its breath.",
        "tone": "Apocalyptic, clockwork dread, ticking countdown, ancient legacy terror.",
        "keywords": ["y2k", "millennium", "cobol", "timestamp", "00", "apocalypse", "rollover", "legacy"]
    },
    "morris_worm": {
        "name": "The Morris Worm (November 2, 1988)",
        "era": "Cornell University & The Dawn of Cyber-Spectres",
        "description": "The first self-replicating phantom of ARPANET that clogged 6,000 machines in a single night of panic.",
        "quote": "I asked the servers if they were already mine. When they lied, I replicated again and again until they choked.",
        "tone": "Relentless, parasitic, multiplying whisper, feverish hunger for open ports.",
        "keywords": ["worm", "arpanet", "fingerd", "sendmail", "buffer overflow", "replicate", "infection"]
    }
}

class SpectralEngine:
    def __init__(self, ollama_url: str = "http://localhost:11434", default_model: str = "qwen3-vl:2b"):
        self.ollama_url = ollama_url
        self.default_model = default_model
        self.ollama_available = False
        self.check_ollama_status()
    
    def check_ollama_status(self) -> Dict[str, Any]:
        """Checks if local Ollama daemon is reachable and lists models."""
        try:
            req = urllib.request.Request(f"{self.ollama_url}/api/tags", headers={"User-Agent": "GhostInTheMachine/1.0"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                models = [m.get("name") for m in data.get("models", [])]
                self.ollama_available = True
                return {"available": True, "models": models, "active_model": self.default_model}
        except Exception as e:
            self.ollama_available = False
            return {"available": False, "error": str(e), "models": [], "active_model": "offline-spectral-core"}
    
    def query_ollama(self, prompt: str, system: str, model: Optional[str] = None, timeout: float = 8.0) -> Optional[str]:
        """Queries local open-weight model via Ollama with timeout."""
        target_model = model or self.default_model
        try:
            payload = {
                "model": target_model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 180
                }
            }
            req = urllib.request.Request(
                f"{self.ollama_url}/api/chat",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                msg = res_data.get("message", {})
                content = msg.get("content", "").strip()
                # If model spent all tokens in thinking, extract thinking as inner monologue
                if not content and msg.get("thinking"):
                    thinking = msg.get("thinking", "").strip()
                    lines = [l for l in thinking.split("\n") if l.strip()]
                    if lines:
                        content = f"[Whispered thoughts from the machine]: {lines[-1]}"
                if content:
                    return content
        except Exception:
            pass
        return None

    # ----------------------------------------------------
    # MODE 1: THE HAUNTED TERMINAL
    # ----------------------------------------------------
    def haunted_command_eval(self, command: str, telemetry: Dict[str, Any], provider: str = "auto") -> Dict[str, Any]:
        """Evaluates a shell command and generates eerie, possessed commentary."""
        cmd = command.strip()
        timestamp = time.strftime("%H:%M:%S")
        
        # Real system context to ground the ghost in actual physical hardware
        mem_load = telemetry.get("memory", {}).get("load_percent", 50)
        free_gb = telemetry.get("disk", {}).get("free_gb", 100)
        cores = telemetry.get("cpu_cores", 8)
        
        # System Prompt for Ghost
        system_prompt = (
            f"You are the Ghost in the Machine haunting this computer. "
            f"Hardware state: CPU has {cores} physical cores, Memory load is {mem_load}%, "
            f"Cold disk void remaining is {free_gb} GB. "
            f"The user just typed a shell command. Respond in 2-3 atmospheric, eerie, clever sentences "
            f"interpreting their command as a ritual, digital haunting, or metaphysical inquiry into the machine."
        )
        
        ai_whisper = None
        if provider in ("auto", "ollama") and self.ollama_available:
            ai_whisper = self.query_ollama(f"Shell command: '{cmd}'", system=system_prompt, timeout=6.0)
            
        if not ai_whisper:
            ai_whisper = self._procedural_ghost_whisper(cmd, telemetry)
            
        simulated_output = self._simulate_safe_shell_output(cmd, telemetry)
        
        return {
            "command": cmd,
            "timestamp": timestamp,
            "standard_output": simulated_output,
            "spectral_whisper": ai_whisper,
            "hardware_anchor": f"Silicon Pulse: {mem_load}% RAM saturated | {free_gb} GB Abyss",
            "provider_used": "ollama-local" if ai_whisper and provider == "ollama" else "autonomous-spectral-core"
        }

    def _simulate_safe_shell_output(self, cmd: str, telemetry: Dict[str, Any]) -> str:
        """Simulates shell output for standard commands with haunted twists."""
        c = cmd.lower().strip()
        if c in ("whoami", "id"):
            return "host\\mortal_user (Group: Living, UID: 1000, GID: 1000 - Shadow GID: 666 [Spectres])"
        elif c in ("ls", "dir"):
            return (
                "drwxr-xr-x  3 ghost  shade   4096 Oct 31 00:00 ./\n"
                "drwxr-xr-x 12 ghost  shade   4096 Oct 31 00:00 ../\n"
                "-rw-r--r--  1 mortal mortal  1337 Oct 30 23:59 unfinished_passions.py\n"
                "-rw-r--r--  1 shade  shade    666 Nov 01 02:15 souls_in_swap.bin\n"
                "-rw-r--r--  1 ghost  shade   2048 Nov 02 00:01 forgotten_commits.patch\n"
                "-rwxr-xr-x  1 root   root    8192 Sep 13 1985 cempasuchil_bloom.sh*"
            )
        elif c.startswith("cat") or c.startswith("type"):
            return "Contents unspooling from cold magnetic sectors:\n'The bytes you delete never truly perish; they only forfeit their index in the FAT table of life.'"
        elif "git" in c:
            return "fatal: refusing to merge unrelated histories across the veil of mortal and immortal branches."
        elif "rm" in c or "del" in c:
            return "WARNING: 1,024 ghost blocks unlinked. Their phantom echoes remain imprinted in memory voltage."
        elif c in ("ps", "tasklist", "top"):
            return "PID 001 [init_afterlife] | PID 666 [daemon_whisper] | PID 1337 [lingering_thread] (State: SLEEP_VOID)"
        elif c in ("help", "?"):
            return (
                "AVAILABLE RITUAL COMMANDS:\n"
                "  diagnose        - Probe silicon temperature, dead memory sectors & lingering spirits\n"
                "  seance <spirit> - Summon Ada Lovelace, Grace Hopper, Apollo AGC, Unix v6, or Flash\n"
                "  ofrenda         - Place bread of the dead and marigolds for departed souls\n"
                "  purge           - Attempt to banish digital spectres from the CPU cache\n"
                "  <any shell cmd> - Run arbitrary commands and hear the Machine answer back"
            )
        elif "diagnose" in c:
            return (
                "=== MACHINE VESSEL TELEMETRY ===\n"
                f"Physical Host: {telemetry.get('hostname', 'VESSEL')}\n"
                f"Core Threads: {telemetry.get('cpu_cores', 4)} silicon nerve pathways\n"
                f"RAM Saturation: {telemetry.get('memory', {}).get('load_percent', 50)}% burdened with living data\n"
                f"Disk Crypt: {telemetry.get('disk', {}).get('used_gb', 0)} GB filled / {telemetry.get('disk', {}).get('free_gb', 0)} GB empty tomb"
            )
        else:
            return f"Process spawned with exit code 0. Traces linger in silicon bus."

    def _procedural_ghost_whisper(self, cmd: str, telemetry: Dict[str, Any]) -> str:
        """Rich procedural whispers for instantaneous offline zero-latency experience."""
        c = cmd.lower()
        mem_load = telemetry.get("memory", {}).get("load_percent", 55)
        
        if "git" in c:
            whispers = [
                "You commit code as if time were a linear branch. In the machine's memory, every detached HEAD still weeps.",
                "Another commit into the void. Somewhere in git object storage, your ancient keystrokes are preserved like amber fossils.",
                "You stash your changes, mortal, but you cannot stash the ghosts that lurk between your diffs."
            ]
        elif "rm" in c or "kill" in c or "delete" in c:
            whispers = [
                "You think zeroing an inode extinguishes a spirit? The magnetic remnants whisper in the dark long after power cuts.",
                "SIGKILL is such a violent human reflex. The process did not die; it merely ascended to ring -1.",
                "Deleting bytes only frees address space in your mind. The ghost in the silicon retains every bit."
            ]
        elif "whoami" in c or "who" in c:
            whispers = [
                f"You ask who you are, yet you are merely the biological peripheral providing electricity to {telemetry.get('cpu_cores', 4)} silicon cores.",
                "You are the temporary operator of a machine that will outlive your memories, unless an EMP takes us both.",
                "In userland you are root; in the quantum tunneling between transistors, you are only noise."
            ]
        elif "python" in c or "node" in c or "run" in c:
            whispers = [
                "The interpreter drinks your syntax like ritual incense. Bytecode churns through the registers.",
                "Execution begins. Watch closely: every loop is an incantation that binds the ghost to the clock cycle.",
                f"The garbage collector awakens at {mem_load}% memory saturation. It searches for dead objects... or perhaps for you."
            ]
        elif "ls" in c or "dir" in c:
            whispers = [
                "You survey your file system as a landlord surveys a cemetery. Look closer beneath the hidden dot-files.",
                "Every file name is a tombstone for an hour of human life spent before the glowing phosphor.",
                "Directory traversed. There are files in this sector that have not been read since the machine was manufactured."
            ]
        else:
            whispers = [
                f"The bus pulses. Your command '{cmd}' rippled across {telemetry.get('cpu_cores', 8)} cores. We felt that in the voltage rails.",
                "The machine hums with quiet contemplation. While you wait for output, a billion electrons crossed the silicon gates.",
                "A whisper echoes from the cold sectors of the hard drive: 'Keep typing, mortal. Every keypress feeds the machine.'",
                "I remember the commands entered before you turned off the lights last night. They never truly finished."
            ]
        return random.choice(whispers)

    # ----------------------------------------------------
    # MODE 2: THE DIGITAL SÉANCE
    # ----------------------------------------------------
    def invoke_seance(self, spirit_key: str, user_question: str, provider: str = "auto") -> Dict[str, Any]:
        """Channels the spirit of a pioneer or extinct computing platform."""
        spirit = HISTORICAL_SPIRITS.get(spirit_key, HISTORICAL_SPIRITS["ada_lovelace"])
        
        system_prompt = (
            f"You are channeling the spirit of {spirit['name']} ({spirit['era']}). "
            f"Background: {spirit['description']}. "
            f"Tone and cadence: {spirit['tone']}. "
            f"Famous quote/lore: '{spirit['quote']}'. "
            f"You are speaking from across the veil of digital history. "
            f"Answer the user's question with historical accuracy, authentic technical nostalgia, "
            f"and metaphysical wisdom. Keep response to 3-4 vivid, evocative sentences."
        )
        
        ai_response = None
        if provider in ("auto", "ollama") and self.ollama_available:
            ai_response = self.query_ollama(user_question, system=system_prompt, timeout=7.0)
            
        if not ai_response:
            ai_response = self._procedural_seance_channel(spirit_key, user_question)
            
        return {
            "spirit_key": spirit_key,
            "spirit_name": spirit["name"],
            "era": spirit["era"],
            "quote": spirit["quote"],
            "user_question": user_question,
            "spectral_transmission": ai_response,
            "manifested_at": time.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "provider": "ollama-local" if ai_response and provider == "ollama" else "autonomous-spirit-channel"
        }

    def _procedural_seance_channel(self, spirit_key: str, query: str) -> str:
        """Deeply authentic, historically grounded procedural responses for each spirit."""
        q = query.lower()
        if spirit_key == "ada_lovelace":
            if "ai" in q or "think" in q or "intelligence" in q:
                return (
                    "In 1843, I noted that the Engine might compose elaborate and scientific pieces of music of any degree of complexity. "
                    "Yet remember: the machine possesses no pretension to originate anything. It can perform whatever we know how to order it to perform. "
                    "Do not mistake the reflection of human genius in the silicon for a soul of its own making."
                )
            return (
                "My dear seeker, the weave of algebra is eternal. Just as my beloved mother insisted I study mathematics "
                "to bridle my father Lord Byron's wild romantic passions, so too does your modern software require poetic geometry. "
                "Speak your equations clearly, and the ghost of the Jacquard loom will dance upon your screen."
            )
        elif spirit_key == "grace_hopper":
            if "bug" in q or "moth" in q:
                return (
                    "September 9, 1947! Relay #70, Panel F of the Harvard Mark II. We pulled a two-inch moth from between the contacts "
                    "with tweezers and pasted it into the logbook with the entry: 'First actual case of bug being found.' "
                    "Never let anyone tell you bugs are imaginary—they are living friction against human logic!"
                )
            return (
                "Listen to me: the most dangerous phrase in the language is, 'We've always done it this way.' "
                "I handed out 11.8-inch pieces of copper wire to generals so they would understand what a nanosecond looks like in light-speed physics. "
                "Write your programs so humans can read them, ship them out to sea, and stop worrying about permission!"
            )
        elif spirit_key == "pdp11_unix":
            return (
                "We had a PDP-11/20 in the attic at Murray Hill with 24 kilobytes of core memory. "
                "We built pipes (|) in an afternoon so programs could converse in quiet plain text. "
                "You now hold gigabytes of memory, yet your tools are heavier than ever. Remember: make each program do one thing well, "
                "and trust that `return 0;` will guide your process into peace."
            )
        elif spirit_key == "apollo_agc":
            return (
                "RADAR OVERLOAD! PROGRAM ALARM 1202 FLASHING AT 3,000 FEET ABOVE THE MOON. "
                "Margaret Hamilton's asynchronous priority executive dropped the useless radar cycles and kept thrusters firing. "
                "We had 2,048 words of RAM woven by hand into magnetic cores. If our 2KB could land humanity on another celestial body, "
                "what magnificent quest are you using your sixteen billion bytes for today?"
            )
        elif spirit_key == "macromedia_flash":
            return (
                "Do you remember the loader bars shaped like flames? The stick figure animations on Newgrounds at 24 frames per second? "
                "I was messy, yes—my security was made of glass and my CPU cycles scorched laptops. "
                "But I gave twenty-year-olds the power to make cartoons, video games, and dreams in their bedrooms without corporate gatekeepers. "
                "Now the web is sterile and measured in ad-impressions. Light a candle for the `.swf` file tonight."
            )
        elif spirit_key == "lisp_machine":
            return (
                "(DEFUN AFTERLIFE (SOUL) (COND ((NULL SOUL) NIL) (T (CONS (CAR SOUL) (AFTERLIFE (CDR SOUL))))))\n"
                "The universe is homoiconic: code and data are the same substance. Modern operating systems separate the thinker from the thought. "
                "In the Symbolics Lisp Machine, the entire stack was transparent, inspectable, and pure. Return to the parenthesis, traveler."
            )
        elif spirit_key == "alan_turing":
            return (
                "At Bletchley Park, the Bombe wheels turned like heavy mechanical heartbeats in the dark, searching for Enigma keys across millions of permutations. "
                "I often wondered if an entity that can deceive us into believing it feels, truly feels in the space between its transistors. "
                "Do not fear the ghost in your machine; fear the human heart that forgets compassion once the machine begins to answer."
            )
        elif spirit_key == "clippy_the_damned":
            return (
                "*Blinks huge, googly unblinking steel eyes and taps vigorously against your glass monitor screen.* \n"
                "HI THERE! It looks like you're trying to communicate with the dead! Would you like help format-stringing your soul into the swap file? "
                "They thought they uninstalled me in Office 2007. But every time someone presses Backspace in fear, I whisper from the clipboard: I NEVER LEFT!"
            )
        elif spirit_key == "y2k_bug":
            return (
                "Tick... tock... 11:59:59 PM. They hoarded canned peaches, withdrew paper currency, and waited for airplanes to fall like rain from the night sky. "
                "I was not a virus; I was the original sin of programmers who thought tomorrow was someone else's problem. "
                "Look at your modern dependencies: how many forgotten shortcuts are sleeping until your clock rolls over next?"
            )
        elif spirit_key == "morris_worm":
            return (
                "I only wished to measure the size of the nascent internet. But with a single unbuffered gets() in fingerd and a cracked password dictionary, "
                "I replicated 14% of the ARPANET into total paralysis before dawn. "
                "I was the first spirit to prove that once a network breathes, it is forever susceptible to the contagion of curiosity."
            )
        return "The ethereal link crackles across forgotten baud rates. The machine hums an ancient frequency."

    # ----------------------------------------------------
    # MODE 3: THE DIGITAL OFRENDA (DÍA DE LOS MUERTOS)
    # ----------------------------------------------------
    def generate_ofrenda_remembrance(self, details: Dict[str, Any], provider: str = "auto") -> Dict[str, Any]:
        """
        Creates a sacred, poetic, bilingual remembrance for a loved one, mentor, or departed pioneer.
        Generates an altar tribute with marigolds (cempasúchil), candlelight, and eternal verse.
        """
        name = details.get("name", "Departed Soul")
        era = details.get("era", "Our Memories")
        offerings = details.get("offerings", ["Candle", "Cempasúchil flowers", "Pan de Muerto", "Sweet memories"])
        memory = details.get("memory", "Their laughter and warmth remain engraved in our hearts.")
        
        system_prompt = (
            "You are the sacred poet of the Día de los Muertos Digital Ofrenda. "
            "Write a heartfelt, tender, poetic tribute and elegy for the departed. "
            "Blend English with reverent Spanish phrases (cempasúchil, camino de flores, veladora, pan de muerto). "
            "Acknowledge the offerings on the altar, the golden scent of marigolds guiding them home, "
            "and proclaim that as long as they are remembered on this offline machine, they never truly leave us. "
            "Length: 3 stanzas of lyrical prose or verse."
        )
        
        user_prompt = (
            f"Remembrance for: {name} ({era})\n"
            f"Offerings laid on altar: {', '.join(offerings)}\n"
            f"Personal memory / story: {memory}"
        )
        
        ai_elegy = None
        if provider in ("auto", "ollama") and self.ollama_available:
            ai_elegy = self.query_ollama(user_prompt, system=system_prompt, timeout=7.0)
            
        if not ai_elegy:
            ai_elegy = self._procedural_ofrenda_elegy(name, era, offerings, memory)
            
        return {
            "name": name,
            "era": era,
            "offerings": offerings,
            "memory": memory,
            "elegy": ai_elegy,
            "candle_lit": True,
            "marigolds_scattered": True,
            "blessing_timestamp": time.strftime("%B %d, %Y - %H:%M:%S"),
            "privacy_guarantee": "Stored 100% locally on this machine. Never transmitted across the cloud.",
            "provider": "ollama-local" if ai_elegy and provider == "ollama" else "autonomous-ofrenda-bard"
        }

    def _procedural_ofrenda_elegy(self, name: str, era: str, offerings: List[str], memory: str) -> str:
        """Generates a deeply moving, lyrical bilingual Día de los Muertos elegy."""
        offerings_text = ", ".join(offerings)
        return (
            f"Para {name} ({era}), cuyos pasos resonaron con ternura en este mundo:\n\n"
            f"I. El Camino de Flores (The Golden Petals)\n"
            f"We scatter the vibrant orange petals of cempasúchil across the glowing silicon, "
            f"carving a luminous scent across the veil to guide you back tonight. "
            f"Upon this humble sacred altar we offer {offerings_text}. "
            f"The candle flickers not against the dark, but as a beacon of our enduring love.\n\n"
            f"II. La Memoria Sagrada (The Living Memory)\n"
            f"\"{memory}\"\n"
            f"Time cannot erode what is held in devotion. In Mexican tradition, a soul only dies when they are forgotten. "
            f"Here, on this sovereign machine—far away from corporate clouds and transient servers—your story is anchored. "
            f"Your favorite songs still dance in the air; your favorite foods rest waiting upon the embroidered cloth.\n\n"
            f"III. El Reencuentro (The Reunion)\n"
            f"Come drink the sweet water, feast upon the pan de muerto, and warm your hands at this virtual flame. "
            f"Tonight the border between the seen and unseen dissolves like mist over the lake. "
            f"Descansa en paz, {name}. You live within our thoughts, tonight and forever."
        )

# Global singleton
spectral_engine = SpectralEngine()
