const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./insertDB');
const port = require('./config.js');
const PathHandler = require('./pathHandler.js');

// instance of PathHandler
const pathHandler = new PathHandler(db);
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
db.establishConnection();

// Define routes using PathHandler methods
app.get('/kitchens', pathHandler.handleKitchensRequest.bind(pathHandler));
app.get('/users/kitchens', pathHandler.handleUsersKitchensRequest.bind(pathHandler));
app.get('/kitchens/totalWaste', pathHandler.handleTotalWasteRequest.bind(pathHandler));
app.get('/kitchens/total', pathHandler.handleTotalKitchensWasteRequest.bind(pathHandler));
app.get('/kitchens/:week', pathHandler.handleWeekKitchensRequest.bind(pathHandler));

app.get('/kitchens/:id', pathHandler.handleKitchenByIdRequest.bind(pathHandler));
app.post('/prize', pathHandler.handlePrizeRequest.bind(pathHandler));
app.post('/kitchens', pathHandler.handleKitchenInsertionRequest.bind(pathHandler));
app.post('/create', pathHandler.handleUserCreationRequest.bind(pathHandler));
app.post('/logging', pathHandler.handleLoginRequest.bind(pathHandler));
app.get('/users', pathHandler.handleUserListRequest.bind(pathHandler));
app.get('/vis', pathHandler.handleVisualizationRequest.bind(pathHandler));
app.put('/kitchenUpdate/:id', pathHandler.handleUpdateKitchenRequest.bind(pathHandler)); // New PUT route

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
