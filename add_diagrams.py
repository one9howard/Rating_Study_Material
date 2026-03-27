import os
import shutil
import json

base_dir = r"C:\Users\player1\Desktop\DESKTOP FOLDER\rating_stuff"
app_public_dir = os.path.join(base_dir, "safety_app", "public", "diagrams")
db_path = os.path.join(base_dir, "safety_app", "src", "data", "content.json")

os.makedirs(app_public_dir, exist_ok=True)

# The diagrams the user wants to see natively in the app
diagrams_to_copy = [
    os.path.join("safety", "safety_gear.pdf"),
    os.path.join("safety", "vault.pdf"),
    os.path.join("safety", "slc_96_mode1.pdf"),
    os.path.join("safety", "rda_monitoring_system.pdf"),
    os.path.join("safety", "terminals.pdf")
]

diagram_data = [
    {
        "id": "d1",
        "title": "Safety Gear Checklist",
        "filename": "safety_gear.pdf",
        "description": "Hand-drawn breakdown of Class 3 Vests, Hard Hat ANSI testing, and safety boots."
    },
    {
        "id": "d2",
        "title": "Vault Air Pressure Schematics",
        "filename": "vault.pdf",
        "description": "Full structural diagram of the Air Compressor, Condenser, and Manhole Sparta transducers."
    },
    {
        "id": "d3",
        "title": "SLC-96 Multiplexer (Mode 1)",
        "filename": "slc_96_mode1.pdf",
        "description": "Matrix mapping of the ACU, DLU (Brains), and TRU card slots."
    },
    {
        "id": "d4",
        "title": "RDA IIIA Monitoring System",
        "filename": "rda_monitoring_system.pdf",
        "description": "Visual layout of the Central Monitoring Unit and the Remote Sensing Unit."
    },
    {
        "id": "d5",
        "title": "300 Type Back Bay Block",
        "filename": "terminals.pdf",
        "description": "Photographic reference of the 50-pair block terminal mapping."
    }
]

# Copy files
for rel_path in diagrams_to_copy:
    src = os.path.join(base_dir, rel_path)
    if os.path.exists(src):
        dest = os.path.join(app_public_dir, os.path.basename(src))
        shutil.copy2(src, dest)
        print(f"Copied {os.path.basename(src)}")
    else:
        print(f"File not found: {src}")

# Update DB
with open(db_path, "r", encoding="utf-8") as f:
    db = json.load(f)

db["diagrams"] = diagram_data

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2)

print("Database updated with visual diagrams!")
