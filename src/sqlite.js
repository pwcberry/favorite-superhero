/**
 * Module handles database management
 */
import fs from "node:fs";
import sqlite3Lib from "sqlite3";
import {open} from "sqlite";

// Initialize the database
const DB_FILE = "./.data/superheroes.db";
const databaseExists = fs.existsSync(DB_FILE);
const sqlite3 = sqlite3Lib.verbose();

const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
});

try {
    if (!databaseExists) {
        await db.run("CREATE TABLE Superhero (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, image_file TEXT NOT NULL);")
        await db.run(            `CREATE TABLE Response (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, superhero_id INTEGER NOT NULL,
            CONSTRAINT superhero_fk FOREIGN KEY (superhero_id) REFERENCES Superhero (id));`
        );
        await db.run(`CREATE VIEW Results AS SELECT name, image_file, COUNT(r.id) AS votes 
            FROM Superhero s LEFT JOIN Response r ON s.id = superhero_id GROUP BY name, image_file;`)

        await db.run(
            `
              INSERT INTO Superhero (name, image_file) VALUES
                ('Batman', 'batman.jpg'),
                ('Black Panther', 'blackpanther.jpg'),
                ('Black Widow', 'blackwidow.jpg'),
                ('Bucky Barnes', 'buckybarnes.jpg'),
                ('Captain America', 'captainamerica.jpg'),
                ('Captain Marvel', 'captainmarvel.jpg'),
                ('Deadpool', 'deadpool.jpg'),
                ('Doctor Strange', 'doctorstrange.jpg'),
                ('Groot', 'groot.jpg'),
                ('Hawkeye', 'hawkeye.jpg'),
                ('Hulk', 'hulk.jpg'),
                ('Iron Man', 'ironman.jpg'),
                ('Peter Quill', 'starlord.jpg'),
                ('Scarlet Witch', 'scarletwitch.jpg'),
                ('Shang Chi', 'shangchi.jpg'),
                ('She Hulk', 'shehulk.jpg'),
                ('Spiderman', 'spiderman.jpg'),
                ('Storm', 'storm.jpg'),
                ('Superman', 'superman.jpg'),
                ('The Doctor', 'thedoctor.jpg'),
                ('Thor', 'thor.jpg'),
                ('Wasp', 'wasp.jpg'),
                ('Wolverine', 'wolverine.jpg'),
                ('Wonder Woman', 'wonderwoman.jpg');
              `
        );
    } else {
        // We have a database already - write Choices records to log for info
        console.log(await db.all("SELECT * from Superhero"));
    }
} catch (error) {
    console.error(error);
}

async function getSuperheroes() {
    try {
        return await db.all("SELECT * from Superhero");
    } catch (error) {
        // Database connection error
        console.error(error);
    }
}

async function addVote(userId, superheroId) {
    try {
        await db.run(`INSERT INTO Response (user_id, superhero_id) VALUES (?, ?);`, [userId, superheroId]);
    } catch (err) {
        console.error(err);
    }
}

async function getResults() {
    try {
        return db.all("SELECT * FROM Results ORDER BY votes DESC;");
    } catch (error) {
        console.error(error);
    }
}

export {
    getSuperheroes,
    getResults,
    addVote
};
