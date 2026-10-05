# SecondLife

> **Component-to-project discovery and reuse platform for sustainable e-waste reduction.**

Turn unused electronic components into buildable projects. SecondLife calculates build feasibility, identifies missing parts, and drives sustainable e-waste reduction.

---

## Problem Statement

Electronic waste (e-waste) is the fastest-growing domestic waste stream on the planet, with over **53 million metric tons** discarded every year. Meanwhile, makers, students, hobbyists, and university laboratories regularly purchase duplicate microcontrollers, sensors, and actuators for single coursework projects, only to leave them forgotten inside drawers and bins.

Existing project tutorial repositories require makers to follow fixed shopping lists, encouraging further consumption and discarding of existing hardware. What is needed is an inverted discovery platform: **"Tell us what components you have. We show you what you can build."**

---

## Proposed Solution

**SecondLife** connects:

$$\text{WHAT I HAVE} \quad\longrightarrow\quad \text{MATCHING ENGINE} \quad\longrightarrow\quad \text{WHAT I CAN BUILD}$$

Instead of immediately buying new components or discarding unused electronics:
1. Users register their available electronic hardware in an organized digital inventory.
2. The platform's deterministic, quantity-aware matching engine compares inventory items against bills of materials (BOM) across 10+ predefined maker projects.
3. SecondLife computes a real-time **Build Feasibility Score (0–100%)**, specifies exact missing components, ranks recommendations, and quantifies environmental mass and CO₂ emissions diverted from landfills.

---

## Key Features

1. **Authentication & Multi-Role Authorization (RBAC)**
   - Role-based security for **Guest**, **Registered User**, and **Admin**.
   - Secure bcrypt password hashing and signed JSON Web Tokens (JWT).
   - 1-Click evaluator demo switcher between **Monish (Student Maker)**, **Admin**, and **Guest**.

2. **Quantity-Aware Matching Engine**
   - Evaluates mandatory vs. optional component dependencies.
   - Accurately tracks partial quantity availability (e.g., if a rover needs $2\times$ DC Motors and the user owns $1\times$, it flags $+1$ missing).
   - Ranks projects dynamically by highest compatibility percentage and fewest missing parts.

3. **Predefined Reusable Project Library**
   - 10 comprehensive blueprints including:
     - Obstacle Avoidance Autonomous Rover
     - Touchless Ultrasonic Smart Dustbin
     - Compact IoT Weather & Climate Station
     - IoT Automated Plant Soil Hydration Monitor
     - Autonomous High-Precision Line Follower Robot
     - Bluetooth BLE Smart Deadbolt Lock
     - Desktop Pan-Tilt Ultrasonic Sonar Radar
     - Intrusion Detection Motion Alarm System
     - Proximity Gesture Touchless Appliance Switch
     - Solar-Assisted Environmental Data Logger
   - Complete GPIO pinout mappings, circuit schematics, and step-by-step assembly guides.

4. **Component Inventory Management**
   - 22 master electronic components across 8 categories: *Microcontrollers, Sensors, Motors, Displays, Power, Modules, Passive Components, Tools*.
   - Filter by category, search by name/tags, track physical condition (*New, Good, Used, Damaged*), and assign storage bin locations.

5. **Sustainability & Ecological Analytics**
   - Cumulative grams and kilograms of electronic waste diverted from landfills.
   - Embodied manufacturing CO₂ reduction metrics.
   - Real-world ecological equivalents (e.g., tree-years of CO₂ absorption, EV driving distance offset).
   - Transparent disclaimer clarifying prototype baseline estimates.

6. **Interactive 3D Landing Page**
   - Lightweight Three.js procedural rendering of floating electronic hardware (ESP32 PCB, DIP-16 IC chip, HC-SR04 ultrasonic barrels, electrolytic capacitors, and axial resistors).
   - Mouse parallax interactivity with smooth lighting and zero external heavy asset dependencies.

7. **Interactive Landing Page Sandbox**
   - Allows prospective users and judges to test the rule-based matching engine directly without creating an account.

