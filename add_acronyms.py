import json
import os

data_path = 'src/data/content.json'

with open(data_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

db['acronyms'] = [
  {"id": "a1", "title": "8 Steps of Quality (BCCDOSST)", "words": ["Bond", "Conductors", "Close", "Drip Collar", "Openings", "Support Conductors", "Support Cable", "Tape ends"]},
  {"id": "a2", "title": "Hazardous Gases (PAGAN HAMMER BC)", "words": ["Propane", "Acetylene", "Gasoline", "Alcohol", "Natural Gas", "Hydrogen", "Ammonia", "Methane", "Mapp Gas", "Ethylene", "Refrigerants", "Butane", "Carbon Monoxide"]},
  {"id": "a3", "title": "Rubber Glove Exam Spiel", "words": ["Bag", "Cotton Liners", "Leather Gloves", "Rubber Gloves"]},
  {"id": "a4", "title": "Rubber Glove 5 Tests", "words": ["Date", "Stretch", "Resiliency", "Finger Roll", "Air Tightness"]}
]

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Added acronym mini-game data!")
