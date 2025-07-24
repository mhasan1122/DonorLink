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

-- Insert all divisions (Bangladesh divisions)
INSERT INTO divisions (name) VALUES
('Barishal'),
('Chattogram'),
('Dhaka'),
('Khulna'),
('Mymensingh'),
('Rajshahi'),
('Rangpur'),
('Sylhet');

-- Insert all districts (zilas) organized by division
-- Barishal Division (ID: 1)
INSERT INTO zilas (divisionId, name) VALUES
(1, 'Barguna'),
(1, 'Barishal'),
(1, 'Bhola'),
(1, 'Jhalokathi'),
(1, 'Patuakhali'),
(1, 'Pirojpur');

-- Chattogram Division (ID: 2)
INSERT INTO zilas (divisionId, name) VALUES
(2, 'B.baria'),
(2, 'Bandarban'),
(2, 'Chandpur'),
(2, 'Chattogram'),
(2, 'Cox\'s bazar'),
(2, 'Cumilla'),
(2, 'Feni'),
(2, 'Khagrachari'),
(2, 'Laxmipur'),
(2, 'Noakhali'),
(2, 'Rangamati');

-- Dhaka Division (ID: 3)
INSERT INTO zilas (divisionId, name) VALUES
(3, 'Dhaka'),
(3, 'Faridpur'),
(3, 'Gazipur'),
(3, 'Gopalganj'),
(3, 'Kishoreganj'),
(3, 'Madaripur'),
(3, 'Manikganj'),
(3, 'Munshiganj'),
(3, 'Narayanganj'),
(3, 'Narshingdi'),
(3, 'Rajbari'),
(3, 'Shariatpur'),
(3, 'Tangail');

-- Khulna Division (ID: 4)
INSERT INTO zilas (divisionId, name) VALUES
(4, 'Bagerhat'),
(4, 'Chuadanga'),
(4, 'Jashore'),
(4, 'Jhenaidah'),
(4, 'Khulna'),
(4, 'Kushtia'),
(4, 'Magura'),
(4, 'Meherpur'),
(4, 'Narail'),
(4, 'Satkhira');

-- Mymensingh Division (ID: 5)
INSERT INTO zilas (divisionId, name) VALUES
(5, 'Jamalpur'),
(5, 'Mymensingh'),
(5, 'Netrokona'),
(5, 'Sherpur');

-- Rajshahi Division (ID: 6)
INSERT INTO zilas (divisionId, name) VALUES
(6, 'Bogura'),
(6, 'C. nawabganj'),
(6, 'Joypurhat'),
(6, 'Naogaon'),
(6, 'Natore'),
(6, 'Pabna'),
(6, 'Rajshahi'),
(6, 'Sirajganj');

-- Rangpur Division (ID: 7)
INSERT INTO zilas (divisionId, name) VALUES
(7, 'Dinajpur'),
(7, 'Gaibandha'),
(7, 'Kurigram'),
(7, 'Lalmonirhat'),
(7, 'Nilphamari'),
(7, 'Panchagarh'),
(7, 'Rangpur'),
(7, 'Thakurgaon');

-- Sylhet Division (ID: 8)
INSERT INTO zilas (divisionId, name) VALUES
(8, 'Habiganj'),
(8, 'Moulvibazar'),
(8, 'Sunamganj'),
(8, 'Sylhet');

-- Insert all upazilas organized by district
-- Barishal Division Districts

-- Barguna District (ID: 1)
INSERT INTO upazilas (zilaId, name) VALUES
(1, 'Amtali'),
(1, 'Bamna'),
(1, 'Barguna-S'),
(1, 'Betagi'),
(1, 'Patharghata'),
(1, 'Taltali');

-- Barishal District (ID: 2)
INSERT INTO upazilas (zilaId, name) VALUES
(2, 'Agailjhara'),
(2, 'Babuganj'),
(2, 'Bakerganj'),
(2, 'Banaripara'),
(2, 'Barishal-S'),
(2, 'Gouranadi'),
(2, 'Hizla'),
(2, 'Mehendiganj'),
(2, 'Muladi'),
(2, 'Uzirpur');