8. **Admin Control Console**
   - User account lifecycle and role management.
   - Master catalog component creation and project blueprint administration.
   - Global system telemetry and platform aggregate metrics.

---

## How It Works

```
┌─────────────────────────────────┐
│     USER INVENTORY ENTRY        │  (ESP32 x1, HC-SR04 x1, DC Motor x2, 18650 Battery x1)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    CATALOG NORMALIZATION        │  (Pinout mapping, unit weight, category classification)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    QUANTITY-AWARE MATCHING      │  (Compares against Project Bill of Materials)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   FEASIBILITY SCORE ENGINE      │  (Fulfilled / Total Required * 100)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   RECOMMENDATION DASHBOARD      │  (100% Ready to Build: Obstacle Avoidance Rover)
└─────────────────────────────────┘
```

---

## Matching Engine

The core matching algorithm is deterministic and rule-based (`server/services/matchingService.ts`):

$$\text{Compatibility Percentage} = \left( \frac{\sum \min(\text{AvailableQty}_i, \text{RequiredQty}_i)}{\sum \text{RequiredQty}_i} \right) \times 100$$

### Feasibility Status Thresholds:
- **100%**: `READY_TO_BUILD` — All required BOM components available in user inventory.
- **75% – 99%**: `NEAR_MATCH` — Core controller and primary peripherals available; 1 minor component missing.
- **50% – 74%**: `PARTIAL_MATCH` — Capable of partial breadboard testing.
- **< 50%**: `LOW_MATCH` — Significant hardware acquisitions required.

---

## Technology Stack

### Frontend
- **React.js 19** (Vite SPA)
- **TypeScript**
- **Tailwind CSS 4**
- **Three.js** (Lightweight 3D interactive hero canvas)
- **Zustand** (Modular reactive state stores)
- **React Router 7**
- **Lucide React** (Clean engineering iconography)
- **Canvas Confetti** (Celebratory build completion reward)

### Backend
- **Node.js 22** & **Express.js**
- **RESTful API** architecture
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for one-way password hashing

### Database & ORM
- **Prisma ORM** (`prisma/schema.prisma`)
- **PostgreSQL** schema definition
- Atomic persistent store for zero-latency execution

---

## System Architecture

```
secondlife/
├── prisma/
│   ├── schema.prisma          # PostgreSQL relational schema
│   └── seed.ts                # Database seeder
├── server/
│   ├── config/index.ts        # App configuration & JWT secrets
│   ├── controllers/           # REST API controllers
│   ├── db/store.ts            # Data persistence layer
│   ├── middleware/auth.ts     # JWT & Role-Based Access Control
│   ├── routes/                # Express API endpoints
│   ├── services/              # Core matchingService & algorithms
│   └── types/                 # Shared TypeScript interfaces
├── src/
│   ├── components/            # Reusable UI & Three.js 3D hero
│   ├── layouts/               # App layout with Sidebar & Navbar
│   ├── pages/                 # Full-page views (Dashboard, Recommendations, etc.)
│   ├── services/api.ts        # Centralized HTTP client
│   └── store/                 # Zustand stores (Auth, Inventory, Projects, UI)
├── docker-compose.yml         # Containerized Postgres & Server setup
├── package.json
└── server.ts                  # Full-stack server entry point (Express + Vite)
```

---

## Database Architecture

Prisma schema defines 9 interconnected models:
- `User` (id, email, passwordHash, role, name, avatar)
- `Component` (id, name, category, manufacturer, estimatedWeightGrams, estimatedCO2Grams)
- `Inventory` (userId, componentId, quantity, condition, location, notes)
- `Project` (id, name, slug, difficulty, estimatedTimeHours, category, circuitDiagram)
- `ProjectRequirement` (projectId, componentId, requiredQuantity, isOptional)
- `Recommendation` (userId, projectId, compatibilityPercentage, status)
- `CompletedProject` (userId, projectId, rating, notes, completedAt)
- `FavoriteProject` (userId, projectId, createdAt)
- `WasteStatistic` (userId, componentsReusedCount, wasteSavedGrams, co2ReducedGrams)

