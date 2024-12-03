const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cors=require('cors');
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.static(path.join(__dirname,  'servere')));
console.log("Serving static files from: ", path.join(__dirname, '..', 'client'));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));



// Middleware to parse JSON
app.use(express.json());

// Set the file path for stores.json
const filepath = path.join(__dirname, "stores.json");

// Log __dirname and the filepath

const items = JSON.parse(fs.readFileSync(filepath));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..',  'client', 'index.html'));  
});
// Endpoint to get store data
app.get("/stores", (req, res) => {
  try {
    res.json(items);
  } catch (error) {
    console.error("Error reading file:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//GET items by id
app.get("/stores/:id", (req, res) => {
  const id = req.params.id * 1; // Convert string to number
  const item = items.find((currentitem) => currentitem.id === id);
  if (!item) {
    return res.status(404).send("no data found");
  }
  res.status(200).json(item);
});

app.post("/stores",  (req, res) => {
  const newstore = {
    id: items.length + 1,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [req.body.geometry.coordinates[0],req.body.geometry.coordinates[1]],
    },
    properties: {
      name: req.body.properties.name,
      address: req.body.properties.address,
      phone: req.body.properties.phone,
    },
  };
  items.push(newstore);

  try {
    fs.writeFileSync(filepath, JSON.stringify(items, null, 2)); // Pretty print the JSON
    res.status(201).json(newstore); // Send back the newly created store
  } catch (error) {
    console.error("Error saving new store:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Start the server
app.listen(3000, () => {
  console.log("Server has started on port 3000");
});
