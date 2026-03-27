import json
import uuid

json_path = 'c:/Users/player1/Desktop/DESKTOP FOLDER/rating_stuff/safety_app/src/data/content.json'

rules_data = [
    {"front": "Rule 1: LAWS", "back": "Every employee is expected to be familiar with and obey all public laws, company or departmental rules, instructions, specifications etc. covering or relating to their conduct as an agent of the company, or the work on which they are engaged. Lack of such knowledge will not serve to excuse any failure to observe them."},
    {"front": "Rule 2: LOYALTY", "back": "A steadfast loyalty to the companies interest is demanded from every employee, in order that the company may faithfully perform the duties with which it is charged."},
    {"front": "Rule 3: HONESTY", "back": "The company expects and requires absolute honesty from every employee in all dealings with the public, the company, and fellow employees."},
    {"front": "Rule 4: EFFORT", "back": "The company expects from each employee a maximum of efficient effort on every undertaking assigned to them."},
    {"front": "Rule 5: SERVICE", "back": "Every employee must guard against unnecessary interruption or interference with the service."},
    {"front": "Rule 6: ORDER", "back": "No employee may order, purchase, rent or in any manner acquire in the name of the company, or commit it to acquire, property, goods or services of any nature except as regularly or specifically authorized."},
    {"front": "Rule 7: PROPERTY", "back": "No employee may loan, give, sell or destroy or otherwise dispose of the company's property, equipment, supplies or services except as regularly or specifically authorized and must disburse, use and account for such property etc. in exact accordance with his or her instructions."},
    {"front": "Rule 8: RESPECT", "back": "Employees as such must at all times respect the personal property, rights and privileges of other persons, and avoid any act, statement or neglect which may give offense or involve the company in controversies or litigation of any kind."},
    {"front": "Rule 9: FUNDS", "back": "Employees to whom are entrusted funds of the company will be held personally responsible to safeguard and disburse them in exact accordance with the instructions on this subject."},
    {"front": "Rule 10: PREVENT INJURY", "back": "To prevent injury to persons or property the company requires each employee to exercise every practicable precaution in performing his work, to report any condition or any practice, negligence or incompetence of others which endangers himself, the public or other workmen and to aid and assist any employee or non-employee who may become injured during the course of our work."},
    {"front": "Rule 11: DRUGS", "back": "The use of intoxicating beverages or drugs, engaging in games of chance, placing bets, bookmaking or other unlawful acts are not permitted on the company's premises at any time or elsewhere while on company business."},
    {"front": "Rule 12: BUILDING", "back": "Additions to, removals from or changes in any respect of the specified or original design of building, equipment or other plant, is not permitted except as duly authorized and instructed."},
    {"front": "Rule 13: ENGAGE BUSINESS", "back": "Employees shall not engage in business or act as employee or agent of any person or concern to the detriment directly or indirectly of the company's interest."},
    {"front": "Rule 14: PR", "back": "Making unauthorized statements in the public or press regarding company affairs is not permitted."},
    {"front": "Rule 15: RECOMMENDATION EQUIPMENT", "back": "As an agent of the company, employees shall not give recommendation or testimonial for any equipment, material or process except to the company."},
    {"front": "Rule 16: EXHIBIT RECORDS", "back": "No employee shall exhibit company records, plans or correspondence, or convey the information contained therein to any person unless specifically authorized to do so."},
    {"front": "Rule 17: TESTIMONY", "back": "Employee's shall not volunteer expert testimony without proper approval."},
    {"front": "Rule 18: TIMESHEETS", "back": "No employee shall make, certify or approve any record, statement or report known by him to be false."},
    {"front": "Rule 19: COMPANY MATERIALS", "back": "No employee shall use the company's materials, vehicles, equipment or other property for personal purposes without permission."},
    {"front": "Rule 20: PROPERTY SUBSCRIBER", "back": "No employee shall use the property of a subscriber or other person or concern for company or personal purposes without permission."},
    {"front": "Rule 21: ABSENT", "back": "Employees must notify their respective supervisors at any time when it is necessary for them to be absent or tardy."},
    {"front": "Rule 22: SOLICIT", "back": "No employee shall solicit subscriptions among employees during working hours without permission."},
    {"front": "Rule 23: EXPLOSIVES", "back": "Unnecessarily bringing or permitting explosives or combustibles in or near to the company's buildings or premises is not permitted."},
    {"front": "Rule 24: SMOKING", "back": "Smoking is not allowed in any company owned or leased property at any time."},
    {"front": "Rule 25: COMPANY NAME", "back": "No employee shall use the company's name or account to purchase goods for personal use."},
    {"front": "Rule 26: PERMISSION TO PURCHASE", "back": "Employees shall not, without permission, purchase directly, any supplies or equipment which should be obtained on requisition."},
    {"front": "Rule 27: NON-STANDARD EQUIPMENT", "back": "No employee shall except from agents or others, non-standard equipment, tools or materials for trial or demonstration."},
    {"front": "Rule 28: LOAN BADGES", "back": "Employees are not permitted to loan badges, books, tools or property of the company."},
    {"front": "Rule 29: ASSIGN WAGES", "back": "Employees may not assign their wages or otherwise involve the company in their personal affairs."},
    {"front": "Rule 30: DAMAGE", "back": "Employees shall report promptly and in accordance with instructions, any accidental damage they may have caused or which has come to their attention."},
    {"front": "Rule 31: TRIM", "back": "Permission to work on private property or to trim or cut trees on the highway or elsewhere should be obtained before such work is started."}
]

with open(json_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# Erase the sloppy incomplete rules
db['flashcards'] = [c for c in db['flashcards'] if c.get('category') != 'Rules']

# Build the new exact cards
new_cards = []
for r in rules_data:
    new_cards.append({
        "id": str(uuid.uuid4()),
        "category": "Rules",
        "front": r["front"],
        "back": r["back"]
    })

# prepend the pure 31
db['flashcards'] = new_cards + db['flashcards']

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print(f"Successfully injected 31 rules verbatim.")