-- Bhola District (ID: 3)
INSERT INTO upazilas (zilaId, name) VALUES
(3, 'Bhola-S'),
(3, 'Borhanuddin'),
(3, 'Charfassion'),
(3, 'Daulatkhan'),
(3, 'Lalmohan'),
(3, 'Monpura'),
(3, 'Tazumuddin');

-- Jhalokathi District (ID: 4)
INSERT INTO upazilas (zilaId, name) VALUES
(4, 'Jhalokathi-S'),
(4, 'Kathalia'),
(4, 'Nalchity'),
(4, 'Rajapur');

-- Patuakhali District (ID: 5)
INSERT INTO upazilas (zilaId, name) VALUES
(5, 'Bauphal'),
(5, 'Dashmina'),
(5, 'Dumki'),
(5, 'Galachipa'),
(5, 'Kalapara'),
(5, 'Mirjaganj'),
(5, 'Patuakhali-S'),
(5, 'Rangabali');

-- Pirojpur District (ID: 6)
INSERT INTO upazilas (zilaId, name) VALUES
(6, 'Bhandaria'),
(6, 'Kawkhali'),
(6, 'Mothbaria'),
(6, 'Nazirpur'),
(6, 'Nesarabad'),
(6, 'Pirojpur-S'),
(6, 'Zianagar');

-- Chattogram Division Districts

-- B.baria District (ID: 7)
INSERT INTO upazilas (zilaId, name) VALUES
(7, 'Akhaura'),
(7, 'Ashuganj'),
(7, 'B.Baria-S'),
(7, 'Bancharampur'),
(7, 'Bijoynagar'),
(7, 'Kasba'),
(7, 'Nabinagar'),
(7, 'Nasirnagar'),
(7, 'Sarail');

-- Bandarban District (ID: 8)
INSERT INTO upazilas (zilaId, name) VALUES
(8, 'Alikadam'),
(8, 'Bandarban-S'),
(8, 'Lama'),
(8, 'Naikhyongchari'),
(8, 'Rowangchari'),
(8, 'Ruma'),
(8, 'Thanchi');

-- Chandpur District (ID: 9)
INSERT INTO upazilas (zilaId, name) VALUES
(9, 'Chandpur-S'),
(9, 'Faridganj'),
(9, 'Haimchar'),
(9, 'Haziganj'),
(9, 'Kachua'),
(9, 'Matlab (Dakshin)'),
(9, 'Matlab (Uttar)'),
(9, 'Shahrasti');

-- Chattogram District (ID: 10)
INSERT INTO upazilas (zilaId, name) VALUES
(10, 'Anwara'),
(10, 'Banskhali'),
(10, 'Boalkhali'),
(10, 'Chandanish'),
(10, 'Fatikchari'),
(10, 'Hathazari'),
(10, 'Karnaphuli'),
(10, 'Lohagara'),
(10, 'Mirsharai'),
(10, 'Patiya'),
(10, 'Rangunia'),
(10, 'Raojan'),
(10, 'Sandwip'),
(10, 'Satkania'),
(10, 'Sitakunda');

-- Cox's bazar District (ID: 11)
INSERT INTO upazilas (zilaId, name) VALUES
(11, 'Chakoria'),
(11, 'Cox\'S Bazar-S'),
(11, 'Kutubdia'),
(11, 'Moheskhali'),
(11, 'Pekua'),
(11, 'Ramu'),
(11, 'Teknaf'),
(11, 'Ukhiya');

-- Cumilla District (ID: 12)
INSERT INTO upazilas (zilaId, name) VALUES
(12, 'Barura'),
(12, 'Brahmanpara'),
(12, 'Burichong'),
(12, 'Chandina'),
(12, 'Chouddagram'),
(12, 'Cumilla-S'),
(12, 'Cumilla-S Daksin'),
(12, 'Daudkandi'),
(12, 'Debidwar'),
(12, 'Homna'),
(12, 'Laksham'),
(12, 'Lalmai'),
(12, 'Meghna'),
(12, 'Monohorganj'),
(12, 'Muradnagar'),
(12, 'Nangalkot'),
(12, 'Titas');

