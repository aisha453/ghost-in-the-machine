#!/usr/bin/env python3
"""
Ghost in the Machine - Haunted CLI Companion
A possessed terminal companion running entirely on local open AI & system diagnostics.
"""

import os
import sys
import time
import json
from pathlib import Path

# Add current directory to path
CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from hardware_oracle import get_system_vitals, get_haunted_diagnosis, get_ghost_processes
from spectral_engine import spectral_engine, HISTORICAL_SPIRITS

# ANSI Color Codes for gothic terminal aesthetics
C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_DIM = "\033[2m"
C_GREEN = "\033[38;5;46m"
C_AMBER = "\033[38;5;214m"
C_PURPLE = "\033[38;5;135m"
C_CYAN = "\033[38;5;51m"
C_RED = "\033[38;5;196m"
C_GOLD = "\033[38;5;220m"

BANNER = f"""{C_AMBER}
  .---.                                                       
 /     \\   {C_RED}[ G H O S T   I N   T H E   M A C H I N E ]{C_AMBER}
| () () |  The Terminal is Possessed. 
 \\  ^  /   Local Open-Source AI & Hardware Séance Engine
  |||||    Día de los Muertos & Halloween Memorial Edition
  `---'   {C_RESET}
"""

def slow_print(text: str, delay: float = 0.015, color: str = C_GREEN):
    """Prints text with a retro typewriter effect."""
    sys.stdout.write(color)
    for ch in text:
        sys.stdout.write(ch)
        sys.stdout.flush()
        time.sleep(delay)
    sys.stdout.write(C_RESET + "\n")

def print_help():
    print(f"""{C_AMBER}
AVAILABLE INVOCATIONS:{C_RESET}
  {C_GREEN}diagnose{C_RESET}               - Extract hardware vitals & lingering ghost processes
  {C_PURPLE}seance <spirit_name>{C_RESET}   - Channel Ada Lovelace, Grace Hopper, Apollo AGC, Unix v6, or Flash
  {C_GOLD}ofrenda{C_RESET}                - Place an offering & write an eternal remembrance (Día de los Muertos)
  {C_CYAN}spirits{C_RESET}                - List historical tech entities ready to be summoned
  {C_RED}clear / cls{C_RESET}            - Banish lingering phosphor traces from the screen
  {C_RED}exit / quit{C_RESET}            - Sever the ethereal connection
  {C_DIM}<any shell command>    - Execute command and hear the Machine whisper its judgment{C_RESET}
""")

