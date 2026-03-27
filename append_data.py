import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

new_flashcards = [
    {
        "id": "14",
        "category": "Rules",
        "front": "Rule 18: TIMESHEETS",
        "back": "No employee shall make, certify or approve any record, statement or report known by him to be false."
    },
    {
        "id": "15",
        "category": "Rules",
        "front": "Rule 24: SMOKING",
        "back": "Smoking is not allowed in any company owned or leased property at any time."
    },
    {
        "id": "16",
        "category": "Quality",
        "front": "What are the 8 Steps of Quality? (Hint: BCCDOSST)",
        "back": "1. Bond, 2. Conductors, 3. Close, 4. Drip collar, 5. Openings, 6. Support conductors, 7. Support cable, 8. Tape ends/nozzle."
    },
    {
        "id": "17",
        "category": "Vault Safety",
        "front": "List some elements of Vault Safety.",
        "back": "Tip Splice, No Spark Phone, RDA III A, Glow in dark arrows, Reverse thread light bulb, Key from CO tech, 2 Fire Extinguishers (water and Halon for electric)."
    },
    {
        "id": "18",
        "category": "Basic Electricity",
        "front": "What is OHM's Law?",
        "back": "The relationship between voltage, current and resistance in a circuit. It takes 1 volt to push 1 amp through 1 ohm of resistance."
    },
    {
        "id": "19",
        "category": "Basic Electricity",
        "front": "What is Capacitance?",
        "back": "The ability of a conductor to hold a charge. It has high resistance to DC, and low resistance to AC."
    },
    {
        "id": "20",
        "category": "Equipment",
        "front": "What are the 5 types of Grounding?",
        "back": "1. Power Co. MGN, 2. Conductor from MGN, 3. Metallic threaded pipe, 4. Electric meter, 5. Ground rod."
    },
    {
        "id": "21",
        "category": "Equipment",
        "front": "Drop Clearance minimums for Railroad and Pool?",
        "back": "Railroad is 27. Pool is 22."
    },
    {
        "id": "22",
        "category": "Equipment",
        "front": "What does a Black coil indicate?",
        "back": "Standard protection"
    },
    {
        "id": "23",
        "category": "Equipment",
        "front": "What is D Encapsulant used for?",
        "back": "Buried and fiber."
    },
    {
        "id": "24",
        "category": "Equipment",
        "front": "What is pipe tight used for?",
        "back": "Pipe tight is used for sealing, but NOT on regulators."
    },
    {
        "id": "25",
        "category": "FioS Cheat Sheet",
        "front": "What does an RF power of -20dBmV or greater indicate?",
        "back": "No RF signal."
    }
]

new_cloze = [
    {
        "id": "f5",
        "text": "Ohm's law states it takes 1 volt to push 1 [?] through 1 ohm of resistance.",
        "answer": "amp"
    },
    {
        "id": "f6",
        "text": "For drop clearance, the minimum height for a railroad is [?].",
        "answer": "27"
    },
    {
        "id": "f7",
        "text": "In Vault Safety, you need 2 fire extinguishers, containing Water and [?] (for electric).",
        "answer": "Halon"
    },
    {
        "id": "f8",
        "text": "A [?] digit alpha-numeric system sets the standards by which we perform operations in BSP.",
        "answer": "nine"
    }
]

db['flashcards'].extend(new_flashcards)
db['fillInTheBlanks'].extend(new_cloze)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Successfully injected Batch 2 data!")
