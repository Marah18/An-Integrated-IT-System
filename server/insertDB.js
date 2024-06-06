
const mysql = require('mysql2');

const database = "FOODMANGEMENT";

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '********',
});

const establishConnection = () => {
    db.connect((err) => {
        if (err) throw err;
        console.log(`Connected to MySQL ${database}`);
    });
};

const createDatabaseIfNotExists = () => {
    db.query(`CREATE DATABASE IF NOT EXISTS  ${database}`, (err, result) => {
        if (err) throw err;
        console.log("Database created or already exists");
        useDatabase();
    });
};


const useDatabase = () => {
    db.query(`USE  ${database}`, (err, result) => {
        if (err) throw err;
        console.log(`Using database  ${database}`);
        createTables();
    });
};

const bcrypt = require('bcrypt');
const insertUserData = () => {
    // Define user data with passwords
    const users = [
        { email: 'sjoangsskolan@kalmar.se', password: 'kalmar123', type: 'Grundskola', kitchen: 'Sjöängsskolan' },
        { email: 'lindsdalsskolan@kalmar.se', password: 'lind123', type: 'Grundskola', kitchen: 'Lindsdalsskolan' },
        { email: 'rocknebyskolan@kalmar.se', password: 'rock123', type: 'Förskola', kitchen: 'Rocknebyskolan' },
        { email: 'kalmarsundsskolan@kalmar.se', password: 'sund123', type: 'Gymnasieskola', kitchen: 'Kalmarsundsskolan' }
    ];

    // Hash passwords and insert user data into the database
    users.forEach(user => {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) throw err;
            // Replace password with hashed password
            user.password = hash;
            const insertData = `
                INSERT INTO users (email, password, type, kitchen) 
                VALUES (?, ?, ?, ?)
            `;
            db.query(insertData, [user.email, user.password, user.type, user.kitchen], (err, result) => {
                if (err) throw err;
                console.log(`User inserted: ${user.email}`);
            });
        });
    });
};

const createUserTableIfNotExists = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        type VARCHAR(255),
        kitchen VARCHAR(255) UNIQUE
        )
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error creating users table:", err);

        } else {
            console.log("Users table created successfully");
            //insertUserData();
        }
    });

};