def run_cli():
    # Enable ANSI escape sequences on Windows if needed
    if os.name == 'nt':
        os.system('')
        
    print(BANNER)
    vitals = get_system_vitals()
    ollama_stat = spectral_engine.check_ollama_status()
    
    print(f"{C_DIM}* Vessel Identified: {C_BOLD}{vitals['hostname']}{C_RESET}{C_DIM} ({vitals['platform']})")
    print(f"* Memory Saturated: {vitals['memory']['used_mb']} MB / {vitals['memory']['total_mb']} MB ({vitals['memory']['load_percent']}%)")
    if ollama_stat.get("available"):
        print(f"* Local Open AI Engine: {C_GREEN}ONLINE (Ollama - {ollama_stat.get('active_model')}){C_RESET}")
    else:
        print(f"* Local Open AI Engine: {C_AMBER}STANDALONE SPECTRAL CORE (Zero-Latency Offline Mode){C_RESET}")
    print(f"{C_DIM}* Type 'help' for incantations or begin running shell commands...{C_RESET}\n")

    while True:
        try:
            prompt_str = f"{C_RED}ghost@{vitals['hostname']}{C_RESET}:{C_AMBER}~/{C_RESET}$ "
            user_input = input(prompt_str).strip()
            if not user_input:
                continue
                
            cmd = user_input.lower()
            
            if cmd in ("exit", "quit", "q"):
                slow_print("\nThe silicon connection severs. The ghosts retreat into the L3 cache. Goodbye, mortal.", delay=0.02, color=C_PURPLE)
                break
                
            elif cmd in ("clear", "cls"):
                os.system('cls' if os.name == 'nt' else 'clear')
                print(BANNER)
                continue
                
            elif cmd in ("help", "?"):
                print_help()
                continue
                
            elif cmd == "spirits":
                print(f"\n{C_PURPLE}--- HISTORICAL SPIRITS BOUND TO THIS MACHINE ---{C_RESET}")
                for k, v in HISTORICAL_SPIRITS.items():
                    print(f"  {C_CYAN}{k:<18}{C_RESET} : {v['name']} ({v['era']})")
                print(f"\n{C_DIM}Use: seance <spirit_key> (e.g. 'seance ada_lovelace'){C_RESET}\n")
                continue
                
            elif cmd == "diagnose":
                print(f"\n{C_AMBER}Communing with hardware registers...{C_RESET}")
                time.sleep(0.4)
                print(f"{C_GREEN}{get_haunted_diagnosis()}{C_RESET}\n")
                continue
                
            elif cmd.startswith("seance"):
                parts = user_input.split(maxsplit=1)
                spirit_key = parts[1].strip() if len(parts) > 1 else "ada_lovelace"
                if spirit_key not in HISTORICAL_SPIRITS:
                    print(f"{C_RED}Unknown spirit '{spirit_key}'. Type 'spirits' to see list.{C_RESET}")
                    continue
                
                spirit = HISTORICAL_SPIRITS[spirit_key]
                print(f"\n{C_PURPLE}[ SÉANCE COMMENCED: CHANNELING {spirit['name'].upper()} ]{C_RESET}")
                print(f"{C_DIM}\"{spirit['quote']}\"{C_RESET}")
                question = input(f"{C_AMBER}Speak your question across the veil: {C_RESET}").strip()
                if not question:
                    question = "What wisdom do you leave for the programmers of tomorrow?"
                
                print(f"{C_DIM}Channeling transmission...{C_RESET}")
                res = spectral_engine.invoke_seance(spirit_key, question)
                slow_print(f"\n{res['spirit_name']}:", delay=0.01, color=C_CYAN)
                slow_print(f"\"{res['spectral_transmission']}\"\n", delay=0.02, color=C_GREEN)
                continue
                
            elif cmd == "ofrenda":
                print(f"\n{C_GOLD}======================================================{C_RESET}")
                print(f"{C_GOLD}   DÍA DE LOS MUERTOS - DIGITAL OFRENDA MEMORIAL      {C_RESET}")
                print(f"{C_GOLD}======================================================{C_RESET}")
                name = input(f"{C_AMBER}Name of the loved one, mentor, or departed pioneer: {C_RESET}").strip() or "Beloved Soul"
                era = input(f"{C_AMBER}Years or Era (e.g., 1945 - 2021): {C_RESET}").strip() or "In Loving Memory"
                offerings_input = input(f"{C_AMBER}Offerings placed on altar (comma separated): {C_RESET}").strip()
                offerings = [o.strip() for o in offerings_input.split(",")] if offerings_input else ["Cempasúchil flowers", "Pan de Muerto", "Sweet memories"]
                memory = input(f"{C_AMBER}A story or memory to preserve: {C_RESET}").strip() or "Their light guides our steps."
                
                print(f"\n{C_GOLD}* Lighting virtual candles... scattering marigolds...{C_RESET}")
                time.sleep(0.5)
                res = spectral_engine.generate_ofrenda_remembrance({
                    "name": name,
                    "era": era,
                    "offerings": offerings,
                    "memory": memory
                })
                slow_print(f"\n{res['elegy']}\n", delay=0.015, color=C_AMBER)
                print(f"{C_DIM}[Saved to sovereign private archive on this laptop. Never uploaded to the cloud.]{C_RESET}\n")
                continue
                
            # Default: Haunted terminal command evaluation
            res = spectral_engine.haunted_command_eval(user_input, vitals)
            print(f"{C_DIM}{res['standard_output']}{C_RESET}")
            slow_print(f"\n[GHOST WHISPER]: {res['spectral_whisper']}", delay=0.015, color=C_RED)
            print(f"{C_DIM}{res['hardware_anchor']}{C_RESET}\n")
            
        except KeyboardInterrupt:
            print(f"\n{C_PURPLE}Session interrupted. The ghost sleeps.{C_RESET}")
            break
        except Exception as e:
            print(f"{C_RED}An error disturbed the ether: {e}{C_RESET}")

if __name__ == "__main__":
    run_cli()
