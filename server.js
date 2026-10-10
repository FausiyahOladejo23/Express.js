
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Custom middleware to check the working hours
function checkWorkingHours(req, res, next) {
    // Get the current date and time on the server
    const now = new Date();

    // getDay(): Sunday = 0, Monday = 1, ..., Saturday = 6
    const day = now.getDay();

    // getHours() returns the hour in the server's local time
    const hour = now.getHours();

    // Allow Monday to Friday, from 9:00 AM to before 5:00 PM
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingHour = hour >= 9 && hour < 17;

    if (isWeekday && isWorkingHour) {
        // Continue to the next middleware or route
        next();
    } else {
        // Block access outside working hours
        res.status(403).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Outside Working Hours</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <main class="message">
          <h1>We are currently closed</h1>
          <p>Our website is available Monday to Friday,
          from 9:00 AM to 5:00 PM.</p>
          <p>Please visit us during working hours.</p>
        </main>
      </body>
      </html>
    `);
    }
}

// Serve CSS files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Apply the custom middleware to all website routes
app.use(checkWorkingHours);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Our Services page
app.get("/services", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "services.html"));
});

// Contact Us page
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send("Page not found.");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});