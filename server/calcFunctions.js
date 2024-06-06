
// Function to parse float value with default of 0
function parseFloatOrDefault(value) {
    return parseFloat(value) || 0;
}

// Function to calculate matminus value
function calculateMatMinus(amountServFood, savedFood) {
    return parseFloatOrDefault(amountServFood) - parseFloatOrDefault(savedFood);
}

// Function to calculate kitchen waste
function calculateKitchenWaste(preparationWaste, cookingWaste, storageWaste) {
    return parseFloatOrDefault(preparationWaste) + parseFloatOrDefault(cookingWaste) + parseFloatOrDefault(storageWaste);
}

// Function to calculate total food waste
function calculateTotalFoodWaste(servingWaste, plateWaste) {
    return parseFloatOrDefault(servingWaste) + parseFloatOrDefault(plateWaste);
}

// Function to calculate total per value
function calculateTotper(totalFoodWaste, eaters) {
    return totalFoodWaste !== 0 ? (((totalFoodWaste * 100) / parseFloatOrDefault(eaters)) * 10) : 0;
}

// Function to calculate procent value
function calculateProcent(totalFoodWaste, matminus) {
    return matminus !== 0 ? ((totalFoodWaste / matminus) * 100) : 0;
}

// Function to calculate amount Eaten Per Person value
function calculateAmountEatenPerPerson(matminus, totper) {
    return matminus !== 0 ? -totper : 0;
}

function getFoodWasteData(selectedDate,kitchen, callback) {
    const [day, week, year] = selectedDate.split(' ');
    console.log(`Converted year: ${day}, ${week}, ${year}`);

    const sql = "SELECT * FROM kitchens WHERE day = ? AND week = ? AND year = ? AND kitchen = ? ";
    db.query(sql, [day, week, year, kitchen], (err, data) => {
        if (err) {
            console.log('ERROR 500:', err);
            callback({ error: err.message }, null);
        } else if (data.length === 0) {
            console.log('Kitchen not found');
            callback(null, { data: [] });
        } else {
            console.log('Data retrieved successfully');
            callback(null, { data });
        }

    });
}
module.exports = {
    parseFloatOrDefault,
    calculateMatMinus,
    calculateKitchenWaste,
    calculateTotalFoodWaste,
    calculateTotper,
    calculateProcent,
    calculateAmountEatenPerPerson,
    getFoodWasteData
};

