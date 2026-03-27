import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

new_flashcards = [
    {
        "id": "53",
        "category": "Work Area Protection",
        "front": "What is the rule for placing signs regarding speed limits 35MPH and over?",
        "back": "Place sign 10 times the speed limit back. For example, 35 MPH = sign should be 350 feet back."
    },
    {
        "id": "54",
        "category": "Work Area Protection",
        "front": "Can you use your truck as a shield?",
        "back": "No, do not use your truck as a shield. Park beyond the manhole, in the same direction as traffic."
    },
    {
        "id": "55",
        "category": "Electrolysis",
        "front": "What is Electrolysis in cables and how is it fought?",
        "back": "Electrolysis is stray DC current traveling along the lead sheath, decaying it. It is fought using Bonding/Grounding, Magnesium Strips, IJ's, and Anodes."
    },
    {
        "id": "56",
        "category": "Terminals",
        "front": "What is unique about the 134A1A Protected Interior Terminal?",
        "back": "It is carbon protected, and there is NO loss of dial tone (dt) when the fuse is pulled, unlike the 190."
    },
    {
        "id": "57",
        "category": "Closures",
        "front": "What is a Trac Closure?",
        "back": "A toolless reenterable aerial closure."
    },
    {
        "id": "58",
        "category": "SLC 96",
        "front": "What is the function of the LSU (Line Switch Unit)?",
        "back": "It directs automatic switching to a shared protection line during a failure."
    },
    {
        "id": "59",
        "category": "SLC 96",
        "front": "What does the SSU (Special Service Unit) do?",
        "back": "Provides delayed processing signal for PBX trunks, synchronizes timing on circuits, and quiets channel noise."
    },
    {
        "id": "60",
        "category": "SLC 96",
        "front": "What occurs if the PU (Power Unit) shuts down?",
        "back": "It must be removed for 5 seconds and reseated."
    },
    {
        "id": "61",
        "category": "SLC 96",
        "front": "What is the TRU (Transmit / Receive Unit) responsible for?",
        "back": "It encodes channel sampling to PCM on transmit, and decodes/demultiplexes the PCM signal on receive."
    }
]

new_cloze = [
    {
        "id": "f21",
        "text": "For speed limits 30 MPH and under, you place the Men Working sign [?] times the speed limit back.",
        "answer": "7"
    },
    {
        "id": "f22",
        "text": "To fight electrolysis, you can use [?] strips because sheaths give electrolysis something to eat besides lead.",
        "answer": "magnesium"
    },
    {
        "id": "f23",
        "text": "The [?] is used in place of the LSU in an SLC-96 when it is fed by fiber.",
        "answer": "ASU"
    },
    {
        "id": "f24",
        "text": "The 3M encapsulated closure is considered the [?] buried closure compared to the 16 Type.",
        "answer": "better"
    }
]

db['flashcards'].extend(new_flashcards)
db['fillInTheBlanks'].extend(new_cloze)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Successfully injected Batch 6 data!")