-- Feni District (ID: 13)
INSERT INTO upazilas (zilaId, name) VALUES
(13, 'Chhagalniya'),
(13, 'Daganbhuiyan'),
(13, 'Feni-S'),
(13, 'Fulgazi'),
(13, 'Porshuram'),
(13, 'Sonagazi');

-- Khagrachari District (ID: 14)
INSERT INTO upazilas (zilaId, name) VALUES
(14, 'Dighinala'),
(14, 'Guimara'),
(14, 'Khagrachari-S'),
(14, 'Laxmichari'),
(14, 'Mahalchari'),
(14, 'Manikchari'),
(14, 'Matiranga'),
(14, 'Panchari'),
(14, 'Ramgarh');

-- Laxmipur District (ID: 15)
INSERT INTO upazilas (zilaId, name) VALUES
(15, 'Komol Nagar'),
(15, 'Laxmipur-S'),
(15, 'Raipur'),
(15, 'Ramganj'),
(15, 'Ramgati');

-- Noakhali District (ID: 16)
INSERT INTO upazilas (zilaId, name) VALUES
(16, 'Begumganj'),
(16, 'Chatkhil'),
(16, 'Companiganj'),
(16, 'Hatiya'),
(16, 'Kabir Hat'),
(16, 'Noakhali-S'),
(16, 'Senbag'),
(16, 'Sonaimuri'),
(16, 'Subarna Char');

-- Rangamati District (ID: 17)
INSERT INTO upazilas (zilaId, name) VALUES
(17, 'Baghaichari'),
(17, 'Barkal'),
(17, 'Belaichari'),
(17, 'Juraichari'),
(17, 'Kaptai'),
(17, 'Kaukhali'),
(17, 'Langadu'),
(17, 'Nanniarchar'),
(17, 'Rajosthali'),
(17, 'Rangamati-S');

-- Dhaka Division Districts

-- Dhaka District (ID: 18)
INSERT INTO upazilas (zilaId, name) VALUES
(18, 'Dhamrai'),
(18, 'Dohar'),
(18, 'Keraniganj'),
(18, 'Nawabganj'),
(18, 'Savar');

-- Faridpur District (ID: 19)
INSERT INTO upazilas (zilaId, name) VALUES
(19, 'Alfadanga'),
(19, 'Bhanga'),
(19, 'Boalmari'),
(19, 'Charbhadrasan'),
(19, 'Faridpur-S'),
(19, 'Madhukhali'),
(19, 'Nagarkanda'),
(19, 'Sadarpur'),
(19, 'Saltha');

-- Gazipur District (ID: 20)
INSERT INTO upazilas (zilaId, name) VALUES
(20, 'Gazipur-S'),
(20, 'Kaliakoir'),
(20, 'Kaliganj'),
(20, 'Kapasia'),
(20, 'Sreepur');

-- Gopalganj District (ID: 21)
INSERT INTO upazilas (zilaId, name) VALUES
(21, 'Gopalganj-S'),
(21, 'Kasiani'),
(21, 'Kotwalipara'),
(21, 'Muksudpur'),
(21, 'Tungipara');

-- Kishoreganj District (ID: 22)
INSERT INTO upazilas (zilaId, name) VALUES
(22, 'Austagram'),
(22, 'Bajitpur'),
(22, 'Bhairab'),
(22, 'Hossainpur'),
(22, 'Itna'),
(22, 'Karimganj'),
(22, 'Katiadi'),
(22, 'Kishoreganj-S'),
(22, 'Kuliarchar'),
(22, 'Mithamoin'),
(22, 'Nikli'),
(22, 'Pakundia'),
(22, 'Tarail');

-- Madaripur District (ID: 23)
INSERT INTO upazilas (zilaId, name) VALUES
(23, 'Kalkini'),
(23, 'Madaripur-S'),
(23, 'Rajoir'),
(23, 'Shibchar');

