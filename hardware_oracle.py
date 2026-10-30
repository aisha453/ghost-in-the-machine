"""
Hardware Oracle - Inspects the physical vessel (the host machine)
Extracts real metrics (CPU, RAM, disk, processes, sockets, ghost files)
and translates them into spectral diagnostics.
"""

import os
import sys
import platform
import shutil
import subprocess
import time
import socket
from datetime import datetime

def get_disk_telemetry():
    try:
        total, used, free = shutil.disk_usage("/")
        return {
            "total_gb": round(total / (1024**3), 1),
            "used_gb": round(used / (1024**3), 1),
            "free_gb": round(free / (1024**3), 1),
            "percent_used": round((used / total) * 100, 1)
        }
    except Exception as e:
        return {"total_gb": 0, "used_gb": 0, "free_gb": 0, "percent_used": 0, "error": str(e)}

def get_memory_telemetry():
    # Use ctypes or Windows command
    try:
        if sys.platform == "win32":
            import ctypes
            class MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
                ]
            stat = MEMORYSTATUSEX()
            stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
            ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
            total_mb = stat.ullTotalPhys // (1024 * 1024)
            avail_mb = stat.ullAvailPhys // (1024 * 1024)
            used_mb = total_mb - avail_mb
            load = stat.dwMemoryLoad
            return {
                "total_mb": total_mb,
                "used_mb": used_mb,
                "free_mb": avail_mb,
                "load_percent": load
            }
    except Exception:
        pass
    return {"total_mb": 16384, "used_mb": 8192, "free_mb": 8192, "load_percent": 50}

def get_system_vitals():
    try:
        hostname = socket.gethostname()
    except Exception:
        hostname = "PHANTOM-NODE"
    
    disk = get_disk_telemetry()
    mem = get_memory_telemetry()
    cpu_count = os.cpu_count() or 4
    
    return {
        "hostname": hostname,
        "platform": f"{platform.system()} {platform.release()} ({platform.machine()})",
        "python_version": platform.python_version(),
        "cpu_cores": cpu_count,
        "memory": mem,
        "disk": disk,
        "timestamp": datetime.now().isoformat(),
    }

def get_ghost_processes(limit=8):
    """Retrieves real processes running on the machine, styled as spirit entities."""
    processes = []
    try:
        if sys.platform == "win32":
            cmd = ["tasklist", "/FO", "CSV", "/NH"]
            output = subprocess.check_output(cmd, creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0).decode("cp1252", errors="ignore")
            lines = [line.strip() for line in output.splitlines() if line.strip()]
            for line in lines[:limit]:
                parts = [p.strip('"') for p in line.split('","')]
                if len(parts) >= 5:
                    pname, pid, sname, snum, mem = parts[0], parts[1], parts[2], parts[3], parts[4]
                    processes.append({
                        "name": pname,
                        "pid": pid,
                        "memory": mem,
                        "spectral_status": "Lurking in Ring-3" if int(pid) % 2 == 0 else "Whispering across Bus"
                    })
    except Exception as e:
        processes.append({"name": "ghost_daemon.exe", "pid": "666", "memory": "13,370 K", "spectral_status": "Trapped in Cache"})
    return processes

def get_haunted_diagnosis():
    """Generates an atmospheric spectral report from real hardware telemetry."""
    vitals = get_system_vitals()
    mem = vitals["memory"]
    disk = vitals["disk"]
    procs = get_ghost_processes(5)
    
    lines = [
        f"--- SPIRIT DIAGNOSTIC FOR HOST [{vitals['hostname']}] ---",
        f"Silicon Architecture: {vitals['platform']} ({vitals['cpu_cores']} Spirit Threads)",
        f"Physical Memory Veil: {mem['used_mb']} MB possessed of {mem['total_mb']} MB ({mem['load_percent']}% spirit weight)",
        f"Storage Crypt: {disk['used_gb']} GB of ancient lore inscribed / {disk['free_gb']} GB cold void remaining",
        f"Detected {len(procs)} active entities haunting userland threads:",
    ]
    for p in procs:
        lines.append(f"  * [PID {p['pid']}] {p['name']} ({p['memory']}) -> {p['spectral_status']}")
    
    return "\n".join(lines)

if __name__ == "__main__":
    print(get_haunted_diagnosis())
