import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

new_flashcards = [
    {
        "id": "35",
        "category": "Protection",
        "front": "List forms of Mechanical Protection.",
        "back": "Sealed closures, Encapsulated splices, Jell filled cable, Air pressure, Plant separation (Conduit, inner duct, inner dam, U guard, tree guard)."
    },
    {
        "id": "36",
        "category": "Protection",
        "front": "List forms of Electrical Protection.",
        "back": "Bonding, Grounding, Ground rods, IJ's, Choke splices, Coils, Carbons, Fuses, Fusible links, Minimum approach distances."
    },
    {
        "id": "37",
        "category": "RDA Monitoring",
        "front": "What is the accuracy and response time of the RDA IIIA?",
        "back": "Accuracy within 5% of calibrated level. Response time of 10 seconds at 10% of Lowest Explosive Level."
    },
    {
        "id": "38",
        "category": "RDA Calibration",
        "front": "What gas is used for Daily Calibration of the RDA 3A?",
        "back": "5000 PPM (.5%) Methane gas from a GREEN cylinder. NEVER USE C GAS."
    },
    {
        "id": "39",
        "category": "RDA Operation",
        "front": "What happens if the Remote Sensing Unit (RSU) gets soaked or submerged?",
        "back": "It will damage or render the gas sensor inoperable."
    },
    {
        "id": "40",
        "category": "Rubber Gloves",
        "front": "What is the order of the Rubber Gloves 'Spiel' expected at the exam?",
        "back": "1. Bag, 2. Cotton Liners, 3. Leather Gloves, 4. Rubber Gloves."
    },
    {
        "id": "41",
        "category": "Rubber Gloves",
        "front": "What does the Rib at the gauntlet of a rubber glove do?",
        "back": "It is the Flash Over Dam preventing rain or moisture from creating a pathway for possible electrocution."
    },
    {
        "id": "42",
        "category": "PPE",
        "front": "What are the 5 tests for a Hard Hat?",
        "back": "1. Resiliency (Bend Brim)\n2. Visual (cracks, cuts)\n3. Harness (1.5 inch clearance)\n4. Fit (Should not fall off)\n5. Date (5 years once put into service)"
    },
    {
        "id": "43",
        "category": "Equipment",
        "front": "What is Repeater type 809?",
        "back": "Gas tube protected, 12T1S - 239."
    }
]

new_cloze = [
    {
        "id": "f13",
        "text": "For Daily Calibration of the RDA 3A, you must NEVER use [?] gas to test or calibrate.",
        "answer": "C"
    },
    {
        "id": "f14",
        "text": "The Hard Hat standard is ANSI [?] and is rated Type 1 Class E for 20,000 V AC incidental contact.",
        "answer": "Z89.1"
    },
    {
        "id": "f15",
        "text": "In the Rubber Gloves exam spiel, you inspect the bag and note there is a square cut out of the bottom of the plastic liner to allow [?] to drip out.",
        "answer": "moisture"
    },
    {
        "id": "f16",
        "text": "Load case 662 is rated at 88 [?].",
        "answer": "milihenry"
    }
]

db['flashcards'].extend(new_flashcards)
db['fillInTheBlanks'].extend(new_cloze)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Successfully injected Batch 4 data!")
