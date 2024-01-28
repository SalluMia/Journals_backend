//Generic Calls
require("dotenv").config();
const express = require("express");
const server = express();
const path = require("path");
const cors = require("cors");

//DATABASE Connection
require("./config/DbConnect")();

//Admin Routes
const adminJournalRoutes = require("./adminRoutes/adminJournalRoutes");

//User ROUTES
const userAuthRoutes = require("./routes/UserAuthRoutes");
const userJournalRoutes = require("./routes/UserJournalRoute");

server.use(express.json());
server.use(cors({origin:true}));
server.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
server.use(
  "/uploads/documents",
  express.static(path.join(__dirname, "uploads", "documents"))
);

//Admin Routes
server.use("/api/admin", adminJournalRoutes);

//User Routes
server.use("/api/users", userAuthRoutes);
server.use("/api/users", userJournalRoutes);

//Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.info(`server is running at ${PORT}.`);
});
