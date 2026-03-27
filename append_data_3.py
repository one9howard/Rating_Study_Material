import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

new_flashcards = [
    {
        "id": "26",
        "category": "Basic Electricity",
        "front": "What does an Inductor do?",
        "back": "Preserves current by storing energy in a magnetic field (ex. Load Coil). Load coils increase inductance."
    },
    {
        "id": "27",
        "category": "Drop Wire",
        "front": "What is the Drop Wire horizontal and vertical clearance from power at a house attachment?",
        "back": "Horizontal: 40 inches. Vertical: 18 inches."
    },
    {
        "id": "28",
        "category": "Litespan 2000",
        "front": "What is the Litespan 2000?",
        "back": "A Multiplexer. It is a SONET-based system."
    },
    {
        "id": "29",
        "category": "Loading",
        "front": "What is the purpose of Loading?",
        "back": "To increase loop resistance and bring the pair back into phase."
    },
    {
        "id": "30",
        "category": "Loading",
        "front": "What frequencies do Load Coils block?",
        "back": "Frequencies between 3,400 Hz and 4,200 Hz."
    },
    {
        "id": "31",
        "category": "Manhole Safety",
        "front": "If you see a rainbow on the water near or in a manhole, what should you assume?",
        "back": "Assume gasoline. There is no need to test if you smell it."
    },
    {
        "id": "32",
        "category": "Manhole Safety",
        "front": "How do you test a Dry manhole hole with an explosimeter?",
        "back": "Put the sampling hose at head level, use 8 squeezes minimum."
    },
    {
        "id": "33",
        "category": "Air Pressure",
        "front": "What are the minimum Air Pressure PSI guidelines for cables?",
        "back": "Aerial: 2 psi\nBuried: 3 psi\nUnderground: 5 psi\nSubmarine: 6 psi\nEnd pipe: 7 psi"
    },
    {
        "id": "34",
        "category": "Safety Sins",
        "front": "What are the 7 Deadly Sins (Plus the unofficial 8th)?",
        "back": "1. Working aloft without hard hat.\n2. Working aloft without 188A testing.\n3. Bucket without lanyard/chocks.\n4. Ladder without safety straps.\n5. Manhole without blower or RDA III.\n6. Working without safety glasses.\n7. No seatbelt.\n*8. Using cell phone while driving."
    }
]

new_cloze = [
    {
        "id": "f9",
        "text": "Before placing J Hooks, ensure they are placed [?] inches above strand to the house, or [?] inches below strand.",
        "answer": "4, 6"
    },
    {
        "id": "f10",
        "text": "When checking a Wet manhole for hazardous gases, you should take a reading [?] above the water with 8 squeezes minimum.",
        "answer": "1' ft"
    },
    {
        "id": "f11",
        "text": "In the Litespan 2000 multiplexer, a channel bank consists of 56 cards which equals [?] POTS lines.",
        "answer": "224"
    },
    {
        "id": "f12",
        "text": "A load coil blocks frequencies between [?] and [?] Hz.",
        "answer": "3400, 4200"
    }
]

db['flashcards'].extend(new_flashcards)
db['fillInTheBlanks'].extend(new_cloze)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Successfully injected Batch 3 data!")
