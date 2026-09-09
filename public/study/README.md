# RATING STUDY APP

A standalone, browser-based study aid built from the supplied technician study material. It runs locally and does not send study progress anywhere.

## Run it

From the repository root, start a local web server:

```powershell
python -m http.server 4173 --directory splice-study-app
```

Then open `http://localhost:4173` in a browser.

## Included drills

- Searchable course library with 43 source PDFs, the 31-rule transcript, and the rules karaoke video
- 94 flashcards across rules, PPE, equipment, safety, fiber, air pressure, SLC-96, terminals, and more
- 28 fill-in-the-blank recall prompts and sequence-based memory exercises
- SLC-96 Mode 2 and Mode 3 shelf/card reconstruction
- Air-pressure route placement for transducers, manifolds, and the flow transducer
- Load-coil planning questions
- Timed blank-paper drawing canvas with reference-diagram reveal

The PDFs in `assets/source-pdfs/` and `assets/reference-diagrams/`, the rule transcript, and the karaoke video are copies of the matching material from the supplied archive and are used solely as study references. Verify all procedures and equipment details against current official training material.
