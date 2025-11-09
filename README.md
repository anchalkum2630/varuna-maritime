🚢 FuelEU Maritime Compliance Platform

A Full-Stack implementation of the Fuel EU Maritime compliance dashboard, supporting Routes, Compare, Banking, and Pooling functionalities. Built using React + TypeScript + TailwindCSS (frontend) and Node.js + TypeScript + PostgreSQL (backend), following hexagonal architecture principles.

📌 Overview

This platform allows maritime operators to:

View route emissions and set baselines

Compare actual vs target GHG intensities

Manage compliance balances (CB)

Handle banking and pooling of surplus/deficit emissions

All business logic is independent of framework, enabling robust testing and clean separation of concerns.

🏗 Architecture Summary
Frontend (React + TypeScript + TailwindCSS)
src/
├─ core/
│  ├─ domain/           # Entities: Route, CB, ShipCompliance
│  ├─ application/      # Use-cases: FetchRoutes, ComputeComparison, ManagePooling
│  └─ ports/            # Interfaces for adapters
├─ adapters/
│  ├─ ui/               # React components & pages
│  └─ infrastructure/   # API clients
└─ shared/              # Types, helpers, constants

Backend (Node.js + TypeScript + PostgreSQL)
src/
├─ core/
│  ├─ domain/           # Entities: Route, ShipCompliance, Pool
│  ├─ application/      # Use-cases: ComputeCB, BankSurplus, CreatePool
│  └─ ports/            # Interfaces for inbound/outbound adapters
├─ adapters/
│  ├─ inbound/http/     # Express controllers
│  └─ outbound/postgres/ # Repository implementations
├─ infrastructure/
│  ├─ db/               # PostgreSQL connection, migrations, seeds
│  └─ server/           # Express app setup
└─ shared/              # Types, helpers, constants

⚙️ Setup Instructions
Prerequisites

Node.js >= 18

npm >= 9

PostgreSQL >= 14

Optional: psql CLI for database management

Backend Setup

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


Create .env file:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/fueleu


Setup PostgreSQL database:

CREATE DATABASE fueleu;

-- Tables
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(10) UNIQUE NOT NULL,
    vessel_type VARCHAR(50),
    fuel_type VARCHAR(50),
    year INT,
    ghg_intensity NUMERIC,
    fuel_consumption NUMERIC,
    distance NUMERIC,
    total_emissions NUMERIC,
    is_baseline BOOLEAN DEFAULT FALSE
);

CREATE TABLE ship_compliance (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(20),
    year INT,
    cb_gco2eq NUMERIC
);

CREATE TABLE bank_entries (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(20),
    year INT,
    amount_gco2eq NUMERIC
);

CREATE TABLE pools (
    id SERIAL PRIMARY KEY,
    year INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pool_members (
    id SERIAL PRIMARY KEY,
    pool_id INT REFERENCES pools(id),
    ship_id VARCHAR(20),
    cb_before NUMERIC,
    cb_after NUMERIC
);


Seed initial routes:

// backend/src/infrastructure/db/seed.ts
const seedRoutes = [
  { route_id: 'R001', vessel_type: 'Container', fuel_type: 'HFO', year: 2024, ghg_intensity: 91.0, fuel_consumption: 5000, distance: 12000, total_emissions: 4500, is_baseline: true },
  { route_id: 'R002', vessel_type: 'BulkCarrier', fuel_type: 'LNG', year: 2024, ghg_intensity: 88.0, fuel_consumption: 4800, distance: 11500, total_emissions: 4200 },
  { route_id: 'R003', vessel_type: 'Tanker', fuel_type: 'MGO', year: 2024, ghg_intensity: 93.5, fuel_consumption: 5100, distance: 12500, total_emissions: 4700 },
  { route_id: 'R004', vessel_type: 'RoRo', fuel_type: 'HFO', year: 2025, ghg_intensity: 89.2, fuel_consumption: 4900, distance: 11800, total_emissions: 4300 },
  { route_id: 'R005', vessel_type: 'Container', fuel_type: 'LNG', year: 2025, ghg_intensity: 90.5, fuel_consumption: 4950, distance: 11900, total_emissions: 4400 }
];


Run backend:

npm run dev


Server starts on http://localhost:4000.

Frontend Setup

Navigate to frontend:

cd frontend


Install dependencies:

npm install


Configure .env (if needed):

VITE_API_BASE_URL=http://localhost:5000


Run frontend:

npm run dev


App will run on http://localhost:5173 (Vite default).

🔗 API Endpoints
Routes
Method	Endpoint	Description
GET	/routes	Fetch all routes
POST	/routes/:id/baseline	Set baseline for a route
GET	/routes/comparison	Compare baseline vs other routes
Compliance
Method	Endpoint	Description
GET	/compliance/cb?shipId&year	Compute and return CB
GET	/compliance/adjusted-cb?shipId&year	Return CB after banking adjustments
Banking
Method	Endpoint	Description
GET	/banking/records?shipId&year	Fetch banking records
POST	/banking/bank	Bank positive CB
POST	/banking/apply	Apply banked CB to deficits
Pooling
Method	Endpoint	Description
POST	/pools	Create a pool and allocate CB
📊 Sample Requests
# Fetch routes
curl http://localhost:4000/routes

# Set baseline
curl -X POST http://localhost:4000/routes/R002/baseline

# Compute CB
curl http://localhost:4000/compliance/cb?shipId=R001&year=2025

# Create Pool
curl -X POST -H "Content-Type: application/json" \
  -d '{"year":2025,"members":[{"ship_id":"R001"},{"ship_id":"R005"}]}' \
  http://localhost:4000/pools

🧪 Testing

Backend unit tests (Jest + Supertest):

cd backend
npm run test


Frontend component tests (React Testing Library):

cd frontend
npm run test

🖼 Screenshots / Sample Dashboard
Routes Tab	Compare Tab	Banking Tab	Pooling Tab

	
	
	
✅ Notes

All business logic resides in core/ for frontend & backend.

API clients and repositories implement ports to maintain clean architecture.

Responsive UI built using TailwindCSS.

PostgreSQL DB schema ensures data integrity and supports Fuel EU Maritime compliance calculations.