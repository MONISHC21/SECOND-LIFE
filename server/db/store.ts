import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {
  User,
  Component,
  InventoryItem,
  Project,
  ProjectRequirement,
  CompletedProject,
  FavoriteProject,
  Notification,
  WasteStatistic,
} from '../types/index.ts';

const DB_FILE_PATH = path.resolve(process.cwd(), 'secondlife_data.json');

interface DatabaseSchema {
  users: User[];
  components: Component[];
  inventory: InventoryItem[];
  projects: Project[];
  projectRequirements: ProjectRequirement[];
  completedProjects: CompletedProject[];
  favoriteProjects: FavoriteProject[];
  wasteStatistics: WasteStatistic[];
  notifications: Notification[];
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
    if (this.data.components.length === 0 || this.data.projects.length === 0) {
      this.seedInitialData();
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to read database file, initializing defaults:', e);
    }

    return {
      users: [],
      components: [],
      inventory: [],
      projects: [],
      projectRequirements: [],
      completedProjects: [],
      favoriteProjects: [],
      wasteStatistics: [],
      notifications: [],
    };
  }

  public save(): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  private seedInitialData(): void {
    console.log('Seeding initial SecondLife catalog and demo accounts...');

    // Password hashes
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);

    // 1. Users
    const monishUser: User = {
      id: 'usr_monish_01',
      name: 'Monish Nandha Balan',
      email: 'monish@secondlife.local',
      passwordHash: defaultPasswordHash,
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Monish',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const adminUser: User = {
      id: 'usr_admin_01',
      name: 'Parameshwaran S (Admin)',
      email: 'admin@secondlife.local',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const guestUser: User = {
      id: 'usr_guest_demo',
      name: 'Guest Maker',
      email: 'guest@secondlife.local',
      passwordHash: defaultPasswordHash,
      role: 'GUEST',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.users = [monishUser, adminUser, guestUser];

    // 2. Components Catalog (22 items)
    const components: Component[] = [
      {
        id: 'comp_esp32',
        name: 'ESP32 NodeMCU Development Board',
        category: 'Microcontrollers',
        manufacturer: 'Espressif Systems',
        description: 'Wi-Fi & Bluetooth dual-core 240MHz microcontroller with rich GPIO and ADC peripherals.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 28.0,
        estimatedCO2Grams: 320.0,
        datasheetUrl: 'https://www.espressif.com/en/products/socs/esp32',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_arduino_uno',
        name: 'Arduino Uno R3 (ATmega328P)',
        category: 'Microcontrollers',
        manufacturer: 'Arduino LLC',
        description: 'Standard 16MHz 8-bit AVR board with 14 digital I/O pins, 6 analog inputs, and 5V logic.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 35.0,
        estimatedCO2Grams: 410.0,
        datasheetUrl: 'https://docs.arduino.cc/hardware/uno-rev3',
        imageUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d45f6?w=500&auto=format&fit=crop&q=60',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_hcsr04',
        name: 'HC-SR04 Ultrasonic Distance Sensor',
        category: 'Sensors',
        manufacturer: 'ElecFreaks',
        description: 'Contactless distance measurement module from 2cm to 400cm with 3mm precision using 40kHz ultrasound.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 14.0,
        estimatedCO2Grams: 160.0,
        datasheetUrl: 'https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_dht11',
        name: 'DHT11 Temperature & Humidity Sensor',
        category: 'Sensors',
        manufacturer: 'Aosong Electronics',
        description: 'Calibrated digital output temperature (0-50°C) and relative humidity (20-90% RH) sensor module.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 8.0,
        estimatedCO2Grams: 95.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_dht22',
        name: 'DHT22 / AM2302 Precision Temp & Humidity Sensor',
        category: 'Sensors',
        manufacturer: 'Aosong Electronics',
        description: 'High-accuracy digital sensor with -40 to 80°C range (±0.5°C) and 0-100% RH range (±2%).',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 12.0,
        estimatedCO2Grams: 140.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_dc_motor',
        name: 'TT Dual Shaft DC Gearbox Motor (3V-6V)',
        category: 'Motors',
        manufacturer: 'Adafruit / generic',
        description: 'Yellow 1:48 gear ratio DC motor capable of driving robot chassis wheels with high torque.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 42.0,
        estimatedCO2Grams: 280.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_servo_sg90',
        name: 'SG90 Micro Servo Motor (9g, 180°)',
        category: 'Motors',
        manufacturer: 'TowerPro',
        description: 'Lightweight micro servo for pan-tilt mechanisms, robotic grippers, and actuator gates.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 11.0,
        estimatedCO2Grams: 130.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_battery_18650',
        name: '18650 Li-Ion Rechargeable Battery Cell (3.7V 2600mAh)',
        category: 'Power',
        manufacturer: 'Samsung / LG / Panasonic',
        description: 'High-density lithium-ion cylindrical cell commonly recovered from laptop battery packs.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 48.0,
        estimatedCO2Grams: 750.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_oled_096',
        name: '0.96-inch Monochrome OLED Display Module (I2C 128x64)',
        category: 'Displays',
        manufacturer: 'SSD1306 Driver',
        description: 'Self-emitting high-contrast graphic display requiring only 2 data wires via I2C interface.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 9.0,
        estimatedCO2Grams: 190.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_motor_driver_l298n',
        name: 'L298N Dual H-Bridge Motor Driver Module',
        category: 'Modules',
        manufacturer: 'STMicroelectronics based',
        description: 'Dual-channel motor controller board capable of independently controlling speed and direction of 2 DC motors.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 30.0,
        estimatedCO2Grams: 310.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_soil_moisture',
        name: 'Capacitive Soil Moisture Sensor V1.2',
        category: 'Sensors',
        manufacturer: 'DFRobot style',
        description: 'Corrosion-resistant analog capacitive soil moisture probe for automated plant watering systems.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 15.0,
        estimatedCO2Grams: 120.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_relay_5v',
        name: '5V Single-Channel Relay Module (Optocoupler)',
        category: 'Modules',
        manufacturer: 'Songle / generic',
        description: 'Opto-isolated relay capable of switching AC 250V/10A or DC 30V/10A loads via 3.3V or 5V logic.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 18.0,
        estimatedCO2Grams: 210.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_pir_sensor',
        name: 'HC-SR501 PIR Pyroelectric Motion Sensor',
        category: 'Sensors',
        manufacturer: 'Murata sensor based',
        description: 'Passive infrared sensor detecting human body movement up to 7 meters with adjustable sensitivity.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 16.0,
        estimatedCO2Grams: 175.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_ir_sensor',
        name: 'TCRT5000 Infrared Reflective Obstacle Sensor',
        category: 'Sensors',
        manufacturer: 'Vishay based',
        description: 'Infrared emitter and phototransistor pair used for black/white line tracking and near-proximity detection.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 7.0,
        estimatedCO2Grams: 85.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_buzzer_piezo',
        name: 'Active 5V Piezoelectric Buzzer',
        category: 'Passive Components',
        manufacturer: 'Generic',
        description: 'Generates an audible ~2.3kHz tone when DC voltage is applied. Great for audible alerts and alarms.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 4.0,
        estimatedCO2Grams: 50.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_ldr_sensor',
        name: 'Photoresistor (LDR Light Dependent Resistor 5mm)',
        category: 'Sensors',
        manufacturer: 'Generic CdS',
        description: 'Variable resistor whose resistance decreases with increasing incident light intensity.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 1.5,
        estimatedCO2Grams: 30.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_push_button',
        name: 'Tactile Momentary Push Button Switch (6x6mm)',
        category: 'Passive Components',
        manufacturer: 'Omron style',
        description: 'Breadboard-friendly momentary microswitch for user trigger inputs.',
        defaultUnit: 'pcs',
        condition: 'NEW',
        estimatedWeightGrams: 2.0,
        estimatedCO2Grams: 25.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_led_red',
        name: '5mm Diffused Red LED Indicator (2.0V 20mA)',
        category: 'Passive Components',
        manufacturer: 'Generic',
        description: 'Standard optical indicator diode with 620-625nm wavelength.',
        defaultUnit: 'pcs',
        condition: 'NEW',
        estimatedWeightGrams: 1.0,
        estimatedCO2Grams: 15.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_resistor_220',
        name: '220 Ohm 1/4W Metal Film Resistors (Pack of 10)',
        category: 'Passive Components',
        manufacturer: 'Generic',
        description: 'Current-limiting resistors designed for 5V LED circuitry and signal pull-ups.',
        defaultUnit: 'pack',
        condition: 'NEW',
        estimatedWeightGrams: 3.0,
        estimatedCO2Grams: 20.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_jumper_wires',
        name: 'Male-to-Female & Male-to-Male Jumper Wires (40 pcs)',
        category: 'Tools',
        manufacturer: 'Generic Dupont',
        description: 'Multi-color 20cm breadboard connecting jumper wires with durable crimped pins.',
        defaultUnit: 'pack',
        condition: 'GOOD',
        estimatedWeightGrams: 32.0,
        estimatedCO2Grams: 110.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_mpu6050',
        name: 'MPU-6050 6-Axis Gyroscope & Accelerometer Module',
        category: 'Sensors',
        manufacturer: 'InvenSense',
        description: 'I2C motion tracking sensor combining 3-axis gyroscope and 3-axis accelerometer with DMP engine.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 6.0,
        estimatedCO2Grams: 125.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'comp_tp4056_charger',
        name: 'TP4056 1A Li-Ion Battery Charging Board with Protection',
        category: 'Power',
        manufacturer: 'NanJing Top Power',
        description: 'Micro-USB / Type-C single cell lithium charger board with overcharge and overdischarge protection.',
        defaultUnit: 'pcs',
        condition: 'GOOD',
        estimatedWeightGrams: 5.0,
        estimatedCO2Grams: 75.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.data.components = components;

    // 3. User Monish Inventory (The Exact Demo Scenario!)
    // ESP32 x1, HC-SR04 x1, DC Motor x2, 18650 Battery x1, Servo x1, DHT11 x1
    const monishInventory: InventoryItem[] = [
      {
        id: 'inv_monish_01',
        userId: monishUser.id,
        componentId: 'comp_esp32',
        quantity: 1,
        condition: 'GOOD',
        location: 'Electronics Bin A',
        notes: 'Harvested from previous IoT hackathon badge',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_monish_02',
        userId: monishUser.id,
        componentId: 'comp_hcsr04',
        quantity: 1,
        condition: 'GOOD',
        location: 'Sensors Box',
        notes: 'Tested working with 5V logic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_monish_03',
        userId: monishUser.id,
        componentId: 'comp_dc_motor',
        quantity: 2,
        condition: 'GOOD',
        location: 'Motors Drawer',
        notes: 'Yellow TT gear motors from old toy chassis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_monish_04',
        userId: monishUser.id,
        componentId: 'comp_battery_18650',
        quantity: 1,
        condition: 'GOOD',
        location: 'Battery Safety Case',
        notes: 'Recycled from unused laptop battery pack (tested 4.15V)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_monish_05',
        userId: monishUser.id,
        componentId: 'comp_servo_sg90',
        quantity: 1,
        condition: 'GOOD',
        location: 'Motors Drawer',
        notes: 'Micro servo with nylon horn intact',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_monish_06',
        userId: monishUser.id,
        componentId: 'comp_dht11',
        quantity: 1,
        condition: 'GOOD',
        location: 'Sensors Box',
        notes: '3-pin digital module with pull-up resistor built-in',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv_monish_07',
        userId: monishUser.id,
        componentId: 'comp_jumper_wires',
        quantity: 1,
        condition: 'GOOD',
        location: 'Workbench Organizer',
        notes: 'Assorted dupont wires',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.data.inventory = monishInventory;

    // 4. Predefined Reusable Projects (10 projects with engineering schematics)
    const projects: Project[] = [
      {
        id: 'proj_obstacle_rover',
        name: 'Obstacle Avoidance Autonomous Rover',
        slug: 'obstacle-avoidance-autonomous-rover',
        description: 'An autonomous two-wheeled robot rover that detects obstacles using ultrasonic echoes and steers clear in real time.',
        longDescription: 'This rover leverages ultrasonic soundwaves bouncing off walls and furniture to map clearance distances. When an obstacle is detected within 20cm, the ESP32 halts the DC motors, performs a reverse pivot turn, scans for an open vector, and resumes cruising.',
        difficulty: 'Intermediate',
        estimatedTimeHours: 3.5,
        category: 'Robotics',
        circuitDiagram: `ESP32 GPIO Pinout:
• GPIO 5  -> HC-SR04 Trig Pin
• GPIO 18 -> HC-SR04 Echo Pin (via voltage divider)
• GPIO 19 -> Motor Left A
• GPIO 21 -> Motor Left B
• GPIO 22 -> Motor Right A
• GPIO 23 -> Motor Right B
• VIN     <- 18650 Battery (via step-up / switch)
• GND     <-> Common Ground`,
        imageUrl: '/assets/projects/rover.png',
        estimatedWasteSavedGrams: 165.0,
        estimatedCO2ReductionGrams: 1680.0,
        tags: ['Robotics', 'Autonomous', 'Ultrasonic', 'ESP32'],
        instructions: [
          { stepNumber: 1, title: 'Chassis Assembly', detail: 'Mount the dual TT DC motors to the base plate using M3 machine screws and attach the rubber drive wheels.' },
          { stepNumber: 2, title: 'Sensor Front Bracket', detail: 'Affix the HC-SR04 ultrasonic sensor facing forward on the front bumper so the transceiver cones have an unobstructed view.' },
          { stepNumber: 3, title: 'Control Wiring', detail: 'Connect ESP32 GPIOs 5 and 18 to the trigger and echo pins. Wire motor leads to the H-bridge output terminals.' },
          { stepNumber: 4, title: 'Power Regulation & Code Upload', detail: 'Connect the 18650 cell through a power switch to the ESP32 VIN pin. Flash the avoidance firmware via USB.' },
        ],
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_smart_dustbin',
        name: 'Touchless Ultrasonic Smart Dustbin',
        slug: 'touchless-ultrasonic-smart-dustbin',
        description: 'Hygienic touchless waste receptacle that automatically opens its lid when hand motion is detected within 15cm.',
        longDescription: 'Promote hygiene and minimize surface contact in workshops and homes. When someone approaches with waste, the ultrasonic sensor triggers the SG90 micro-servo to smoothly rotate 90 degrees, opening the lid for 4 seconds before gently closing.',
        difficulty: 'Beginner',
        estimatedTimeHours: 2.0,
        category: 'Home Automation',
        circuitDiagram: `Circuit Wiring:
• ESP32 GPIO 13 -> SG90 Servo PWM Signal Pin (Orange wire)
• ESP32 GPIO 12 -> HC-SR04 Trigger Pin
• ESP32 GPIO 14 -> HC-SR04 Echo Pin
• 5V / VBUS      -> Servo VCC & Sensor VCC
• GND           <-> Common Ground Rails`,
        imageUrl: '/assets/projects/dustbin.png',
        estimatedWasteSavedGrams: 75.0,
        estimatedCO2ReductionGrams: 640.0,
        tags: ['Home Automation', 'Hygiene', 'Beginner Friendly', 'Servo'],
        instructions: [
          { stepNumber: 1, title: 'Lid Hinge Setup', detail: 'Attach a small pushrod or nylon linkage arm between the servo horn and the trash bin flapper lid.' },
          { stepNumber: 2, title: 'Sensor Positioning', detail: 'Cut a dual-circle slot on the bin bezel to seat the HC-SR04 ultrasonic transducers facing upward.' },
          { stepNumber: 3, title: 'Microcontroller Flash', detail: 'Load the distance threshold sketch. Set trigger threshold to 15cm with a 4-second hold delay.' },
        ],
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_iot_weather_station',
        name: 'Compact IoT Weather & Climate Station',
        slug: 'compact-iot-weather-climate-station',
        description: 'Real-time environmental telemetry monitor reporting ambient temperature, humidity, and heat index on a crisp OLED display.',
        longDescription: 'Gathers precise atmospheric readings every 2 seconds. In addition to local display on the 0.96-inch OLED screen, the ESP32 can publish telemetry over Wi-Fi via MQTT or HTTP REST endpoints to open-source dashboards.',
        difficulty: 'Beginner',
        estimatedTimeHours: 2.5,
        category: 'IoT & Telemetry',
        circuitDiagram: `Pinout Matrix:
• ESP32 GPIO 21 (SDA) -> OLED SDA Pin
• ESP32 GPIO 22 (SCL) -> OLED SCL Pin
• ESP32 GPIO 4        -> DHT11 Data Pin (with 10k pullup)
• 3.3V / GND          -> Power Rail Distribution`,
        imageUrl: '/assets/projects/weather.png',
        estimatedWasteSavedGrams: 65.0,
        estimatedCO2ReductionGrams: 690.0,
        tags: ['IoT', 'Environment', 'OLED', 'ESP32'],
        instructions: [
          { stepNumber: 1, title: 'I2C Bus Wiring', detail: 'Wire the SSD1306 OLED display to ESP32 default hardware I2C pins GPIO 21 and GPIO 22.' },
          { stepNumber: 2, title: 'DHT Sensor Hookup', detail: 'Connect DHT11 signal pin to GPIO 4. Verify 3.3V power is stable to avoid sensor thermal drift.' },
          { stepNumber: 3, title: 'Graphics & Telemetry', detail: 'Upload the weather station firmware with Adafruit_SSD1306 and DHT sensor libraries.' },
        ],
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_plant_monitor',
        name: 'IoT Automated Plant Soil Hydration Monitor',
        slug: 'iot-automated-plant-soil-hydration-monitor',
        description: 'Intelligent soil moisture monitoring system that triggers a relay water pump whenever botanical soil drops below hydration threshold.',
        longDescription: 'Prevents plant dehydration by measuring soil dielectric capacitance. When dry conditions persist for over 3 minutes, the system engages a 5V relay to activate an irrigation solenoid or water pump while logging hydration trends.',
        difficulty: 'Intermediate',
        estimatedTimeHours: 3.0,
        category: 'Agriculture & IoT',
        circuitDiagram: `Circuit Wiring:
• ESP32 GPIO 34 (ADC1_CH6) -> Soil Sensor Analog Out (AOUT)
• ESP32 GPIO 26             -> 5V Relay Control Signal IN
• 18650 Battery Rail        -> Power Regulation Circuit
• Relay NO (Normally Open)  -> In-line with DC water pump power`,
        imageUrl: '/assets/projects/plant.png',
        estimatedWasteSavedGrams: 110.0,
        estimatedCO2ReductionGrams: 1420.0,
        tags: ['Agriculture', 'Automation', 'Sensors', 'Relay'],
        instructions: [
          { stepNumber: 1, title: 'Probe Calibration', detail: 'Test analog readings in air (100% dry) and in a cup of water (100% wet) to set moisture thresholds.' },
          { stepNumber: 2, title: 'Relay Protection', detail: 'Verify flyback diode protection on the relay board to shield the microcontroller from inductive pump spikes.' },
          { stepNumber: 3, title: 'Insertion & Deployment', detail: 'Insert capacitive probe into plant potting soil up to the white indicator line.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_line_follower',
        name: 'High-Precision Autonomous Line Follower',
        slug: 'high-precision-autonomous-line-follower',
        description: 'Two-sensor optical track follower utilizing infrared reflectance differential to follow electrical tape tracks at high speed.',
        longDescription: 'A classic mechatronics competition robot. Two TCRT5000 infrared sensors read contrasting black and white surface reflections. A simple proportional feedback loop adjusts individual motor PWM speeds to hug curves smoothly.',
        difficulty: 'Intermediate',
        estimatedTimeHours: 4.0,
        category: 'Robotics',
        circuitDiagram: `Wiring Layout:
• Arduino Digital 2 -> Left IR Sensor DOUT
• Arduino Digital 3 -> Right IR Sensor DOUT
• Arduino D5, D6   -> L298N Left Motor Enable & Direction
• Arduino D9, D10  -> L298N Right Motor Enable & Direction
• 18650 Battery 7.4V -> L298N 12V Power Terminal`,
        imageUrl: '/assets/projects/linefollower.png',
        estimatedWasteSavedGrams: 175.0,
        estimatedCO2ReductionGrams: 1840.0,
        tags: ['Robotics', 'Arduino', 'Sensors', 'Motors'],
        instructions: [
          { stepNumber: 1, title: 'IR Sensor Alignment', detail: 'Mount both TCRT5000 sensors roughly 5mm above the track surface, spaced 15mm apart.' },
          { stepNumber: 2, title: 'Motor Driver Interface', detail: 'Connect Arduino PWM pins to L298N ENA/ENB and digital direction pins to IN1-IN4.' },
          { stepNumber: 3, title: 'PID Tuning', detail: 'Calibrate sensitivity potentiometers on the IR modules so high output triggers reliably over dark tape.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_smart_lock',
        name: 'Bluetooth BLE Smart Deadbolt Lock',
        slug: 'bluetooth-ble-smart-deadbolt-lock',
        description: 'Secure wireless door latch actuator featuring cryptographic BLE handshake, tactile manual override, and audible feedback.',
        longDescription: 'Turn existing mechanical deadbolts into hands-free smartphone unlocked latches. An ESP32 acts as an encrypted BLE GATT server. A valid cryptographic challenge from your phone commands the SG90 servo to turn the deadbolt mechanism.',
        difficulty: 'Advanced',
        estimatedTimeHours: 4.5,
        category: 'Security & Access',
        circuitDiagram: `Pin Connections:
• ESP32 GPIO 15 -> SG90 Servo Signal
• ESP32 GPIO 27 -> Piezo Buzzer Positive
• ESP32 GPIO 33 -> Push Button (with internal pullup)
• 5V & GND      -> Regulated Power Rail`,
        imageUrl: '/assets/projects/lock.png',
        estimatedWasteSavedGrams: 85.0,
        estimatedCO2ReductionGrams: 920.0,
        tags: ['Security', 'Bluetooth', 'ESP32', 'Actuator'],
        instructions: [
          { stepNumber: 1, title: 'Mechanical Coupler', detail: '3D print or craft a slotted adapter coupling the SG90 output horn to the door thumb-turn knob.' },
          { stepNumber: 2, title: 'Buzzer & Manual Button', detail: 'Mount button and buzzer on the internal side plate for emergency manual lock release.' },
          { stepNumber: 3, title: 'BLE Encryption Setup', detail: 'Configure passkey pairing in the ESP32 NimBLE stack to prevent replay attacks.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_ultrasonic_radar',
        name: 'Desktop Pan-Tilt Ultrasonic Sonar Radar',
        slug: 'desktop-pan-tilt-ultrasonic-sonar-radar',
        description: 'Mechanical sweeps of an ultrasonic transducer driven by dual servos to generate a real-time 180-degree radar map on screen.',
        longDescription: 'Simulates maritime and aviation active radar systems. A servo sweeps the HC-SR04 across an azimuthal arc. At every single degree step, distance soundings are acquired and mapped to polar coordinate visualizations.',
        difficulty: 'Intermediate',
        estimatedTimeHours: 3.5,
        category: 'Sensors & Visualization',
        circuitDiagram: `Radar Schematic:
• ESP32 GPIO 14 -> Pan Servo Signal
• ESP32 GPIO 12 -> HC-SR04 Trig
• ESP32 GPIO 13 -> HC-SR04 Echo
• 5V / 2A Supply -> Servo Power Rails (Separate from ESP32 3.3V)`,
        imageUrl: '/assets/projects/radar.png',
        estimatedWasteSavedGrams: 80.0,
        estimatedCO2ReductionGrams: 780.0,
        tags: ['Sensors', 'Robotics', 'Visualization', 'Servo'],
        instructions: [
          { stepNumber: 1, title: 'Pan Mount Assembly', detail: 'Fasten the HC-SR04 sensor bracket directly onto the servo motor rotating horn.' },
          { stepNumber: 2, title: 'Coordinate Mapping', detail: 'Write a serial streaming loop outputting (angle, distance_cm) tuples at 115200 baud.' },
          { stepNumber: 3, title: 'Canvas Radar UI', detail: 'Connect to the web application serial bridge or visualization dashboard.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_motion_alarm',
        name: 'Intrusion Detection Motion Alarm System',
        slug: 'intrusion-detection-motion-alarm-system',
        description: 'Perimeter defense system featuring passive infrared movement detection, flashing optical strobe, and acoustic siren.',
        longDescription: 'A standalone security sensor node designed for garages, sheds, or workshops. The HC-SR501 PIR sensor monitors ambient infrared heat gradients. Upon detection of an intruder, it activates a high-frequency piezo alarm and warning strobe.',
        difficulty: 'Beginner',
        estimatedTimeHours: 1.5,
        category: 'Security',
        circuitDiagram: `Pinout:
• ESP32 GPIO 19 -> HC-SR501 PIR Sensor OUT
• ESP32 GPIO 18 -> Piezo Buzzer (+)
• ESP32 GPIO 23 -> Red LED (through 220 Ohm resistor)
• Common GND    -> Circuit Ground`,
        imageUrl: '/assets/projects/alarm.png',
        estimatedWasteSavedGrams: 55.0,
        estimatedCO2ReductionGrams: 540.0,
        tags: ['Security', 'Beginner', 'Audio', 'Sensors'],
        instructions: [
          { stepNumber: 1, title: 'PIR Sensitivity Calibration', detail: 'Adjust time delay potentiometer counter-clockwise to 3 seconds and sensitivity to 5 meters.' },
          { stepNumber: 2, title: 'Resistor LED Hookup', detail: 'Ensure 220 Ohm current-limiting resistor is placed in series with the Red LED anode.' },
          { stepNumber: 3, title: 'Test Siren Sequence', detail: 'Run alert routine flashing LED at 5Hz while pulsing the active piezo buzzer.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_touchless_light_switch',
        name: 'Proximity Gesture Touchless Appliance Switch',
        slug: 'proximity-gesture-touchless-appliance-switch',
        description: 'Mains or lamp lighting controller switched via wave gesture or PIR motion to eliminate physical switch touching.',
        longDescription: 'Designed for kitchens, laboratories, and workshops where hands may be wet or contaminated. A proximity or motion sensor activates a heavy-duty isolated relay switch with latching toggle logic.',
        difficulty: 'Intermediate',
        estimatedTimeHours: 2.5,
        category: 'Home Automation',
        circuitDiagram: `Wiring Schematic:
• ESP32 GPIO 25 -> PIR Motion Sensor OUT
• ESP32 GPIO 32 -> 5V Relay Control IN
• Relay NO/COM  -> In-line with lamp cord AC line (Caution: High Voltage Safety)`,
        imageUrl: '/assets/projects/switch.png',
        estimatedWasteSavedGrams: 90.0,
        estimatedCO2ReductionGrams: 980.0,
        tags: ['Home Automation', 'Relay', 'ESP32'],
        instructions: [
          { stepNumber: 1, title: 'Optocoupler Verification', detail: 'Verify opto-isolation jumper on the relay module is configured for 3.3V GPIO compatibility.' },
          { stepNumber: 2, title: 'Latching Logic Code', detail: 'Implement debounce software state machine so repeated movements maintain switched state.' },
          { stepNumber: 3, title: 'Insulated Enclosure', detail: 'Mount in non-conductive flame-retardant box with strain relief on load wires.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'proj_solar_eco_tracker',
        name: 'Solar-Assisted Environmental Data Logger',
        slug: 'solar-assisted-environmental-data-logger',
        description: 'Low-power weather and ambient sunlight datalogger running on harvested lithium power with deep sleep cycles.',
        longDescription: 'Leverages ESP32 deep-sleep modes consuming under 15 microamps between logging events. Wakes up once every 10 minutes to record temperature, humidity, and lux light levels before returning to sleep.',
        difficulty: 'Advanced',
        estimatedTimeHours: 4.0,
        category: 'IoT & Telemetry',
        circuitDiagram: `Circuit Diagram:
• ESP32 GPIO 4        -> DHT22 Data Pin
• ESP32 GPIO 36 (VP)  -> LDR Voltage Divider Pin
• 18650 Battery Rail  -> TP4056 Charger Output
• Deep Sleep RTC Wake -> Timer configured to 600 seconds`,
        imageUrl: '/assets/projects/solar.png',
        estimatedWasteSavedGrams: 145.0,
        estimatedCO2ReductionGrams: 1530.0,
        tags: ['IoT', 'Solar', 'Low Power', 'Environment'],
        instructions: [
          { stepNumber: 1, title: 'LDR Voltage Divider', detail: 'Create a divider with 10k resistor and LDR connecting to analog GPIO 36.' },
          { stepNumber: 2, title: 'Deep Sleep Optimization', detail: 'Disable onboard Wi-Fi and Bluetooth peripherals prior to invoking esp_deep_sleep_start().' },
          { stepNumber: 3, title: 'Battery Fuel Gauge', detail: 'Monitor 18650 cell degradation over extended charge cycles.' },
        ],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.data.projects = projects;

    // 5. Project Requirements Linking Components to Projects
    const requirements: ProjectRequirement[] = [
      // 1. Obstacle Avoidance Rover (ESP32 x1, HC-SR04 x1, DC Motor x2, 18650 Battery x1) -> Monish has ALL 4!
      { id: 'req_rover_01', projectId: 'proj_obstacle_rover', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_rover_02', projectId: 'proj_obstacle_rover', componentId: 'comp_hcsr04', requiredQuantity: 1, isOptional: false },
      { id: 'req_rover_03', projectId: 'proj_obstacle_rover', componentId: 'comp_dc_motor', requiredQuantity: 2, isOptional: false },
      { id: 'req_rover_04', projectId: 'proj_obstacle_rover', componentId: 'comp_battery_18650', requiredQuantity: 1, isOptional: false },

      // 2. Smart Dustbin (ESP32 x1, HC-SR04 x1, Servo SG90 x1) -> Monish has ALL 3!
      { id: 'req_dustbin_01', projectId: 'proj_smart_dustbin', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_dustbin_02', projectId: 'proj_smart_dustbin', componentId: 'comp_hcsr04', requiredQuantity: 1, isOptional: false },
      { id: 'req_dustbin_03', projectId: 'proj_smart_dustbin', componentId: 'comp_servo_sg90', requiredQuantity: 1, isOptional: false },

      // 3. IoT Weather Station (ESP32 x1, DHT11 x1, 0.96 OLED x1) -> Monish has 2/3 (missing OLED)
      { id: 'req_weather_01', projectId: 'proj_iot_weather_station', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_weather_02', projectId: 'proj_iot_weather_station', componentId: 'comp_dht11', requiredQuantity: 1, isOptional: false },
      { id: 'req_weather_03', projectId: 'proj_iot_weather_station', componentId: 'comp_oled_096', requiredQuantity: 1, isOptional: false },

      // 4. Plant Hydration Monitor (ESP32 x1, Soil Moisture x1, Relay x1, 18650 Battery x1) -> Monish has 2/4 (missing Soil, Relay)
      { id: 'req_plant_01', projectId: 'proj_plant_monitor', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_plant_02', projectId: 'proj_plant_monitor', componentId: 'comp_soil_moisture', requiredQuantity: 1, isOptional: false },
      { id: 'req_plant_03', projectId: 'proj_plant_monitor', componentId: 'comp_relay_5v', requiredQuantity: 1, isOptional: false },
      { id: 'req_plant_04', projectId: 'proj_plant_monitor', componentId: 'comp_battery_18650', requiredQuantity: 1, isOptional: false },

      // 5. Line Follower Robot (Arduino Uno x1, IR Sensor x2, DC Motor x2, 18650 Battery x1, Motor Driver x1)
      { id: 'req_line_01', projectId: 'proj_line_follower', componentId: 'comp_arduino_uno', requiredQuantity: 1, isOptional: false },
      { id: 'req_line_02', projectId: 'proj_line_follower', componentId: 'comp_ir_sensor', requiredQuantity: 2, isOptional: false },
      { id: 'req_line_03', projectId: 'proj_line_follower', componentId: 'comp_dc_motor', requiredQuantity: 2, isOptional: false },
      { id: 'req_line_04', projectId: 'proj_line_follower', componentId: 'comp_battery_18650', requiredQuantity: 1, isOptional: false },
      { id: 'req_line_05', projectId: 'proj_line_follower', componentId: 'comp_motor_driver_l298n', requiredQuantity: 1, isOptional: false },

      // 6. Bluetooth Smart Lock (ESP32 x1, Servo SG90 x1, Piezo Buzzer x1, Push Button x1)
      { id: 'req_lock_01', projectId: 'proj_smart_lock', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_lock_02', projectId: 'proj_smart_lock', componentId: 'comp_servo_sg90', requiredQuantity: 1, isOptional: false },
      { id: 'req_lock_03', projectId: 'proj_smart_lock', componentId: 'comp_buzzer_piezo', requiredQuantity: 1, isOptional: false },
      { id: 'req_lock_04', projectId: 'proj_smart_lock', componentId: 'comp_push_button', requiredQuantity: 1, isOptional: false },

      // 7. Desktop Ultrasonic Radar (ESP32 x1, HC-SR04 x1, Servo SG90 x2)
      { id: 'req_radar_01', projectId: 'proj_ultrasonic_radar', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_radar_02', projectId: 'proj_ultrasonic_radar', componentId: 'comp_hcsr04', requiredQuantity: 1, isOptional: false },
      { id: 'req_radar_03', projectId: 'proj_ultrasonic_radar', componentId: 'comp_servo_sg90', requiredQuantity: 2, isOptional: false, notes: 'Requires 2 servos for pan & tilt' },

      // 8. Intrusion Alarm (ESP32 x1, PIR Sensor x1, Piezo Buzzer x1, Red LED x1, Resistor 220 x1)
      { id: 'req_alarm_01', projectId: 'proj_motion_alarm', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_alarm_02', projectId: 'proj_motion_alarm', componentId: 'comp_pir_sensor', requiredQuantity: 1, isOptional: false },
      { id: 'req_alarm_03', projectId: 'proj_motion_alarm', componentId: 'comp_buzzer_piezo', requiredQuantity: 1, isOptional: false },
      { id: 'req_alarm_04', projectId: 'proj_motion_alarm', componentId: 'comp_led_red', requiredQuantity: 1, isOptional: false },
      { id: 'req_alarm_05', projectId: 'proj_motion_alarm', componentId: 'comp_resistor_220', requiredQuantity: 1, isOptional: true },

      // 9. Touchless Light Switch (ESP32 x1, PIR Sensor x1, Relay x1)
      { id: 'req_switch_01', projectId: 'proj_touchless_light_switch', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_switch_02', projectId: 'proj_touchless_light_switch', componentId: 'comp_pir_sensor', requiredQuantity: 1, isOptional: false },
      { id: 'req_switch_03', projectId: 'proj_touchless_light_switch', componentId: 'comp_relay_5v', requiredQuantity: 1, isOptional: false },

      // 10. Solar Eco Tracker (ESP32 x1, DHT22 x1, LDR x1, 18650 Battery x1)
      { id: 'req_solar_01', projectId: 'proj_solar_eco_tracker', componentId: 'comp_esp32', requiredQuantity: 1, isOptional: false },
      { id: 'req_solar_02', projectId: 'proj_solar_eco_tracker', componentId: 'comp_dht22', requiredQuantity: 1, isOptional: false },
      { id: 'req_solar_03', projectId: 'proj_solar_eco_tracker', componentId: 'comp_ldr_sensor', requiredQuantity: 1, isOptional: false },
      { id: 'req_solar_04', projectId: 'proj_solar_eco_tracker', componentId: 'comp_battery_18650', requiredQuantity: 1, isOptional: false },
    ];

    this.data.projectRequirements = requirements;

    // 6. Monish Notifications
    this.data.notifications = [
      {
        id: 'notif_01',
        userId: monishUser.id,
        title: 'Project Match Available',
        message: 'Your inventory matches 100% with Obstacle Avoidance Rover! You have all required parts.',
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif_02',
        userId: monishUser.id,
        title: 'E-Waste Reduction Milestone',
        message: 'Your registered components represent 145g of saved hardware from local landfill streams.',
        type: 'info',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    this.save();
    console.log('Database seeded successfully.');
  }

  // User CRUD
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const len = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.data.inventory = this.data.inventory.filter((i) => i.userId !== id);
    this.data.completedProjects = this.data.completedProjects.filter((c) => c.userId !== id);
    this.data.favoriteProjects = this.data.favoriteProjects.filter((f) => f.userId !== id);
    this.save();
    return this.data.users.length < len;
  }

  // Component Catalog CRUD
  public getComponents(): Component[] {
    return this.data.components;
  }

  public getComponentById(id: string): Component | undefined {
    return this.data.components.find((c) => c.id === id);
  }

  public createComponent(component: Component): Component {
    this.data.components.push(component);
    this.save();
    return component;
  }

  public updateComponent(id: string, updates: Partial<Component>): Component | null {
    const idx = this.data.components.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.components[idx] = { ...this.data.components[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.components[idx];
  }

  public deleteComponent(id: string): boolean {
    const len = this.data.components.length;
    this.data.components = this.data.components.filter((c) => c.id !== id);
    this.data.projectRequirements = this.data.projectRequirements.filter((r) => r.componentId !== id);
    this.data.inventory = this.data.inventory.filter((i) => i.componentId !== id);
    this.save();
    return this.data.components.length < len;
  }

  // User Inventory CRUD
  public getInventoryByUserId(userId: string): InventoryItem[] {
    return this.data.inventory
      .filter((i) => i.userId === userId)
      .map((item) => ({
        ...item,
        component: this.getComponentById(item.componentId),
      }));
  }

  public getInventoryItem(id: string): InventoryItem | undefined {
    const item = this.data.inventory.find((i) => i.id === id);
    if (!item) return undefined;
    return {
      ...item,
      component: this.getComponentById(item.componentId),
    };
  }

  public addInventoryItem(item: InventoryItem): InventoryItem {
    // If user already has this component in inventory, we can increment or upsert
    const existingIdx = this.data.inventory.findIndex(
      (i) => i.userId === item.userId && i.componentId === item.componentId
    );

    if (existingIdx !== -1) {
      this.data.inventory[existingIdx].quantity += item.quantity;
      this.data.inventory[existingIdx].updatedAt = new Date().toISOString();
      if (item.notes) this.data.inventory[existingIdx].notes = item.notes;
      if (item.location) this.data.inventory[existingIdx].location = item.location;
      this.save();
      return {
        ...this.data.inventory[existingIdx],
        component: this.getComponentById(item.componentId),
      };
    }

    this.data.inventory.push(item);
    this.save();
    return {
      ...item,
      component: this.getComponentById(item.componentId),
    };
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const idx = this.data.inventory.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.inventory[idx] = { ...this.data.inventory[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return {
      ...this.data.inventory[idx],
      component: this.getComponentById(this.data.inventory[idx].componentId),
    };
  }

  public deleteInventoryItem(id: string): boolean {
    const len = this.data.inventory.length;
    this.data.inventory = this.data.inventory.filter((i) => i.id !== id);
    this.save();
    return this.data.inventory.length < len;
  }

  // Projects CRUD
  public getProjects(): Project[] {
    return this.data.projects.map((p) => this.hydrateProject(p));
  }

  public getProjectById(id: string): Project | undefined {
    const p = this.data.projects.find((proj) => proj.id === id || proj.slug === id);
    if (!p) return undefined;
    return this.hydrateProject(p);
  }

  public createProject(project: Project, requirements?: ProjectRequirement[]): Project {
    this.data.projects.push(project);
    if (requirements && requirements.length > 0) {
      this.data.projectRequirements.push(...requirements);
    }
    this.save();
    return this.hydrateProject(project);
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = { ...this.data.projects[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.hydrateProject(this.data.projects[idx]);
  }

  public deleteProject(id: string): boolean {
    const len = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    this.data.projectRequirements = this.data.projectRequirements.filter((r) => r.projectId !== id);
    this.data.completedProjects = this.data.completedProjects.filter((c) => c.projectId !== id);
    this.data.favoriteProjects = this.data.favoriteProjects.filter((f) => f.projectId !== id);
    this.save();
    return this.data.projects.length < len;
  }

  public getProjectRequirements(projectId: string): ProjectRequirement[] {
    return this.data.projectRequirements
      .filter((r) => r.projectId === projectId)
      .map((r) => ({
        ...r,
        component: this.getComponentById(r.componentId),
      }));
  }

  public updateProjectRequirements(projectId: string, newRequirements: ProjectRequirement[]): void {
    this.data.projectRequirements = this.data.projectRequirements.filter((r) => r.projectId !== projectId);
    this.data.projectRequirements.push(...newRequirements);
    this.save();
  }

  private hydrateProject(project: Project): Project {
    return {
      ...project,
      requirements: this.getProjectRequirements(project.id),
    };
  }

  // Completed Projects & Favorites
  public getCompletedProjects(userId: string): CompletedProject[] {
    return this.data.completedProjects
      .filter((c) => c.userId === userId)
      .map((c) => ({
        ...c,
        project: this.getProjectById(c.projectId),
      }));
  }

  public markProjectCompleted(userId: string, projectId: string, notes?: string, rating?: number): CompletedProject {
    const existingIdx = this.data.completedProjects.findIndex(
      (c) => c.userId === userId && c.projectId === projectId
    );

    if (existingIdx !== -1) {
      this.data.completedProjects[existingIdx].notes = notes;
      this.data.completedProjects[existingIdx].rating = rating;
      this.save();
      return this.data.completedProjects[existingIdx];
    }

    const item: CompletedProject = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      projectId,
      rating,
      notes,
      completedAt: new Date().toISOString(),
    };
    this.data.completedProjects.push(item);
    this.save();
    return item;
  }

  public getFavoriteProjects(userId: string): string[] {
    return this.data.favoriteProjects.filter((f) => f.userId === userId).map((f) => f.projectId);
  }

  public toggleFavoriteProject(userId: string, projectId: string): boolean {
    const idx = this.data.favoriteProjects.findIndex((f) => f.userId === userId && f.projectId === projectId);
    if (idx !== -1) {
      this.data.favoriteProjects.splice(idx, 1);
      this.save();
      return false; // Removed
    } else {
      this.data.favoriteProjects.push({
        id: `fav_${Date.now()}`,
        userId,
        projectId,
        createdAt: new Date().toISOString(),
      });
      this.save();
      return true; // Added
    }
  }

  // Notifications
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
  }

  // Analytics & Stats
  public getSystemAnalytics() {
    const totalUsers = this.data.users.length;
    const totalComponents = this.data.components.length;
    const totalProjects = this.data.projects.length;
    const totalInventoryItems = this.data.inventory.length;
    const totalCompletedProjects = this.data.completedProjects.length;

    // Total physical components registered in user inventories
    const totalPhysicalPieces = this.data.inventory.reduce((acc, curr) => acc + curr.quantity, 0);

    // Sum estimated waste saved
    let totalWasteSavedGrams = 0;
    let totalCO2SavedGrams = 0;

    for (const inv of this.data.inventory) {
      const comp = this.getComponentById(inv.componentId);
      if (comp) {
        totalWasteSavedGrams += comp.estimatedWeightGrams * inv.quantity;
        totalCO2SavedGrams += comp.estimatedCO2Grams * inv.quantity;
      }
    }

    return {
      totalUsers,
      totalComponents,
      totalProjects,
      totalInventoryItems,
      totalPhysicalPieces,
      totalCompletedProjects,
      totalWasteSavedGrams: Math.round(totalWasteSavedGrams),
      totalCO2SavedGrams: Math.round(totalCO2SavedGrams),
    };
  }
}

export const db = new Store();