-- Manikganj District (ID: 24)
INSERT INTO upazilas (zilaId, name) VALUES
(24, 'Daulatpur'),
(24, 'Ghior'),
(24, 'Harirampur'),
(24, 'Manikganj-S'),
(24, 'Saturia'),
(24, 'Shivalaya'),
(24, 'Singair');

-- Munshiganj District (ID: 25)
INSERT INTO upazilas (zilaId, name) VALUES
(25, 'Gazaria'),
(25, 'Lauhajong'),
(25, 'Munshiganj-S'),
(25, 'Sirajdikhan'),
(25, 'Sreenagar'),
(25, 'Tongibari');

-- Narayanganj District (ID: 26)
INSERT INTO upazilas (zilaId, name) VALUES
(26, 'Araihazar'),
(26, 'Bandar'),
(26, 'Narayanganj-S'),
(26, 'Rupganj'),
(26, 'Sonargaon');

-- Narshingdi District (ID: 27)
INSERT INTO upazilas (zilaId, name) VALUES
(27, 'Belabo'),
(27, 'Monohardi'),
(27, 'Narshingdi-S'),
(27, 'Palash'),
(27, 'Raipura'),
(27, 'Shibpur');

-- Rajbari District (ID: 28)
INSERT INTO upazilas (zilaId, name) VALUES
(28, 'Baliakandi'),
(28, 'Goalanda'),
(28, 'Kalukhali'),
(28, 'Pangsha'),
(28, 'Rajbari-S');

-- Shariatpur District (ID: 29)
INSERT INTO upazilas (zilaId, name) VALUES
(29, 'Bhedarganj'),
(29, 'Damuddya'),
(29, 'Goshairhat'),
(29, 'Janjira'),
(29, 'Naria'),
(29, 'Shariatpur-S');

-- Tangail District (ID: 30)
INSERT INTO upazilas (zilaId, name) VALUES
(30, 'Basail'),
(30, 'Bhuapur'),
(30, 'Delduar'),
(30, 'Dhanbari'),
(30, 'Ghatail'),
(30, 'Gopalpur'),
(30, 'Kalihati'),
(30, 'Madhupur'),
(30, 'Mirzapur'),
(30, 'Nagarpur'),
(30, 'Shakhipur'),
(30, 'Tangail-S');

-- Khulna Division Districts

-- Bagerhat District (ID: 31)
INSERT INTO upazilas (zilaId, name) VALUES
(31, 'Bagerhat-S'),
(31, 'Chitalmari'),
(31, 'Fakirhat'),
(31, 'Kachua'),
(31, 'Mollahat'),
(31, 'Mongla'),
(31, 'Morrelganj'),
(31, 'Rampal'),
(31, 'Sharankhola');

-- Chuadanga District (ID: 32)
INSERT INTO upazilas (zilaId, name) VALUES
(32, 'Alamdanga'),
(32, 'Chuadanga-S'),
(32, 'Damurhuda'),
(32, 'Jibannagar');

-- Jashore District (ID: 33)
INSERT INTO upazilas (zilaId, name) VALUES
(33, 'Abhoynagar'),
(33, 'Bagherpara'),
(33, 'Chowgacha'),
(33, 'Jashore-S'),
(33, 'Jhikargacha'),
(33, 'Keshabpur'),
(33, 'Monirampur'),
(33, 'Sarsha');

-- Jhenaidah District (ID: 34)
INSERT INTO upazilas (zilaId, name) VALUES
(34, 'Harinakunda'),
(34, 'Jhenaidah-S'),
(34, 'Kaliganj'),
(34, 'Kotchandpur'),
(34, 'Moheshpur'),
(34, 'Shailkupa');

-- Khulna District (ID: 35)
INSERT INTO upazilas (zilaId, name) VALUES
(35, 'Batiaghata'),
(35, 'Dacope'),
(35, 'Dighalia'),
(35, 'Dumuria'),
(35, 'Koira'),
(35, 'Paikgacha'),
(35, 'Phultala'),
(35, 'Rupsa'),
(35, 'Terokhada');

