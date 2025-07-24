# DonorLink Backend

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file in the backend directory (see `.env.example`):
   ```sh
   cp .env.example .env
   # Edit .env with your DB credentials
   ```

3. Create the MySQL database and import the schema:
   - Create a database named `life` in MySQL.
   - Import `db.sql` using your MySQL client or:
     ```sh
     type db.sql | mysql -u root -p1234 life
     ```

4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

- `POST /api/donors` - Create new donor
- `GET /api/donors` - List donors (with filters)
- `GET /api/donors/:id` - Get single donor
- `GET /api/divisions` - List all divisions
- `GET /api/zilas/:divisionId` - List zilas by division
- `GET /api/upazilas/:zilaId` - List upazilas by zila

## Notes
- Phone numbers are masked in API responses.
- All required fields and consent are validated. 