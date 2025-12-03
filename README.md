CSV Value	Works?	Explanation
https://example.com/logo.png	✅ YES	Public URL loads fine
/team-logos/mi.png	✅ YES	If file is inside public/team-logos/
data:image/png;base64,...	✅ YES	Already a Data URL
C:\Users\Farhan\logo.png	❌ NO	Browser cannot access local PC path
assets/logo.png	❌ NO	Not served by React unless inside public folder


✅ Project Setup Instructions
1. Unzip the project
Extract the downloaded ZIP file to any folder on your system.

✅ 2. Open the project in VS Code
Open Visual Studio Code

Go to File → Open Folder

Select the extracted project folder.

✅ 3. Install dependencies
Open the VS Code terminal:

npm i
This will automatically install all required packages.

✅ 4. Start the development server
After installation, run:

npm run dev
Your project will start, and you can view it in the browser.

📌 Prerequisites (Required Files)
You must have these three CSV files inside the project (usually inside a folder like /csv):

teams.csv

players.csv

categories.csv

⚠ IMPORTANT
The CSV file names must match exactly.

The column headers inside the CSV must also match exactly with what the app expects.

🖼 Adding Team Logos (Important)
✔ Option 1: Online Image (Recommended)
If the logo is online, simply paste the full image URL into the logo column of teams.csv.

Example:

https://example.com/images/mi.png
✔ Option 2: Local Image (Offline Use)
If you want to use a local image, follow these steps:

Step 1: Move your image
Place your logo image inside:

Auction_FrontEnd/public/teams/
Example final path:

Auction_FrontEnd/public/teams/rcb.png
Step 2: Add its relative path in teams.csv
In the logo column, add:

teams/rcb.png
⚠ Do NOT include slashes like /public/ or absolute file paths.
Only use:

teams/<your-image-name>
🎉 You're ready to go!
Your CSV will load team names, players, categories, and logos properly after following the above instructions.