-- Kushtia District (ID: 36)
INSERT INTO upazilas (zilaId, name) VALUES
(36, 'Bheramara'),
(36, 'Daulatpur'),
(36, 'Khoksha'),
(36, 'Kumarkhali'),
(36, 'Kushtia-S'),
(36, 'Mirpur');

-- Magura District (ID: 37)
INSERT INTO upazilas (zilaId, name) VALUES
(37, 'Magura-S'),
(37, 'Mohammadpur'),
(37, 'Salikha'),
(37, 'Sreepur');

-- Meherpur District (ID: 38)
INSERT INTO upazilas (zilaId, name) VALUES
(38, 'Gangni'),
(38, 'Meherpur-S'),
(38, 'Mujib Nagar');

-- Narail District (ID: 39)
INSERT INTO upazilas (zilaId, name) VALUES
(39, 'Kalia'),
(39, 'Lohagara'),
(39, 'Narail-S');

-- Satkhira District (ID: 40)
INSERT INTO upazilas (zilaId, name) VALUES
(40, 'Assasuni'),
(40, 'Debhata'),
(40, 'Kalaroa'),
(40, 'Kaliganj'),
(40, 'Satkhira-S'),
(40, 'Shyamnagar'),
(40, 'Tala');

-- Mymensingh Division Districts

-- Jamalpur District (ID: 41)
INSERT INTO upazilas (zilaId, name) VALUES
(41, 'Bakshiganj'),
(41, 'Dewanganj'),
(41, 'Islampur'),
(41, 'Jamalpur-S'),
(41, 'Madarganj'),
(41, 'Melendah'),
(41, 'Sarishabari');

-- Mymensingh District (ID: 42)
INSERT INTO upazilas (zilaId, name) VALUES
(42, 'Bhaluka'),
(42, 'Dhobaura'),
(42, 'Fulbaria'),
(42, 'Gaffargaon'),
(42, 'Gouripur'),
(42, 'Haluaghat'),
(42, 'Ishwarganj'),
(42, 'Muktagacha'),
(42, 'Mymensingh-S'),
(42, 'Nandail'),
(42, 'Phulpur'),
(42, 'Tarakanda'),
(42, 'Trishal');

-- Netrokona District (ID: 43)
INSERT INTO upazilas (zilaId, name) VALUES
(43, 'Atpara'),
(43, 'Barhatta'),
(43, 'Durgapur'),
(43, 'Kalmakanda'),
(43, 'Kendua'),
(43, 'Khaliajuri'),
(43, 'Madan'),
(43, 'Mohanganj'),
(43, 'Netrakona-S'),
(43, 'Purbadhala');

-- Sherpur District (ID: 44)
INSERT INTO upazilas (zilaId, name) VALUES
(44, 'Jhenaigati'),
(44, 'Nakla'),
(44, 'Nalitabari'),
(44, 'Sherpur-S'),
(44, 'Sreebordi');

-- Rajshahi Division Districts

-- Bogura District (ID: 45)
INSERT INTO upazilas (zilaId, name) VALUES
(45, 'Adamdighi'),
(45, 'Bogura-S'),
(45, 'Dhunot'),
(45, 'Dhupchancia'),
(45, 'Gabtali'),
(45, 'Kahaloo'),
(45, 'Nandigram'),
(45, 'Sariakandi'),
(45, 'Shajahanpur'),
(45, 'Sherpur'),
(45, 'Shibganj'),
(45, 'Sonatala');

-- C. nawabganj District (ID: 46)
INSERT INTO upazilas (zilaId, name) VALUES
(46, 'Bholahat'),
(46, 'Gomostapur'),
(46, 'Nachol'),
(46, 'Nawabganj-S'),
(46, 'Shibganj');

-- Joypurhat District (ID: 47)
INSERT INTO upazilas (zilaId, name) VALUES
(47, 'Akkelpur'),
(47, 'Joypurhat-S'),
(47, 'Kalai'),
(47, 'Khetlal'),
(47, 'Panchbibi');

