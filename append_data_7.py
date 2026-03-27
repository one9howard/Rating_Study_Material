import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

new_flashcards = [
    {
        "id": "62",
        "category": "Litespan 2000",
        "front": "What does a complete Litespan 2000 system at the Central Office control?",
        "back": "It controls 5 remote terminals (3 east, 2 west) for a total of 10,080 pots lines."
    },
    {
        "id": "63",
        "category": "Hardware",
        "front": "What is the maximum Ground Wire length for an ONT and a NI (Network Interface)?",
        "back": "150 feet maximum for a Fiber ONT. 20 feet maximum for a copper NI."
    },
    {
        "id": "64",
        "category": "Hardware",
        "front": "What is the RJ45 jack?",
        "back": "It is an 8-position, 8-contact jack, utilized with 9 resistors."
    },
    {
        "id": "65",
        "category": "Fiber",
        "front": "What is the difference between Single-Mode and Multi-Mode fiber?",
        "back": "Single-Mode has a smaller core for less light loss, used for high-speed data, and has YELLOW markings. Multi-Mode has ORANGE markings and is of lesser quality (should not be used anymore)."
    },
    {
        "id": "66",
        "category": "Fiber",
        "front": "What are the characteristics of a Fiber Ribbon Cable?",
        "back": "It contains 6, 12, or 24 fibers. 12 fibers per tube, and 12 tubes per sheath."
    },
    {
        "id": "67",
        "category": "Fiber Networks",
        "front": "What are the specs of GPON vs BPON?",
        "back": "GPON (Gigabit Passive Optical Network) transfers up to 300Gb using TDMA. BPON transfers up to 100Gb."
    },
    {
        "id": "68",
        "category": "Fiber Data",
        "front": "Explain the downstream, upstream, and video nanometer (nm) waves in an optical network.",
        "back": "1490nm = downstream data (2.488 Gbits)\n1310nm = upstream data (1.244 Gbits)\n1550nm = video."
    }
]

new_cloze = [
    {
        "id": "f25",
        "text": "For fiber optic cables, the Single Mode sheaths are marked with the color [?].",
        "answer": "yellow"
    },
    {
        "id": "f26",
        "text": "The OLT grants time slots to ONTs every 125 [?] in a TDMA network.",
        "answer": "microsec"
    },
    {
        "id": "f27",
        "text": "ADSL (Asymmetrical DSL) adapts by shifting the rate in the pipe to allow higher [?] speeds when little upload is being used.",
        "answer": "download"
    },
    {
        "id": "f28",
        "text": "When assessing a pole to climb, a symbol indicating a [?] means the pole is condemned and to be replaced.",
        "answer": "square with an X"
    }
]

db['flashcards'].extend(new_flashcards)
db['fillInTheBlanks'].extend(new_cloze)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Successfully injected Batch 7 data! The Database is complete.")
