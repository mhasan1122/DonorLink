-- Database: life

CREATE DATABASE IF NOT EXISTS life;
USE life;

CREATE TABLE IF NOT EXISTS divisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS zilas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  divisionId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (divisionId) REFERENCES divisions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS upazilas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zilaId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (zilaId) REFERENCES zilas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  bloodGroup ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  divisionId INT NOT NULL,
  zilaId INT NOT NULL,
  upazilaId INT, -- allow NULL values for upazilaId
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample divisions (Bangladesh divisions)
INSERT INTO divisions (name) VALUES
('Dhaka'),
('Chittagong'),
('Rajshahi'),
('Khulna'),
('Barisal'),
('Sylhet'),
('Rangpur'),
('Mymensingh');

-- Insert sample zilas for Dhaka division
INSERT INTO zilas (divisionId, name) VALUES
(1, 'Dhaka'),
(1, 'Faridpur'),
(1, 'Gazipur'),
(1, 'Gopalganj'),
(1, 'Kishoreganj'),
(1, 'Madaripur'),
(1, 'Manikganj'),
(1, 'Munshiganj'),
(1, 'Narayanganj'),
(1, 'Narsingdi'),
(1, 'Rajbari'),
(1, 'Shariatpur'),
(1, 'Tangail');

-- Insert sample zilas for Chittagong division
INSERT INTO zilas (divisionId, name) VALUES
(2, 'Chittagong'),
(2, 'Bandarban'),
(2, 'Brahmanbaria'),
(2, 'Chandpur'),
(2, 'Comilla'),
(2, 'Cox\'s Bazar'),
(2, 'Feni'),
(2, 'Khagrachhari'),
(2, 'Lakshmipur'),
(2, 'Noakhali'),
(2, 'Rangamati');

-- Insert sample upazilas for Dhaka zila
INSERT INTO upazilas (zilaId, name) VALUES
(1, 'Dhanmondi'),
(1, 'Gulshan'),
(1, 'Ramna'),
(1, 'Tejgaon'),
(1, 'Pallabi'),
(1, 'Shah Ali'),
(1, 'Turag'),
(1, 'Uttara'),
(1, 'Wari');

-- Insert sample upazilas for Gazipur zila
INSERT INTO upazilas (zilaId, name) VALUES
(3, 'Gazipur Sadar'),
(3, 'Kaliakair'),
(3, 'Kapasia'),
(3, 'Sreepur'),
(3, 'Kaliganj');

-- Insert sample donors
INSERT INTO donors (firstName, lastName, bloodGroup, divisionId, zilaId, upazilaId, village, currentLocation, lastDonationDate, phoneNumber, isAvailable, notes) VALUES
('Ahmed', 'Rahman', 'O+', 1, 1, 1, 'Dhanmondi', 'Dhaka, Bangladesh', '2024-01-15', '+8801712345678', TRUE, 'Available for emergency donations'),
('Fatima', 'Khatun', 'A+', 1, 1, 2, 'Gulshan', 'Dhaka, Bangladesh', '2024-02-20', '+8801812345679', TRUE, 'Regular donor'),
('Mohammad', 'Islam', 'B+', 1, 3, 10, 'Gazipur Sadar', 'Gazipur, Bangladesh', '2024-03-10', '+8801912345680', TRUE, 'Available weekends'),
('Rashida', 'Begum', 'AB+', 2, 14, NULL, 'Chittagong City', 'Chittagong, Bangladesh', '2024-01-05', '+8801612345681', FALSE, 'Recently donated'),
('Karim', 'Uddin', 'O-', 1, 1, 3, 'Ramna', 'Dhaka, Bangladesh', '2023-12-25', '+8801512345682', TRUE, 'Rare blood type donor');