-- Naogaon District (ID: 48)
INSERT INTO upazilas (zilaId, name) VALUES
(48, 'Atrai'),
(48, 'Badalgachi'),
(48, 'Dhamoirhat'),
(48, 'Manda'),
(48, 'Mohadevpur'),
(48, 'Naogaon-S'),
(48, 'Niamatpur'),
(48, 'Patnitala'),
(48, 'Porsha'),
(48, 'Raninagar'),
(48, 'Shapahar');

-- Natore District (ID: 49)
INSERT INTO upazilas (zilaId, name) VALUES
(49, 'Bagatipara'),
(49, 'Baraigram'),
(49, 'Gurudaspur'),
(49, 'Lalpur'),
(49, 'Naldanga'),
(49, 'Natore-S'),
(49, 'Singra');

-- Pabna District (ID: 50)
INSERT INTO upazilas (zilaId, name) VALUES
(50, 'Atghoria'),
(50, 'Bera'),
(50, 'Bhangura'),
(50, 'Chatmohar'),
(50, 'Faridpur'),
(50, 'Ishwardi'),
(50, 'Pabna-S'),
(50, 'Santhia'),
(50, 'Sujanagar');

-- Rajshahi District (ID: 51)
INSERT INTO upazilas (zilaId, name) VALUES
(51, 'Bagha'),
(51, 'Bagmara'),
(51, 'Charghat'),
(51, 'Durgapur'),
(51, 'Godagari'),
(51, 'Mohanpur'),
(51, 'Paba'),
(51, 'Puthia'),
(51, 'Tanore');

-- Sirajganj District (ID: 52)
INSERT INTO upazilas (zilaId, name) VALUES
(52, 'Belkuchi'),
(52, 'Chowhali'),
(52, 'Kamarkhand'),
(52, 'Kazipur'),
(52, 'Raiganj'),
(52, 'Shahzadpur'),
(52, 'Sirajganj-S'),
(52, 'Tarash'),
(52, 'Ullapara');

-- Rangpur Division Districts

-- Dinajpur District (ID: 53)
INSERT INTO upazilas (zilaId, name) VALUES
(53, 'Birampur'),
(53, 'Birganj'),
(53, 'Birol'),
(53, 'Bochaganj'),
(53, 'Chirirbandar'),
(53, 'Dinajpur-S'),
(53, 'Fulbari'),
(53, 'Ghoraghat'),
(53, 'Hakimpur'),
(53, 'Kaharol'),
(53, 'Khanshama'),
(53, 'Nawabganj'),
(53, 'Parbatipur');

-- Gaibandha District (ID: 54)
INSERT INTO upazilas (zilaId, name) VALUES
(54, 'Fulchari'),
(54, 'Gaibandha-S'),
(54, 'Gobindaganj'),
(54, 'Palashbari'),
(54, 'Sadullapur'),
(54, 'Saghata'),
(54, 'Sundarganj');

-- Kurigram District (ID: 55)
INSERT INTO upazilas (zilaId, name) VALUES
(55, 'Bhurungamari'),
(55, 'Chilmari'),
(55, 'Fulbari'),
(55, 'Kurigram-S'),
(55, 'Nageswari'),
(55, 'Rajarhat'),
(55, 'Rajibpur'),
(55, 'Rowmari'),
(55, 'Ulipur');

-- Lalmonirhat District (ID: 56)
INSERT INTO upazilas (zilaId, name) VALUES
(56, 'Aditmari'),
(56, 'Hatibandha'),
(56, 'Kaliganj'),
(56, 'Lalmonirhat-S'),
(56, 'Patgram');

-- Nilphamari District (ID: 57)
INSERT INTO upazilas (zilaId, name) VALUES
(57, 'Dimla'),
(57, 'Domar'),
(57, 'Jaldhaka'),
(57, 'Kishoreganj'),
(57, 'Nilphamari-S'),
(57, 'Sayedpur');

