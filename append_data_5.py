import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

new_flashcards = [
    {
        "id": "44",
        "category": "SLC 96",
        "front": "In an SLC 96 system, what does the TAU (Time Assignment Unit) do in Mode 2?",
        "back": "Assigns Priority to calls and keeps a log of blocked calls. Mode 2 uses 48 dial tones for 96 customers."
    },
    {
        "id": "45",
        "category": "SLC 96",
        "front": "What does Mode 3 of SLC 96 utilize?",
        "back": "It utilizes an MXU (Multiplexer Unit). It has 48 circuits and can have a DT PayPhone Line."
    },
    {
        "id": "46",
        "category": "Tapes",
        "front": "Why is Friction Tape not used in underground wraps?",
        "back": "Because it is gasoline soluble. It is used as a final aerial wrap."
    },
    {
        "id": "47",
        "category": "Solders",
        "front": "What is Sterine Core solder used for?",
        "back": "It is used for wiping lead to lead, and is also used to check serrations on long nose pliers."
    },
    {
        "id": "48",
        "category": "Terminals",
        "front": "On a 300 TYPE block, how does the 50 pair block count work?",
        "back": "Counts Top to Bottom. Odd on the left, Even on the right. Cross wired on the right, test contacts on the left."
    },
    {
        "id": "49",
        "category": "Test Sets",
        "front": "What does a Sidekick test set's Leakage Test do?",
        "back": "It uses 135 VDC to punch through the oxide layer of a fault on a dry pair."
    },
    {
        "id": "50",
        "category": "Test Sets",
        "front": "What does the Shortstop test set use?",
        "back": "It uses TDR (Time Domain Reflectometry) with a range of 2000-2500 feet."
    },
    {
        "id": "51",
        "category": "Air Pressure",
        "front": "How much water will 1 PSI keep out?",
        "back": "1 PSI will keep out 2 feet of water."
    },
    {
        "id": "52",
        "category": "Air Pressure",
        "front": "What system monitors the remote Manhole pressure transducers?",
        "back": "The Sparta System monitors the transducers placed out in the manholes."
    }
]

new_cloze = [
    {
        "id": "f17",
        "text": "In the SLC 96 Mode 1, the DLU or Data Link Unit acts as the [?] of the system.",
        "answer": "brains"
    },
    {
        "id": "f18",
        "text": "For test set work codes, 112 is pole to building, while [?] is Manhole (MH) to building.",
        "answer": "212"
    },
    {
        "id": "f19",
        "text": "The Parkway 276 test set contains a tone generator, an ohm meter, and a [?] line.",
        "answer": "talk"
    },
    {
        "id": "f20",
        "text": "Rosin Core solder is used in Central Offices for cross wiring and soldering to [?].",
        "answer": "copper"
    }
]

db['flashcards'].extend(new_flashcards)
db['fillInTheBlanks'].extend(new_cloze)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Successfully injected Batch 5 data!")