const createKitchensTableIfNotExists = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS kitchens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            year INT NOT NULL,
            week INT NOT NULL,
            day VARCHAR(50) NOT NULL,
            amountServFood FLOAT,
            minusMat FLOAT,
            storageWaste FLOAT,
            preparationWaste FLOAT,
            cookingWaste FLOAT,
            kitchenWaste FLOAT,
            servingWaste FLOAT,
            plateWaste FLOAT,
            totalFoodWaste FLOAT,
            eaters INT,
            totper FLOAT,
            procent FLOAT,
            Eatenfood FLOAT,
            dish VARCHAR(255),
            unavoidableFoodWaste FLOAT,
            savedFood FLOAT,
            email VARCHAR(255) NOT NULL ,
            kitchen VARCHAR(255) NOT NULL
        )
    `;
    db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Table 'kitchens' created or already exists");
        // insertInitialData();
        // insertUserData()
    });
};


const insertInitialData = () => {

    const insertDataQuery = `
                INSERT INTO kitchens (year, week, day, amountServFood, minusMat, storageWaste, preparationWaste, cookingWaste, kitchenWaste, servingWaste, plateWaste, totalFoodWaste, eaters, totper, procent, Eatenfood, dish, unavoidableFoodWaste, savedFood, email, kitchen) VALUES 

                (2024, 1, 'Måndag', 430, 380, 34, 22, 12, 68, 5, 11, 16, 690, 23.0, 4.57143, -23.0, 'Quorn Lasagne', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 1, 'Tisdag', 360, 340, 23, 12, 9, 44, 6, 9.4, 15.4, 700, 21.6667, 4.66667, -21.6667, 'Vego Curry', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 1, 'Onsdag', 310, 290, 25, 18, 14, 50, 4, 8, 12, 580, 19.3333, 3.0, -19.3333, 'Vegetarisk Stroganoff', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 1, 'Torsdag', 440, 410, 40, 26, 16, 70, 6, 10, 14, 630, 21.0, 3.5, -21.0, 'Vegetarisk Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 1, 'Fredag', 370, 340, 30, 20, 15, 60, 5, 9, 13, 610, 20.3333, 3.25, -20.3333, 'Vegetarisk Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),

                -- Week 3
                (2024, 3, 'Måndag', 420, 370, 35, 22, 12, 69, 5, 11, 16, 675, 23.1667, 4.57143, -23.1667, 'Vegetarisk Chilli', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 3, 'Tisdag', 340, 320, 23, 12, 9, 44, 6, 9.4, 15.4, 680, 21.6667, 4.66667, -21.6667, 'Vego Stroganoff', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 3, 'Onsdag', 320, 300, 25, 18, 14, 50, 4, 8, 12, 590, 19.6667, 3.0, -19.6667, 'Biff Gryta', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 3, 'Torsdag', 450, 420, 40, 26, 16, 72, 6, 10, 14, 640, 21.3333, 3.5, -21.3333, 'Kött Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 3, 'Fredag', 380, 350, 30, 20, 15, 62, 5, 9, 13, 620, 20.6667, 3.25, -20.6667, 'Quorn Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),

                -- Week 13
                (2024, 13, 'Måndag', 410, 360, 34, 22, 12, 68, 5, 11, 16, 665, 23.8333, 4.57143, -23.8333, 'Vegetarisk Pizza', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 13, 'Tisdag', 350, 330, 23, 12, 9, 44, 6, 9.4, 15.4, 670, 22.0, 4.66667, -22.0, 'Vegetarisk Lasagne', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 13, 'Onsdag', 300, 280, 25, 18, 14, 50, 4, 8, 12, 550, 18.3333, 3.0, -18.3333, 'Kyckling Stroganoff', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 13, 'Torsdag', 430, 400, 40, 26, 16, 70, 6, 10, 14, 620, 20.6667, 3.5, -20.6667, 'Kyckling Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 13, 'Fredag', 360, 330, 30, 20, 15, 60, 5, 9, 13, 600, 20.0, 3.25, -20.0, 'Kyckling Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),

                (2024, 5, 'Måndag', 400, 350, 34, 22, 12, 68, 5, 11, 16, 666, 24.024, 4.57143, -24.024, 'Spenat Lasagne', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 5, 'Tisdag', 350, 330, 23, 12, 9, 44, 6, 9.4, 15.4, 684, 22.5146, 4.66667, -22.5146, 'Kyckling Curry', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 5, 'Onsdag', 300, 280, 25, 18, 14, 50, 4, 8, 12, 570, 19.0, 3.0, -19.0, 'Biff Stroganoff', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 5, 'Torsdag', 420, 390, 40, 26, 16, 70, 6, 10, 14, 620, 21.5, 3.5, -21.5, 'Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 5, 'Fredag', 350, 320, 30, 20, 15, 60, 5, 9, 13, 610, 20.5, 3.25, -20.5, 'Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),
            


                (2024, 6, 'Måndag', 410, 360, 35, 23, 13, 70, 5, 12, 17, 680, 24.2857, 4.57143, -24.2857, 'Vegetarisk Lasagne', 11, 55, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 6, 'Tisdag', 360, 340, 24, 13, 10, 45, 6, 9.6, 15.6, 690, 23.0, 4.66667, -23.0, 'Köttbullar', 7, 22, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 6, 'Onsdag', 310, 290, 26, 19, 15, 52, 4, 8.2, 12.2, 575, 19.1667, 3.0, -19.1667, 'Fiskpinnar', 6, 17, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 6, 'Torsdag', 430, 400, 42, 28, 17, 72, 6, 10.2, 14.2, 630, 21.8333, 3.5, -21.8333, 'Pasta Bolognese', 9, 32, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 6, 'Fredag', 360, 330, 32, 21, 16, 62, 5, 9.2, 13.2, 615, 20.5, 3.25, -20.5, 'Pizza', 8, 27, 'sjoangsskolan@se', 'Sjöängsskolan'),
            
                (2024, 7, 'Måndag', 420, 370, 36, 24, 14, 72, 5, 13, 18, 685, 24.4643, 4.57143, -24.4643, 'Quorn Gryta', 12, 60, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 7, 'Tisdag', 370, 350, 25, 14, 11, 46, 6, 9.8, 15.8, 695, 23.5, 4.66667, -23.5, 'Korv Stroganoff', 8, 24, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 7, 'Onsdag', 320, 300, 27, 20, 16, 54, 4, 8.4, 12.4, 580, 19.3333, 3.0, -19.3333, 'Kyckling Schnitzel', 7, 19, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 7, 'Torsdag', 440, 410, 44, 30, 18, 74, 6, 10.4, 14.4, 640, 22.1667, 3.5, -22.1667, 'Lax med Spenat', 10, 34, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 7, 'Fredag', 370, 340, 34, 22, 17, 64, 5, 9.4, 13.4, 620, 20.6667, 3.25, -20.6667, 'Vegetarisk Chili', 9, 29, 'sjoangsskolan@se', 'Sjöängsskolan'),

                (2024, 9, 'Måndag', 500, 350, 34, 22, 12, 68, 5, 11, 16, 666, 24.024, 4.57143, -24.024, 'Spenat Lasagne', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 9, 'Tisdag', 310, 330, 23, 12, 9, 44, 6, 9.4, 15.4, 684, 22.5146, 4.66667, -22.5146, 'Kyckling Curry', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 9, 'Onsdag', 390, 280, 25, 18, 14, 50, 4, 8, 12, 570, 19.0, 3.0, -19.0, 'Biff Stroganoff', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 9, 'Torsdag', 620, 390, 40, 26, 16, 70, 6, 10, 14, 620, 21.5, 3.5, -21.5, 'Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 9, 'Fredag', 450, 320, 30, 20, 15, 60, 5, 9, 13, 610, 20.5, 3.25, -20.5, 'Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),



                (2024, 10, 'Måndag', 500, 350, 34, 22, 12, 68, 5, 11, 16, 666, 24.024, 4.57143, -24.024, 'Spenat Lasagne', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 10, 'Tisdag', 310, 330, 23, 12, 9, 44, 6, 9.4, 15.4, 684, 22.5146, 4.66667, -22.5146, 'Kyckling Curry', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 15, 'Onsdag', 390, 280, 25, 18, 14, 50, 4, 8, 12, 570, 19.0, 3.0, -19.0, 'Biff Stroganoff', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 15, 'Torsdag', 620, 390, 40, 26, 16, 70, 6, 10, 14, 620, 21.5, 3.5, -21.5, 'Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 15, 'Fredag', 450, 320, 30, 20, 15, 60, 5, 9, 13, 610, 20.5, 3.25, -20.5, 'Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),


                (2024, 5, 'Måndag', 450, 400, 35, 20, 15, 55, 4, 10, 15, 680, 22.5, 4.0, -22.5, 'Korv Stroganoff', 9, 35, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 5, 'Tisdag', 370, 340, 25, 15, 10, 50, 3, 8, 12, 610, 20.0, 3.5, -20.0, 'Fiskpinnar', 6, 20, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 5, 'Onsdag', 400, 370, 30, 20, 12, 55, 5, 9, 13, 630, 21.0, 3.75, -21.0, 'Köttbullar', 8, 28, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 5, 'Torsdag', 380, 350, 28, 18, 13, 48, 4, 7, 11, 600, 19.5, 3.25, -19.5, 'Tacos', 7, 22, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 5, 'Fredag', 420, 390, 32, 22, 14, 60, 5, 10, 15, 650, 22.0, 4.0, -22.0, 'Pizza', 9, 30, 'lindsdalsskolan@se', 'Lindsdalsskolan'),

                (2024, 5, 'Måndag', 480, 450, 38, 25, 17, 65, 5, 12, 17, 700, 23.5, 4.5, -23.5, 'Vegetarisk Tacos', 10, 40, 'rocknebyskolan@se', 'Rocknebyskolan'),
                (2024, 5, 'Tisdag', 410, 380, 28, 18, 12, 50, 4, 8, 12, 640, 21.0, 3.75, -21.0, 'Kycklinggryta', 8, 28, 'rocknebyskolan@se', 'Rocknebyskolan'),
                (2024, 5, 'Onsdag', 450, 420, 33, 20, 15, 55, 5, 9, 14, 670, 22.0, 4.0, -22.0, 'Lax med Spenat', 9, 32, 'rocknebyskolan@se', 'Rocknebyskolan'),
                (2024, 5, 'Torsdag', 400, 370, 30, 22, 14, 50, 4, 7, 11, 630, 21.0, 3.5, -21.0, 'Köttgryta', 7, 24, 'rocknebyskolan@se', 'Rocknebyskolan'),
                (2024, 5, 'Måndag', 470, 430, 36, 24, 18, 60, 5, 11, 16, 690, 24.0, 4.0, -24.0, 'Köttfärssås', 10, 38, 'kalmarsundsskolan@se', 'Kalmarsundsskolan'),
                (2024, 5, 'Tisdag', 390, 360, 26, 17, 13, 45, 4, 9, 13, 620, 20.5, 3.5, -20.5, 'Vegetarisk Lasagne', 7, 28, 'kalmarsundsskolan@se', 'Kalmarsundsskolan'),
                (2024, 5, 'Onsdag', 440, 410, 32, 20, 15, 52, 5, 10, 15, 650, 21.5, 3.75, -21.5, 'Kyckling med Ris', 9, 30, 'kalmarsundsskolan@se', 'Kalmarsundsskolan'),
                (2024, 5, 'Torsdag', 420, 390, 28, 19, 14, 48, 4, 8, 12, 630, 20.0, 3.25, -20.0, 'Falafel', 8, 26, 'kalmarsundsskolan@se', 'Kalmarsundsskolan'),
                (2024, 5, 'Fredag', 450, 420, 34, 22, 16, 55, 5, 11, 16, 660, 22.0, 4.0, -22.0, 'Pasta Alfredo', 10, 34, 'kalmarsundsskolan@se', 'Kalmarsundsskolan'),

                (2024, 20, 'Måndag', 400, 350, 34, 22, 12, 68, 5, 11, 16, 666, 24.024, 4.57143, -24.024, 'Spenat Lasagne', 10, 50, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 20, 'Tisdag', 350, 330, 23, 12, 9, 44, 6, 9.4, 15.4, 684, 22.5146, 4.66667, -22.5146, 'Kyckling Curry', 7, 20, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 20, 'Onsdag', 300, 280, 25, 18, 14, 50, 4, 8, 12, 570, 19.0, 3.0, -19.0, 'Biff Stroganoff', 5, 15, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 20, 'Torsdag', 420, 390, 40, 26, 16, 70, 6, 10, 14, 620, 21.5, 3.5, -21.5, 'Pannkakor', 8, 30, 'sjoangsskolan@se', 'Sjöängsskolan'),
                (2024, 20, 'Fredag', 350, 320, 30, 20, 15, 60, 5, 9, 13, 610, 20.5, 3.25, -20.5, 'Lasagne', 7, 25, 'sjoangsskolan@se', 'Sjöängsskolan'),

                (2024, 20, 'Måndag', 450, 400, 35, 20, 15, 55, 4, 10, 15, 680, 22.5, 4.0, -22.5, 'Korv Stroganoff', 9, 35, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 20, 'Tisdag', 370, 340, 25, 15, 10, 50, 3, 8, 12, 610, 20.0, 3.5, -20.0, 'Fiskpinnar', 6, 20, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 20, 'Onsdag', 400, 370, 30, 20, 12, 55, 5, 9, 13, 630, 21.0, 3.75, -21.0, 'Köttbullar', 8, 28, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 20, 'Torsdag', 380, 350, 28, 18, 13, 48, 4, 7, 11, 600, 19.5, 3.25, -19.5, 'Tacos', 7, 22, 'lindsdalsskolan@se', 'Lindsdalsskolan'),
                (2024, 20, 'Fredag', 420, 390, 32, 22, 14, 60, 5, 10, 15, 650, 22.0, 4.0, -22.0, 'Pizza', 9, 30, 'lindsdalsskolan@se', 'Lindsdalsskolan'),

                (2024, 20, 'Måndag', 480, 450, 38, 25, 17, 65, 5, 12, 17, 700, 23.5, 4.5, -23.5, 'Vegetarisk Tacos', 10, 40, 'rocknebyskolan@se', 'Rocknebyskolan'),
                (2024, 20, 'Tisdag', 410, 380, 28, 18, 12, 50, 4, 8, 12, 640, 21.0, 3.75, -21.0, 'Kycklinggryta', 8, 28, 'rocknebyskolan@se', 'Rocknebyskolan');`

    db.query(insertDataQuery, (err, result) => {
        if (err) throw err;
        console.log("Data inserted into kitchens table");
    });
}


const query = (sql, values, callback) => {
    db.query(sql, values, callback);
};


createDatabaseIfNotExists()
const createTables = () => {
    createUserTableIfNotExists();
    createKitchensTableIfNotExists();
};

module.exports = {
    establishConnection,
    useDatabase,
    query

};
