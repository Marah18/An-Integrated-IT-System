const {
    parseFloatOrDefault,
    calculateMatMinus,
    calculateKitchenWaste,
    calculateTotalFoodWaste,
    calculateTotper,
    calculateProcent,
    calculateAmountEatenPerPerson
} = require('./calcFunctions.js');

class PathHandler {
    constructor(db) {
        this.db = db;
        this.bcrypt = require('bcrypt');

    }

    handleKitchensRequest(req, res) {
        const sql = "SELECT * FROM kitchens";
        this.db.query(sql, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(data);
        });
    }

    handleUsersKitchensRequest(req, res) {
        const sql = "SELECT kitchen, type FROM users";
        this.db.query(sql, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(data);
        });
    }

    handleTotalWasteRequest(req, res) {
        const sql = `
            SELECT kitchen, year, SUM(totalFoodWaste) AS totalFoodWaste 
            FROM kitchens 
            GROUP BY kitchen, year 
            ORDER BY year, kitchen
        `;
        this.db.query(sql, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(data);
        });
    }

    handleTotalKitchensWasteRequest(req, res) {
        const kitchen = req.query.kitchen;
        const sql = `
            SELECT year, week, SUM(totalFoodWaste) AS totalFoodWaste 
            FROM kitchens 
            WHERE kitchen = ?
            GROUP BY year, week 
            ORDER BY year, week
        `;
        this.db.query(sql, [kitchen], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(data);
        });
    }

    handleWeekKitchensRequest(req, res) {
        const { week } = req.params;
        const { kitchen } = req.query;
        const sql = ` SELECT year, day, totalFoodWaste FROM kitchens WHERE week = ? AND kitchen = ? 
         `;
        this.db.query(sql, [week, kitchen], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(data);
        });
    }

   
    handleKitchenByIdRequest(req, res) {
        const { id } = req.params;
        const sql = "SELECT * FROM kitchens WHERE id = ?";
        console.log(id)
        this.db.query(sql, [id], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            if (data.length === 0) return res.status(404).json({ message: `${id.kitchen}Kitchen not found!` });
            return res.json(data[0]);
        });
    }

    handlePrizeRequest(req, res) {
        const selectedDate = req.body.selectedDate;
        const kitchen = req.body.kitchen;

        if (!selectedDate || !kitchen) {
            return res.status(400).json({ error: 'Selected date and kitchen name are required.' });
        }

        this.getFoodWasteData(selectedDate, kitchen, (error, foodWasteData) => {
            if (error) {
                console.error('Error fetching food waste data:', error);
                return res.status(500).json({ error: 'Internal server error.' });
            } else {
                res.status(200).json(foodWasteData);
            }
        });
    }

    handleKitchenInsertionRequest(req, res) {
        const { year, week, day, amountServFood, storageWaste, preparationWaste, cookingWaste, servingWaste, plateWaste, eaters, dish, unavoidableFoodWaste, savedFood, kitchen, email } = req.body;
        const parsedYear = parseInt(year, 10);

        if (isNaN(parsedYear)) {
            return res.status(400).json({ error: 'Invalid value for year' });
        }
        const matminus = calculateMatMinus(amountServFood, savedFood);
        const kitchenWaste = calculateKitchenWaste(preparationWaste, cookingWaste, storageWaste);
        const totalFoodWaste = calculateTotalFoodWaste(servingWaste, plateWaste);
        const totper = calculateTotper(totalFoodWaste, eaters);
        const procent = calculateProcent(totalFoodWaste, matminus);
        const amountEatenPerPerson = calculateAmountEatenPerPerson(matminus, totper);

        const sql = "INSERT INTO kitchens (year, week, day, amountServFood, minusMat, storageWaste, preparationWaste, cookingWaste, kitchenWaste, servingWaste, plateWaste, totalFoodWaste, eaters, totper, procent, Eatenfood, dish, unavoidableFoodWaste, savedFood, kitchen, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

        this.db.query(sql, [year, week, day, amountServFood, matminus, storageWaste, preparationWaste, cookingWaste, kitchenWaste, servingWaste, plateWaste, totalFoodWaste, eaters, totper, procent, amountEatenPerPerson, dish, unavoidableFoodWaste, savedFood, kitchen, email], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(201).json({ message: 'Data inserted successfully', id: result.insertId });
        });
    }

    
    handleUserCreationRequest(req, res) {
        // Hash the password
        console.log(req.body)
        this.bcrypt.hash(req.body.password, 10, (hashErr, hash) => {
            if (hashErr) {
                return res.json({ message: "Error hashing password" });
            }
            const sql = "INSERT INTO users (`email`,`password`,`type`, `kitchen`) VALUES (?, ?, ?, ?)";
            const values = [req.body.email, hash, req.body.type, req.body.kitchen];

            this.db.query(sql, values, (err, result) => {
                if (err) {
                    console.log(err)
                    console.log("Email or kitchen name already used!")
                    return res.json({ message: "Email or kitchen name already used!" + err });
                    
                }
                console.log("New kitchen inserted")
                return res.json({ message: "User added successfully" });
            });
        });
    }



    handleLoginRequest(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const sql = "SELECT * FROM users WHERE email = ?";
        const values = [email];
        this.db.query(sql, values, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const user = results[0];
            // check the hashed password is same as the provided password
            this.bcrypt.compare(password, user.password, (compareErr, isMatch) => {
                if (compareErr) {
                    return res.status(500).json({ message: "Internal server error" });
                }
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                return res.status(200).json({ message: "Login successful", user });
            });
        });
    }


    handleUserListRequest(req, res) {
        const sql = "SELECT * FROM users ";
        this.db.query(sql, (err, data) => {
            console.log(err);
            if (err) return res.json(err);
            return res.json(data);
        })
    }

    

    handleVisualizationRequest(req, res) {
        const { week, year } = req.query;
        const sql = `SELECT kitchen, preparationWaste, cookingWaste, servingWaste, plateWaste FROM kitchens WHERE week = ? AND year = ?`;
        this.db.query(sql, [week, year], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        });
    }

    handleUpdateKitchenRequest(req, res) {
        const { id } = req.params;
        let { storageWaste, preparationWaste, cookingWaste, servingWaste, plateWaste, eaters, dish, unavoidableFoodWaste, savedFood, amountServFood, kitchen } = req.body;

        amountServFood = parseFloatOrDefault(amountServFood);
        const matminus = calculateMatMinus(amountServFood, savedFood);
        const kitchenWaste = calculateKitchenWaste(preparationWaste, cookingWaste, storageWaste);
        const totalFoodWaste = calculateTotalFoodWaste(servingWaste, plateWaste);
        const totper = calculateTotper(totalFoodWaste, eaters);
        const procent = calculateProcent(totalFoodWaste, matminus);
        const amountEatenPerPerson = calculateAmountEatenPerPerson(matminus, totper);

        const sql = `
            UPDATE kitchens
            SET 
                amountServFood = ?,
                minusMat = ?,
                storageWaste = ?,
                preparationWaste = ?,
                cookingWaste = ?,
                kitchenWaste = ?,
                servingWaste = ?,
                plateWaste = ?,
                totalFoodWaste = ?,
                eaters = ?,
                totper = ?,
                Eatenfood = ?,
                procent = ?,
                dish = ?,
                unavoidableFoodWaste = ?,
                savedFood = ?,
                kitchen = ?

            WHERE 
                id = ?;
            `;

        const params = [
            amountServFood,
            matminus,
            storageWaste,
            preparationWaste,
            cookingWaste,
            kitchenWaste,
            servingWaste,
            plateWaste,
            totalFoodWaste,
            eaters,
            totper,
            amountEatenPerPerson,
            procent,
            dish,
            unavoidableFoodWaste,
            savedFood,
            kitchen,
            id
        ];

        this.db.query(sql, params, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const selectSql = "SELECT * FROM kitchens WHERE id = ?";
            this.db.query(selectSql, [id], (selectErr, selectResult) => {
                if (selectErr) {
                    return res.status(500).json({ error: selectErr.message });
                }

                if (selectResult.length === 0) {
                    return res.status(404).json({ message: 'Item not found' });
                }

                const updatedItem = selectResult[0];
                return res.status(200).json(updatedItem);
            });
        });
    }

    getFoodWasteData(selectedDate, kitchen, callback) {
        console.log('Selected Date:', selectedDate);
        console.log('Kitchen:', kitchen);
        
        const [day, week, year] = selectedDate.split(' ');
        
        console.log('Day:', day);
        console.log('Week:', week);
        console.log('Year:', year);
        
        const sql = "SELECT * FROM kitchens WHERE day = ? AND week = ? AND year = ? AND kitchen = ?";
        
        this.db.query(sql, [day, week, year, kitchen], (err, data) => {
            if (err) {
                console.log('ERROR 500:', err);
                callback({ error: err.message }, null);
            } else if (data.length === 0) {
                console.log('Kitchen not found!!');
                callback(null, { data: [] });
            } else {
                console.log('Data retrieved successfully');
                callback(null, { data });
            }
        });
    }
}

module.exports = PathHandler;
