require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    // First connect without specifying database to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234',
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS life');
    console.log('Database "life" created or already exists');

    // Switch to the database
    await connection.query('USE life');
    console.log('Using database "life"');

    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS divisions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "divisions" created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS zilas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        divisionId INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        FOREIGN KEY (divisionId) REFERENCES divisions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "zilas" created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS upazilas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        zilaId INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        FOREIGN KEY (zilaId) REFERENCES zilas(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "upazilas" created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS donors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        bloodGroup ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
        divisionId INT NOT NULL,
        zilaId INT NOT NULL,
        upazilaId INT NOT NULL,
        village VARCHAR(100),
        currentLocation VARCHAR(255) NOT NULL,
        lastDonationDate DATE NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL,
        isAvailable BOOLEAN DEFAULT TRUE,
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (divisionId) REFERENCES divisions(id),
        FOREIGN KEY (zilaId) REFERENCES zilas(id),
        FOREIGN KEY (upazilaId) REFERENCES upazilas(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "donors" created');

    // Insert sample data
    await connection.execute(`
      INSERT IGNORE INTO divisions (name) VALUES 
      ('Dhaka'),
      ('Chittagong'),
      ('Rajshahi'),
      ('Khulna'),
      ('Barisal'),
      ('Sylhet'),
      ('Rangpur'),
      ('Mymensingh')
    `);
    console.log('Sample divisions inserted');

    await connection.execute(`
      INSERT IGNORE INTO zilas (divisionId, name) VALUES 
      (1, 'Dhaka'),
      (1, 'Faridpur'),
      (1, 'Gazipur'),
      (1, 'Gopalganj'),
      (1, 'Kishoreganj'),
      (2, 'Chittagong'),
      (2, 'Bandarban'),
      (2, 'Brahmanbaria'),
      (2, 'Chandpur'),
      (2, 'Comilla')
    `);
    console.log('Sample zilas inserted');

    await connection.execute(`
      INSERT IGNORE INTO upazilas (zilaId, name) VALUES 
      (1, 'Dhanmondi'),
      (1, 'Gulshan'),
      (1, 'Ramna'),
      (1, 'Tejgaon'),
      (1, 'Pallabi'),
      (3, 'Gazipur Sadar'),
      (3, 'Kaliakair'),
      (3, 'Kapasia'),
      (3, 'Sreepur'),
      (3, 'Kaliganj')
    `);
    console.log('Sample upazilas inserted');

    await connection.execute(`
      INSERT IGNORE INTO donors (firstName, lastName, bloodGroup, divisionId, zilaId, upazilaId, village, currentLocation, lastDonationDate, phoneNumber, isAvailable, notes) VALUES 
      ('Ahmed', 'Rahman', 'O+', 1, 1, 1, 'Dhanmondi', 'Dhaka, Bangladesh', '2024-01-15', '+8801712345678', TRUE, 'Available for emergency donations'),
      ('Fatima', 'Khatun', 'A+', 1, 1, 2, 'Gulshan', 'Dhaka, Bangladesh', '2024-02-20', '+8801812345679', TRUE, 'Regular donor'),
      ('Mohammad', 'Islam', 'B+', 1, 3, 6, 'Gazipur Sadar', 'Gazipur, Bangladesh', '2024-03-10', '+8801912345680', TRUE, 'Available weekends'),
      ('Rashida', 'Begum', 'AB+', 2, 6, 1, 'Chittagong City', 'Chittagong, Bangladesh', '2024-01-05', '+8801612345681', FALSE, 'Recently donated'),
      ('Karim', 'Uddin', 'O-', 1, 1, 3, 'Ramna', 'Dhaka, Bangladesh', '2023-12-25', '+8801512345682', TRUE, 'Rare blood type donor')
    `);
    console.log('Sample donors inserted');
    
    // Verify tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));

    // Test data
    const [divisions] = await connection.query('SELECT COUNT(*) as count FROM divisions');
    const [zilas] = await connection.query('SELECT COUNT(*) as count FROM zilas');
    const [upazilas] = await connection.query('SELECT COUNT(*) as count FROM upazilas');
    const [donors] = await connection.query('SELECT COUNT(*) as count FROM donors');
    
    console.log(`Data counts: Divisions: ${divisions[0].count}, Zilas: ${zilas[0].count}, Upazilas: ${upazilas[0].count}, Donors: ${donors[0].count}`);
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Database setup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase();