-- Panchagarh District (ID: 58)
INSERT INTO upazilas (zilaId, name) VALUES
(58, 'Atwari'),
(58, 'Boda'),
(58, 'Debiganj'),
(58, 'Panchagarh-S'),
(58, 'Tetulia');

-- Rangpur District (ID: 59)
INSERT INTO upazilas (zilaId, name) VALUES
(59, 'Badarganj'),
(59, 'Gangachara'),
(59, 'Kaunia'),
(59, 'Mithapukur'),
(59, 'Pirgacha'),
(59, 'Pirganj'),
(59, 'Rangpur-S'),
(59, 'Taraganj');

-- Thakurgaon District (ID: 60)
INSERT INTO upazilas (zilaId, name) VALUES
(60, 'Baliadangi'),
(60, 'Haripur'),
(60, 'Pirganj'),
(60, 'Ranisankail'),
(60, 'Thakurgaon-S');

-- Sylhet Division Districts

-- Habiganj District (ID: 61)
INSERT INTO upazilas (zilaId, name) VALUES
(61, 'Azmiriganj'),
(61, 'Bahubal'),
(61, 'Baniachong'),
(61, 'Chunarughat'),
(61, 'Habiganj-S'),
(61, 'Lakhai'),
(61, 'Madhabpur'),
(61, 'Nabiganj'),
(61, 'Sayestaganj');

-- Moulvibazar District (ID: 62)
INSERT INTO upazilas (zilaId, name) VALUES
(62, 'Barlekha'),
(62, 'Juri'),
(62, 'Kamalganj'),
(62, 'Kulaura'),
(62, 'Moulvibazar-S'),
(62, 'Rajnagar'),
(62, 'Sreemangal');

-- Sunamganj District (ID: 63)
INSERT INTO upazilas (zilaId, name) VALUES
(63, 'Biswamvarpur'),
(63, 'Chatak'),
(63, 'Dakhin Sunamganj'),
(63, 'Derai'),
(63, 'Dharmapasha'),
(63, 'Doarabazar'),
(63, 'Jagannathpur'),
(63, 'Jamalganj'),
(63, 'Sulla'),
(63, 'Sunamganj-S'),
(63, 'Tahirpur');

-- Sylhet District (ID: 64)
INSERT INTO upazilas (zilaId, name) VALUES
(64, 'Balaganj'),
(64, 'Beanibazar'),
(64, 'Biswanath'),
(64, 'Companiganj'),
(64, 'Dakshin Surma'),
(64, 'Fenchuganj'),
(64, 'Golapganj'),
(64, 'Gowainghat'),
(64, 'Jointiapur'),
(64, 'Kanaighat'),
(64, 'Osmaninagar'),
(64, 'Sylhet-S'),
(64, 'Zakiganj');

-- Insert sample donors
INSERT INTO donors (firstName, lastName, bloodGroup, divisionId, zilaId, upazilaId, village, currentLocation, lastDonationDate, phoneNumber, isAvailable, notes) VALUES
('Ahmed', 'Rahman', 'O+', 3, 18, 293, 'Dhamrai', 'Dhaka, Bangladesh', '2024-01-15', '+8801712345678', TRUE, 'Available for emergency donations'),
('Fatima', 'Khatun', 'A+', 3, 18, 294, 'Dohar', 'Dhaka, Bangladesh', '2024-02-20', '+8801812345679', TRUE, 'Regular donor'),
('Mohammad', 'Islam', 'B+', 3, 20, 298, 'Gazipur Sadar', 'Gazipur, Bangladesh', '2024-03-10', '+8801912345680', TRUE, 'Available weekends'),
('Rashida', 'Begum', 'AB+', 2, 10, NULL, 'Chittagong City', 'Chittagong, Bangladesh', '2024-01-05', '+8801612345681', FALSE, 'Recently donated'),
('Karim', 'Uddin', 'O-', 3, 18, 295, 'Keraniganj', 'Dhaka, Bangladesh', '2023-12-25', '+8801512345682', TRUE, 'Rare blood type donor');