"""
Ghost in the Machine - Starlette Backend Server
Runs an offline-first, open-weight AI haunted terminal & digital ofrenda suite.
"""

import os
import sys
import json
import asyncio
from pathlib import Path

from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.responses import JSONResponse, HTMLResponse, Response
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

# Import local modules
CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from hardware_oracle import get_system_vitals, get_haunted_diagnosis, get_ghost_processes
from spectral_engine import spectral_engine, HISTORICAL_SPIRITS

DATA_FILE = CURRENT_DIR / "ofrendas_archive.json"

def load_ofrendas():
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    # Seed default historical homage ofrendas
    default_ofrendas = [
        {
            "id": "ofrenda-001",
            "name": "Margaret Hamilton's Apollo Rope Core",
            "era": "July 20, 1969 - Sea of Tranquility",
            "offerings": ["Copper woven wires", "Pan de Muerto", "Lunar dust", "A glass of sweet water"],
            "memory": "Woven by hand in raytheon factories, this core software refused to crash during lunar descent, guiding Apollo 11 home.",
            "elegy": "Para el software tejido de Apolo: Sus hilos de cobre nunca se rompieron. En este altar de silicio, tus alarmas 1202 descansan en paz entre pétalos dorados de cempasúchil.",
            "candle_lit": True,
            "blessing_timestamp": "October 31, 2026 - 00:00:00"
        },
        {
            "id": "ofrenda-002",
            "name": "The Forgotten Stick-Figure Animators of Macromedia Flash",
            "era": "1998 - 2015",
            "offerings": ["Flickering CRT light", "Cempasúchil flowers", "24 fps keyframes", "Cinnamon coffee"],
            "memory": "Millions of teenagers who stayed up until 3 AM animating stick figures on Newgrounds before algorithms ruled the web.",
            "elegy": "Para los creadores del viejo internet: Su arte no fue en vano. Aunque el plugin haya muerto, el espíritu de la creación libre sigue vivo en nuestras máquinas.",
            "candle_lit": True,
            "blessing_timestamp": "November 01, 2026 - 12:00:00"
        }
    ]
    save_ofrendas(default_ofrendas)
    return default_ofrendas

def save_ofrendas(data):
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving ofrendas: {e}")

# Routes
async def homepage(request):
    index_file = CURRENT_DIR / "static" / "index.html"
    if index_file.exists():
        with open(index_file, "r", encoding="utf-8") as f:
            return HTMLResponse(f.read())
    return HTMLResponse("<h1>Ghost in the Machine is alive. static/index.html not found.</h1>")

async def api_vitals(request):
    """Returns real hardware diagnostics and spectral entities."""
    vitals = get_system_vitals()
    procs = get_ghost_processes(6)
    diagnosis = get_haunted_diagnosis()
    return JSONResponse({
        "vitals": vitals,
        "processes": procs,
        "diagnosis": diagnosis
    })

async def api_ollama_status(request):
    """Returns Ollama status and available local open-weight models."""
    status = spectral_engine.check_ollama_status()
    return JSONResponse(status)

async def api_terminal_exec(request):
    """Executes a command and receives eerie haunted feedback."""
    try:
        body = await request.json()
        cmd = body.get("command", "").strip()
        provider = body.get("provider", "auto")
        vitals = get_system_vitals()
        res = spectral_engine.haunted_command_eval(cmd, vitals, provider=provider)
        return JSONResponse(res)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

async def api_seance_summon(request):
    """Summons a departed tech pioneer spirit."""
    try:
        body = await request.json()
        spirit_key = body.get("spirit", "ada_lovelace")
        question = body.get("question", "What did you leave behind in the machine?")
        provider = body.get("provider", "auto")
        res = spectral_engine.invoke_seance(spirit_key, question, provider=provider)
        return JSONResponse(res)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

async def api_seance_spirits(request):
    """Lists all available historical spirits for the séance."""
    return JSONResponse({"spirits": HISTORICAL_SPIRITS})

async def api_ofrendas_list(request):
    """Returns all preserved local ofrendas."""
    ofrendas = load_ofrendas()
    return JSONResponse({"ofrendas": ofrendas})

async def api_ofrenda_create(request):
    """Generates an ofrenda elegy and stores it in the local private archive."""
    try:
        body = await request.json()
        name = body.get("name", "Departed Soul")
        era = body.get("era", "Always in Memory")
        offerings = body.get("offerings", ["Cempasúchil petals", "Candle", "Pan de muerto"])
        memory = body.get("memory", "We cherish their memory forever.")
        provider = body.get("provider", "auto")
        
        result = spectral_engine.generate_ofrenda_remembrance({
            "name": name,
            "era": era,
            "offerings": offerings,
            "memory": memory
        }, provider=provider)
        
        # Save to local disk
        ofrendas = load_ofrendas()
        item = {
            "id": f"ofrenda-{len(ofrendas)+1:03d}",
            "name": result["name"],
            "era": result["era"],
            "offerings": result["offerings"],
            "memory": result["memory"],
            "elegy": result["elegy"],
            "candle_lit": True,
            "blessing_timestamp": result["blessing_timestamp"],
            "provider": result["provider"]
        }
        ofrendas.insert(0, item)
        save_ofrendas(ofrendas)
        
        return JSONResponse(item)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

async def api_terminal_decode(request):
    """Decodes cryptic terminal traces & errors into beginner-friendly layman English with exact fixes."""
    try:
        body = await request.json()
        error_log = body.get("error_log", "").strip()
        provider = body.get("provider", "auto")
        decoded = spectral_engine.decode_terminal_error(error_log, provider=provider)
        return JSONResponse(decoded)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

routes = [
    Route("/", homepage),
    Route("/api/vitals", api_vitals),
    Route("/api/ollama/status", api_ollama_status),
    Route("/api/terminal/exec", api_terminal_exec, methods=["POST"]),
    Route("/api/terminal/decode", api_terminal_decode, methods=["POST"]),
    Route("/api/seance/summon", api_seance_summon, methods=["POST"]),
    Route("/api/seance/spirits", api_seance_spirits),
    Route("/api/ofrendas", api_ofrendas_list),
    Route("/api/ofrendas/create", api_ofrenda_create, methods=["POST"]),
    Mount("/static", StaticFiles(directory=str(CURRENT_DIR / "static")), name="static")
]

middleware = [
    Middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
]

app = Starlette(debug=False, routes=routes, middleware=middleware)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8888))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"============================================================")
    print(f" GHOST IN THE MACHINE - SÉANCE & OFRENDA SUITE")
    print(f" Serving on: http://{host}:{port}")
    print(f" Press Ctrl+C to terminate.")
    print(f"============================================================")
    uvicorn.run("app:app", host=host, port=port, log_level="info")