---

## API Structure

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Create new maker account |
| `POST` | `/api/auth/login` | Public | Sign in with email & password |
| `POST` | `/api/auth/demo-login` | Public | 1-Click evaluator demo login |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current session profile |
| `GET` | `/api/components` | Public | Search master electronics catalog |
| `POST` | `/api/components` | Admin | Create master catalog component |
| `GET` | `/api/inventory` | Authenticated | Fetch user's physical hardware stock |
| `POST` | `/api/inventory` | Authenticated | Add hardware item to inventory |
| `POST` | `/api/inventory/reset-demo` | Authenticated | Restore PS3 benchmark scenario |
| `PUT` | `/api/inventory/:id` | Authenticated | Update item quantity or condition |
| `DELETE` | `/api/inventory/:id` | Authenticated | Remove hardware from inventory |
| `GET` | `/api/projects` | Public | List reusable project blueprints |
| `GET` | `/api/projects/:id` | Public | View project schematic and requirements |
| `POST` | `/api/projects/:id/complete` | Authenticated | Record project built & log e-waste saved |
| `POST` | `/api/projects/:id/favorite` | Authenticated | Bookmark project |
| `GET` | `/api/recommendations` | Authenticated | Run matching engine for user inventory |
| `POST` | `/api/matching/analyze` | Public | Sandbox ad-hoc component matching |
| `GET` | `/api/sustainability` | Public | Ecological metrics & material distribution |
| `GET` | `/api/admin/analytics` | Admin | System telemetry and platform overview |

---

## Demo Scenario (TechTrove 3.0 PS3)

To test the complete workflow in under 60 seconds:
1. Click **Demo: Monish** in the top bar navigation.
2. The inventory loads the benchmark hardware set:
   - `ESP32 NodeMCU` $\times 1$
   - `HC-SR04 Ultrasonic Distance Sensor` $\times 1$
   - `TT Dual Shaft DC Gearbox Motor` $\times 2$
   - `18650 Li-Ion Battery Cell` $\times 1$
   - `SG90 Micro Servo Motor` $\times 1$
   - `DHT11 Temperature & Humidity Sensor` $\times 1$
3. Navigate to **Matching Engine**:
   - `Obstacle Avoidance Autonomous Rover` $\longrightarrow$ **100% READY TO BUILD**
   - `Touchless Ultrasonic Smart Dustbin` $\longrightarrow$ **100% READY TO BUILD**
   - `Compact IoT Weather Station` $\longrightarrow$ **NEAR MATCH** (Missing 1 OLED Display)
4. Open the **Obstacle Avoidance Rover** blueprint, review the GPIO schematic, and click **Mark as Built & Reused** to celebrate with confetti and record verified e-waste reduction!

---

## Installation & Running Locally

### Prerequisites
- Node.js >= 20
- npm >= 9

### Step 1: Clone Repository
```bash
git clone https://github.com/MONISHC21/SECOND_LIFE.git
cd SECOND_LIFE
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Step 4: Run Application
```bash
npm run dev
```
The application will launch at **`http://localhost:3000`** with full-stack Express API and Vite live frontend!

### Optional: Docker Compose
```bash
docker compose up --build
```

---

## Future Scope

- **AI-Powered Image Recognition (Gemini Vision)**: Snap a smartphone photo of an unidentified IC or circuit board to automatically extract manufacturer part numbers via OCR.
- **Automatic Pinout Compatibility Solver**: AI-assisted pinout conflict resolution for sharing I2C and SPI buses across multiple sensor shields.
- **Campus & Makerspace Hardware Marketplace**: Peer-to-peer component lending and swap boards for university engineering labs.
- **AI Schematic & Code Generator**: Automatic generation of Arduino / MicroPython driver code tailored to the exact pinout of the user's matched project.

---

## Team

**TechTrove 3.0 — Problem Statement 3: Second Life**

- **C. Monish Nandha Balan** — Full-Stack Engineering, Matching Algorithm & Product Architecture
- **Parameshwaran S** — Database Architecture, Systems Design & Admin Controls
