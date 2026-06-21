# v1.2.1

## Documentation & Open Source
* **README Masterclass:** Completely rewrote the `README.md` to serve as a production-grade, recruiter-ready technical showcase.
* **Architecture Diagrams:** Integrated an Excalidraw Entity-Relationship schema to visually explain the relational integrity of the SQLite database.
* **UI Gallery:** Embedded 8 high-resolution UI showcase screenshots via responsive HTML flex grids to guarantee uniform rendering across all devices.
* **CI/CD Reliability:** Fixed `.gitignore` override that was preventing GitHub Actions from pulling Markdown files during the automated APK build process.

## UI & UX Polish
* **Expanded Touch Targets:** Completely restructured the Account and Category pickers in the `AddExpenseSheet`. The entire tile is now clickable (rather than just the text), improving mobile accessibility.
* **Native Feedback:** Added subtle `active:bg-black/5` touch feedback to pickers so users feel immediate native responsiveness.
* **Settings Spacing:** Improved vertical padding above the About & Legal section for cleaner separation of domains.
* **Clickable Developer Link:** Converted the Developer credit tile into a `Pressable` link that automatically routes to the GitHub repository.


