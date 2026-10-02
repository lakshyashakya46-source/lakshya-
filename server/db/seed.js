const db = require('./database');

const departments = [
  {
    id: 'dept_edu',
    code: 'EDU',
    name_en: 'School Education & Literacy (School Theek Karo)',
    name_hi: 'स्कूली शिक्षा और साक्षरता विभाग',
    ministry: 'Ministry of Education / State Education Directorate',
    icon: 'School',
    color: 'emerald',
    total_budget_cr: 1420.50,
    disbursed_cr: 840.20,
    active_projects: 428,
    description: 'Rebuilding government school infrastructure, modern STEM labs, clean sanitation blocks, and drinking water facilities across India.'
  },
  {
    id: 'dept_trans',
    code: 'TRANS',
    name_en: 'Road Transport & Rural Connectivity',
    name_hi: 'सड़क परिवहन एवं ग्रामीण संयोजकता',
    ministry: 'Ministry of Rural Development / PMGSY',
    icon: 'Truck',
    color: 'amber',
    total_budget_cr: 3850.00,
    disbursed_cr: 2150.75,
    active_projects: 312,
    description: 'All-weather road construction, bridge culverts, and urban feeder hubs connecting rural villages to economic corridors.'
  },
  {
    id: 'dept_startup',
    code: 'STARTUP',
    name_en: 'Innovation & Startup Seed Grants',
    name_hi: 'नवाचार एवं स्टार्टअप बीज अनुदान',
    ministry: 'DPIIT / Ministry of Commerce & Industry',
    icon: 'Rocket',
    color: 'indigo',
    total_budget_cr: 650.00,
    disbursed_cr: 380.40,
    active_projects: 184,
    description: 'Milestone-linked prototype development and lab commissioning grants for deep-tech, agri-tech, and hardware startups.'
  },
  {
    id: 'dept_water',
    code: 'WATER',
    name_en: 'Jal Jeevan Mission (Har Ghar Jal)',
    name_hi: 'जल जीवन मिशन - हर घर जल',
    ministry: 'Ministry of Jal Shakti',
    icon: 'Droplets',
    color: 'cyan',
    total_budget_cr: 2900.00,
    disbursed_cr: 1720.10,
    active_projects: 560,
    description: 'Clean functional household tap connections, overhead reservoirs, and automated water quality testing sensors in schools & villages.'
  },
  {
    id: 'dept_health',
    code: 'HEALTH',
    name_en: 'Primary Healthcare & Ayushman Mandir',
    name_hi: 'प्राथमिक स्वास्थ्य एवं आयुष्मान मंदिर',
    ministry: 'Ministry of Health & Family Welfare / NHM',
    icon: 'Activity',
    color: 'rose',
    total_budget_cr: 1820.00,
    disbursed_cr: 990.60,
    active_projects: 245,
    description: 'Upgrading Primary Health Centres (PHCs), maternal-child care units, diagnostic equipment, and medical oxygen storage.'
  }
];

const contractors = [
  {
    id: 'cont_1',
    company_name: 'National Infra & Civic Builders Ltd (NICBL)',
    registration_no: 'GSTIN: 07AAACN1234F1Z5',
    category: 'CIVIL_WORKS',
    rating: 4.8,
    active_contracts: 6,
    completed_contracts: 34,
    contact_email: 'contracts@nicbl-infra.gov.in',
    phone: '+91 98101 23456'
  },
  {
    id: 'cont_2',
    company_name: 'Shree Ram Roads & Highway Developers',
    registration_no: 'GSTIN: 09AAECS8765Q1Z2',
    category: 'ROAD_CONSTRUCTION',
    rating: 4.6,
    active_contracts: 4,
    completed_contracts: 28,
    contact_email: 'shreeram.infra@pwdroads.in',
    phone: '+91 94150 98765'
  },
  {
    id: 'cont_3',
    company_name: 'Surya CleanTech & Solar EPC Solutions',
    registration_no: 'GSTIN: 27AABCN4321D1Z8',
    category: 'ELECTRICAL_SOLAR',
    rating: 4.9,
    active_contracts: 5,
    completed_contracts: 19,
    contact_email: 'projects@suryacleantech.in',
    phone: '+91 98220 11223'
  },
  {
    id: 'cont_4',
    company_name: 'AarogyaMed Devices Pvt Ltd (Grantee)',
    registration_no: 'CIN: U72900KA2023PTC174821',
    category: 'TECH_STARTUP',
    rating: 4.7,
    active_contracts: 1,
    completed_contracts: 2,
    contact_email: 'founder@aarogyamed.ai',
    phone: '+91 99800 44332'
  },
  {
    id: 'cont_5',
    company_name: 'Shakti Hydro & Jal Nigam Works',
    registration_no: 'GSTIN: 24AACCS9012E1Z3',
    category: 'WATER_PIPELINES',
    rating: 4.5,
    active_contracts: 7,
    completed_contracts: 41,
    contact_email: 'tenders@shaktihydro.com',
    phone: '+91 98250 55667'
  },
  {
    id: 'cont_6',
    company_name: 'MediConstruct & Healthcare Infra Builders',
    registration_no: 'GSTIN: 29AABCM5678H1Z9',
    category: 'HEALTHCARE_INFRA',
    rating: 4.6,
    active_contracts: 3,
    completed_contracts: 15,
    contact_email: 'projects@mediconstruct.in',
    phone: '+91 98450 12789'
  }
];

const entities = [
  // EDU Entities
  {
    id: 'ent_1',
    dept_code: 'EDU',
    name: 'Sarvodaya Kanya Vidyalaya (SKV Dilshad Garden)',
    code_identifier: 'UDISE: 07040100201',
    state: 'Delhi (NCT)',
    district: 'Shahdara',
    pincode: '110095',
    head_name: 'Dr. Sunita Sharma (Principal)',
    contact: '+91 98112 34567',
    latitude: 28.6759,
    longitude: 77.3182,
    student_count: 1450,
    before_image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 4.7,
    udise_code: '07040100201',
    data_source: 'UDISE',
    source_verified_at: new Date().toISOString()
  },
  {
    id: 'ent_2',
    dept_code: 'EDU',
    name: 'Rajkiya Pratibha Vikas Vidyalaya (RPVV Sector 11 Rohini)',
    code_identifier: 'UDISE: 07020101804',
    state: 'Delhi (NCT)',
    district: 'North West Delhi',
    pincode: '110085',
    head_name: 'Shri Rakesh Verma (Head of School)',
    contact: '+91 98711 88990',
    latitude: 28.7158,
    longitude: 77.1125,
    student_count: 980,
    before_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 4.9,
    udise_code: '07020101804',
    data_source: 'UDISE',
    source_verified_at: new Date().toISOString()
  },
  {
    id: 'ent_3',
    dept_code: 'EDU',
    name: 'Zilla Parishad Madhyamik Shala, Baramati',
    code_identifier: 'UDISE: 27250401103',
    state: 'Maharashtra',
    district: 'Pune',
    pincode: '413102',
    head_name: 'Smt. Anjali Patil (Headmistress)',
    contact: '+91 94220 77665',
    latitude: 18.1524,
    longitude: 74.5771,
    student_count: 820,
    before_image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 4.4,
    udise_code: '27250401103',
    data_source: 'UDISE',
    source_verified_at: new Date().toISOString()
  },
  // TRANS Entity
  {
    id: 'ent_4',
    dept_code: 'TRANS',
    name: 'PMGSY Rural Asphalt Road Stretch VR-42 (Varanasi - Chandauli Link)',
    code_identifier: 'ROAD: UP-VNS-R-42',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    pincode: '221001',
    head_name: 'Er. Sandeep Pandey (Executive Engineer, PWD)',
    contact: '+91 94500 12345',
    latitude: 25.3176,
    longitude: 82.9739,
    student_count: null,
    before_image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 4.8
  },
  // STARTUP Entity
  {
    id: 'ent_5',
    dept_code: 'STARTUP',
    name: 'AarogyaMed AI Diagnostics Lab (Bio-Incubator C-CAMP)',
    code_identifier: 'DPIIT: DPIIT-ST-8821',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    pincode: '560065',
    head_name: 'Dr. Vivek Swaminathan (Lead Scientist & Founder)',
    contact: '+91 98450 33221',
    latitude: 13.0768,
    longitude: 77.5812,
    student_count: null,
    before_image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 5.0
  },
  // WATER Entity
  {
    id: 'ent_6',
    dept_code: 'WATER',
    name: 'Jal Jeevan Mission Solar RO & Overhead Reservoir Tank',
    code_identifier: 'JJM: GJ-BK-JJM-104',
    state: 'Gujarat',
    district: 'Banaskantha',
    pincode: '385001',
    head_name: 'Shri Pravinbhai Patel (Sarpanch & Water Committee Head)',
    contact: '+91 98255 44112',
    latitude: 24.1724,
    longitude: 72.4346,
    student_count: null,
    before_image: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1574689231350-d446973e0a1f?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 4.6
  },
  // HEALTH Entity — with real before/after images (not "all inspections cleared")
  {
    id: 'ent_7',
    dept_code: 'HEALTH',
    name: 'Primary Health Centre (PHC) Morena - Ayushman Mandir Upgrade',
    code_identifier: 'NHM: MP-MOR-PHC-2204',
    state: 'Madhya Pradesh',
    district: 'Morena',
    pincode: '476001',
    head_name: 'Dr. Ritu Shrivastava (Medical Officer In-Charge)',
    contact: '+91 94250 78340',
    latitude: 26.4970,
    longitude: 77.9961,
    student_count: null,
    before_image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    after_image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    current_condition_rating: 4.3
  }
];

const projects = [
  {
    id: 'proj_1',
    entity_id: 'ent_1',
    dept_code: 'EDU',
    title: 'Model Sanitation Block, RO Drinking Water & STEM Robotics Lab',
    scheme_name: 'School Theek Karo / PM SHRI Revamp 2026',
    total_budget: 4500000,
    sanctioned_amount: 4500000,
    disbursed_amount: 3000000,
    status: 'UNDER_INSPECTION',
    completion_deadline: '2026-11-15',
    sanctioned_date: '2026-03-10',
    contractor_id: 'cont_1',
    officer_name: 'Shri Arvind Kaushik, IAS (Director of Education)',
    description: 'Complete overhaul of female student hygiene facilities (8 cubicles with automated incinerator), 2,000 LPH RO water plant, and 20-workstation STEM tinkering robotics lab.',
    escrow_account_no: 'RBI-PFMS-ESCROW-98821-EDU',
    progress_pct: 85
  },
  {
    id: 'proj_2',
    entity_id: 'ent_2',
    dept_code: 'EDU',
    title: 'High-Tech Digital Interactive Classrooms & Rooftop Solar 25kW',
    scheme_name: 'Delhi Model School Modernization Drive',
    total_budget: 3200000,
    sanctioned_amount: 3200000,
    disbursed_amount: 3200000,
    status: 'COMPLETED',
    completion_deadline: '2026-08-30',
    sanctioned_date: '2026-01-15',
    contractor_id: 'cont_3',
    officer_name: 'Dr. Meenakshi Sundaram, IAS (Special Secretary)',
    description: 'Installation of 85-inch 4K Interactive Flat Panels across 12 senior classrooms, acoustic panelling, and 25kW rooftop solar microgrid with net-metering.',
    escrow_account_no: 'RBI-PFMS-ESCROW-98822-EDU',
    progress_pct: 100
  },
  {
    id: 'proj_3',
    entity_id: 'ent_4',
    dept_code: 'TRANS',
    title: '4.8km Heavy Bituminous Pavement & Reinforced Concrete Culvert',
    scheme_name: 'Pradhan Mantri Gram Sadak Yojana (Phase IV)',
    total_budget: 8500000,
    sanctioned_amount: 8500000,
    disbursed_amount: 4500000,
    status: 'IN_PROGRESS',
    completion_deadline: '2026-12-20',
    sanctioned_date: '2026-04-01',
    contractor_id: 'cont_2',
    officer_name: 'Er. Rajeshwar Tiwari (Chief Engineer, Rural Roads)',
    description: 'Upgrading unmetalled village dirt track to heavy-load bituminous macadam road with roadside drainage and 2 box culverts to resist monsoon floods.',
    escrow_account_no: 'RBI-PFMS-ESCROW-44102-RRD',
    progress_pct: 55
  },
  {
    id: 'proj_4',
    entity_id: 'ent_5',
    dept_code: 'STARTUP',
    title: 'Portable AI Edge Diagnostic Device - Cleanroom Prototype Tranche',
    scheme_name: 'Startup India Seed Fund Scheme (DPIIT)',
    total_budget: 2500000,
    sanctioned_amount: 2500000,
    disbursed_amount: 1500000,
    status: 'UNDER_INSPECTION',
    completion_deadline: '2026-10-31',
    sanctioned_date: '2026-02-20',
    contractor_id: 'cont_4',
    officer_name: 'Smt. Radhika Nambiar (DPIIT Seed Fund Committee Member)',
    description: 'Hardware seed grant tranche 2: Verification of functional working PCB, spectral optical sensor calibration, and cleanroom lab assembly testing.',
    escrow_account_no: 'RBI-PFMS-ESCROW-77319-STP',
    progress_pct: 75
  },
  {
    id: 'proj_5',
    entity_id: 'ent_6',
    dept_code: 'WATER',
    title: '80,000L Overhead Water Reservoir & Household Chlorination Network',
    scheme_name: 'Jal Jeevan Mission - Har Ghar Jal',
    total_budget: 5200000,
    sanctioned_amount: 5200000,
    disbursed_amount: 2000000,
    status: 'IN_PROGRESS',
    completion_deadline: '2027-01-31',
    sanctioned_date: '2026-05-15',
    contractor_id: 'cont_5',
    officer_name: 'Shri Bhupendra Vaghela, IAS (Mission Director JJM)',
    description: 'Construction of reinforced cement concrete elevated storage reservoir (ESR) with automatic electromagnetic flowmeters and 320 tap meters.',
    escrow_account_no: 'RBI-PFMS-ESCROW-22901-JJM',
    progress_pct: 40
  },
  {
    id: 'proj_6',
    entity_id: 'ent_3',
    dept_code: 'EDU',
    title: 'Earthquake Retrofitting, Waterproofing & Solar Power Plant',
    scheme_name: 'Maharashtra ZP School Transformation Drive',
    total_budget: 2800000,
    sanctioned_amount: 2800000,
    disbursed_amount: 0,
    status: 'SANCTIONED',
    completion_deadline: '2027-02-28',
    sanctioned_date: '2026-09-01',
    contractor_id: 'cont_1',
    officer_name: 'Shri Nitin Gadre, IAS (Divisional Commissioner Pune)',
    description: 'Structural jacketing of classroom load-bearing pillars, complete roof elastomeric waterproofing to prevent monsoon leakage, and 10kW solar system.',
    escrow_account_no: 'RBI-PFMS-ESCROW-33981-EDU',
    progress_pct: 10
  },
  {
    id: 'proj_7',
    entity_id: 'ent_7',
    dept_code: 'HEALTH',
    title: 'PHC Morena - Labour Room Upgrade, Digital X-Ray & Oxygen Plant',
    scheme_name: 'Ayushman Bharat - Health & Wellness Centres (AB-HWC)',
    total_budget: 3800000,
    sanctioned_amount: 3800000,
    disbursed_amount: 1900000,
    status: 'IN_PROGRESS',
    completion_deadline: '2026-12-31',
    sanctioned_date: '2026-04-15',
    contractor_id: 'cont_6',
    officer_name: 'Dr. Pradeep Mishra, IAS (Commissioner, Health Services MP)',
    description: 'Renovation of maternity labour room with 4 delivery tables, installation of digital X-ray machine (100mA), PSA oxygen concentrator plant (5 LPM), and clean drinking water RO unit.',
    escrow_account_no: 'RBI-PFMS-ESCROW-55782-NHM',
    progress_pct: 50
  }
];

const milestones = [
  // Project 1 (SKV Dilshad Garden - Sanitation & STEM)
  {
    id: 'mile_1_1',
    project_id: 'proj_1',
    milestone_title: 'Phase 1: Civil Foundation & Underground Plumbing Network',
    sequence: 1,
    allocated_amount: 1500000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Completed structural excavation, PCC bedding, underground drainage pipes, and sewer septic connection with anti-leakage test.',
    contractor_invoice_url: 'INV-2026-042.pdf',
    contractor_submitted_at: '2026-04-18T10:30:00Z',
    verified_at: '2026-04-22T14:15:00Z',
    disbursed_at: '2026-04-24T16:00:00Z'
  },
  {
    id: 'mile_1_2',
    project_id: 'proj_1',
    milestone_title: 'Phase 2: Sanitary Ware, Tiling & 2000 LPH RO Filtration Unit',
    sequence: 2,
    allocated_amount: 1500000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Vitrified anti-skid floor tiles installed, Hindware ceramic sanitary fixtures, automated sensor taps, and commercial grade RO plant mounted.',
    contractor_invoice_url: 'INV-2026-098.pdf',
    contractor_submitted_at: '2026-07-10T11:00:00Z',
    verified_at: '2026-07-14T15:20:00Z',
    disbursed_at: '2026-07-16T11:45:00Z'
  },
  {
    id: 'mile_1_3',
    project_id: 'proj_1',
    milestone_title: 'Phase 3: STEM Robotics Lab Furniture, 20 Laptops & 3D Printer',
    sequence: 3,
    allocated_amount: 1500000,
    status: 'INSPECTED_PASSED',
    contractor_submission_notes: 'Delivered and configured 20 Dell Core-i7 learning workstations, 2 BambuLab 3D printers, IoT sensor starter kits, and fire safety systems.',
    contractor_invoice_url: 'INV-2026-174.pdf',
    contractor_submitted_at: '2026-09-12T09:00:00Z',
    verified_at: '2026-09-18T16:30:00Z',
    disbursed_at: null
  },
  // Project 2 (RPVV Rohini) - Fully completed
  {
    id: 'mile_2_1',
    project_id: 'proj_2',
    milestone_title: 'Phase 1: 25kW Rooftop Solar Panels & Inverter Installation',
    sequence: 1,
    allocated_amount: 1600000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Bi-facial monocrystalline solar panels erected on galvanized iron superstructure. Inverter connected to school main LT panel.',
    contractor_invoice_url: 'INV-SOLAR-01.pdf',
    contractor_submitted_at: '2026-03-20T12:00:00Z',
    verified_at: '2026-03-25T14:00:00Z',
    disbursed_at: '2026-03-27T10:00:00Z'
  },
  {
    id: 'mile_2_2',
    project_id: 'proj_2',
    milestone_title: 'Phase 2: 12 Interactive 4K Flat Panels & Classroom Audio Systems',
    sequence: 2,
    allocated_amount: 1600000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Mounted interactive touch panels in 12 senior wings with stylus pens, high-speed Wi-Fi 6 access points, and acoustic treatment.',
    contractor_invoice_url: 'INV-DIGI-02.pdf',
    contractor_submitted_at: '2026-07-28T14:30:00Z',
    verified_at: '2026-08-05T11:15:00Z',
    disbursed_at: '2026-08-08T15:30:00Z'
  },
  // Project 3 (PMGSY Road)
  {
    id: 'mile_3_1',
    project_id: 'proj_3',
    milestone_title: 'Phase 1: Earthwork, Sub-Base & 2 Reinforced Box Culverts',
    sequence: 1,
    allocated_amount: 4500000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Completed road subgrade compaction (100% Proctor density achieved), 150mm granular sub-base, and constructed 2 RCC culverts.',
    contractor_invoice_url: 'INV-PMGSY-01.pdf',
    contractor_submitted_at: '2026-06-15T11:00:00Z',
    verified_at: '2026-06-22T13:45:00Z',
    disbursed_at: '2026-06-25T16:10:00Z'
  },
  {
    id: 'mile_3_2',
    project_id: 'proj_3',
    milestone_title: 'Phase 2: Bituminous Macadam (50mm) & Asphalt Wearing Course (25mm)',
    sequence: 2,
    allocated_amount: 4000000,
    status: 'SUBMITTED',
    contractor_submission_notes: 'Completed 4.8 km paving using hot mix asphalt plant. Temperature maintained at 145 deg C during rolling. Core cutter test reports attached.',
    contractor_invoice_url: 'INV-PMGSY-02.pdf',
    contractor_submitted_at: '2026-09-19T10:15:00Z',
    verified_at: null,
    disbursed_at: null
  },
  // Project 4 (AarogyaMed AI Diagnostics Startup)
  {
    id: 'mile_4_1',
    project_id: 'proj_4',
    milestone_title: 'Tranche 1: Sensor Hardware Architecture & PCB Fabrication',
    sequence: 1,
    allocated_amount: 1500000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Multi-layer PCB designed, fabricated, and tested in bio-incubator cleanroom with 98.4% optical SNR accuracy.',
    contractor_invoice_url: 'INV-SEED-TR-1.pdf',
    contractor_submitted_at: '2026-05-10T15:00:00Z',
    verified_at: '2026-05-16T12:00:00Z',
    disbursed_at: '2026-05-19T11:30:00Z'
  },
  {
    id: 'mile_4_2',
    project_id: 'proj_4',
    milestone_title: 'Tranche 2: 5 Functional Prototypes & Clinical Sample Benchmark',
    sequence: 2,
    allocated_amount: 1000000,
    status: 'SUBMITTED',
    contractor_submission_notes: '5 enclosed handheld diagnostic units built and calibrated. Test trials conducted on 50 blinded clinical saliva samples at NIMHANS.',
    contractor_invoice_url: 'INV-SEED-TR-2.pdf',
    contractor_submitted_at: '2026-09-15T16:00:00Z',
    verified_at: null,
    disbursed_at: null
  },
  // Project 5 (JJM Water)
  {
    id: 'mile_5_1',
    project_id: 'proj_5',
    milestone_title: 'Phase 1: Foundation & Staging of 80,000L RCC Overhead Reservoir',
    sequence: 1,
    allocated_amount: 2000000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Structural foundation completed with M25 grade concrete. Staging columns erected and tested for load-bearing capacity.',
    contractor_invoice_url: 'INV-JJM-01.pdf',
    contractor_submitted_at: '2026-07-10T10:00:00Z',
    verified_at: '2026-07-18T14:00:00Z',
    disbursed_at: '2026-07-20T11:00:00Z'
  },
  {
    id: 'mile_5_2',
    project_id: 'proj_5',
    milestone_title: 'Phase 2: Pipeline Network, Chlorination Unit & Household Connections',
    sequence: 2,
    allocated_amount: 3200000,
    status: 'PENDING',
    contractor_submission_notes: null,
    contractor_invoice_url: null,
    contractor_submitted_at: null,
    verified_at: null,
    disbursed_at: null
  },
  // Project 7 (PHC Morena - Health)
  {
    id: 'mile_7_1',
    project_id: 'proj_7',
    milestone_title: 'Phase 1: Labour Room Civil Renovation & Medical Gas Pipeline',
    sequence: 1,
    allocated_amount: 1900000,
    status: 'DISBURSED',
    contractor_submission_notes: 'Labour room walls ceramic-tiled, false ceiling with anti-microbial PVC, medical oxygen pipeline laid with 4 terminal points verified.',
    contractor_invoice_url: 'INV-NHM-01.pdf',
    contractor_submitted_at: '2026-07-20T09:00:00Z',
    verified_at: '2026-07-28T15:00:00Z',
    disbursed_at: '2026-07-30T10:30:00Z'
  },
  {
    id: 'mile_7_2',
    project_id: 'proj_7',
    milestone_title: 'Phase 2: Digital X-Ray Machine Installation & PSA Oxygen Plant',
    sequence: 2,
    allocated_amount: 1900000,
    status: 'SUBMITTED',
    contractor_submission_notes: 'Fujifilm DR X-ray system installed and calibrated. PSA oxygen plant 5 LPM capacity operational. AERB clearance obtained.',
    contractor_invoice_url: 'INV-NHM-02.pdf',
    contractor_submitted_at: '2026-09-22T11:00:00Z',
    verified_at: null,
    disbursed_at: null
  }
];

const inspections = [
  {
    id: 'insp_1',
    milestone_id: 'mile_1_1',
    inspector_name: 'Er. Deepa Nair',
    inspector_id: 'PWD-QI-DL-088',
    latitude: 28.6758,
    longitude: 77.3184,
    geo_verified: true,
    distance_meters: 24,
    checklist: [
      { item: 'Structural excavation depth verified (>= 1.2m)', passed: true },
      { item: 'PVC pipe wall thickness as per IS 4985 standard', passed: true },
      { item: 'Leakage hydraulic pressure test conducted', passed: true },
      { item: 'No child safety hazards on active school ground', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Excavation and foundation work executed strictly as per CPWD specifications. Zero debris blocking student walkways.',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-04-22T14:15:00Z'
  },
  {
    id: 'insp_2',
    milestone_id: 'mile_1_2',
    inspector_name: 'Er. Deepa Nair',
    inspector_id: 'PWD-QI-DL-088',
    latitude: 28.6759,
    longitude: 77.3181,
    geo_verified: true,
    distance_meters: 12,
    checklist: [
      { item: 'Anti-skid floor tiles grade checked', passed: true },
      { item: 'Hindware fixtures pressure tested, no leaks', passed: true },
      { item: 'RO water TDS reduction measured: 480ppm to 65ppm', passed: true },
      { item: 'Automated sanitary napkin incinerator functional', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Outstanding sanitary transformation. Water test lab certificate cross-verified with Bureau of Indian Standards (BIS 10500:2012).',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-07-14T15:20:00Z'
  },
  {
    id: 'insp_3',
    milestone_id: 'mile_1_3',
    inspector_name: 'Dr. Alok Srivastava',
    inspector_id: 'GOV-TECH-AUDIT-412',
    latitude: 28.6760,
    longitude: 77.3183,
    geo_verified: true,
    distance_meters: 15,
    checklist: [
      { item: '20 Laptops serial numbers matched with GeM invoice', passed: true },
      { item: 'All 20 laptops running licensed OS and STEM toolchain', passed: true },
      { item: '3D printers test calibration print executed (bench test passed)', passed: true },
      { item: 'Earthing and surge suppression safety verified', passed: true },
      { item: 'SMC President & Principal sign-off received', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Verified all 20 laptops in active running state. Lab setup is world-class and ready for students. Recommended for immediate escrow disbursement.',
    photos: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-09-18T16:30:00Z'
  },
  {
    id: 'insp_4',
    milestone_id: 'mile_2_1',
    inspector_name: 'Er. Rajesh K',
    inspector_id: 'EE-ELEC-DL-041',
    latitude: 28.7157,
    longitude: 77.1128,
    geo_verified: true,
    distance_meters: 30,
    checklist: [
      { item: 'Solar panel efficiency tested: >20% under STC', passed: true },
      { item: 'Grid tie-in and net metering meter installed', passed: true },
      { item: 'Earthing resistance <1 Ohm as per IS 3043', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Solar installation meets all MNRE technical specifications. Net metering approved by BSES Yamuna.',
    photos: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-03-25T14:00:00Z'
  },
  {
    id: 'insp_5',
    milestone_id: 'mile_2_2',
    inspector_name: 'Er. Rajesh K',
    inspector_id: 'EE-ELEC-DL-041',
    latitude: 28.7160,
    longitude: 77.1123,
    geo_verified: true,
    distance_meters: 18,
    checklist: [
      { item: 'All 12 interactive panels touch-tested and functional', passed: true },
      { item: 'Wi-Fi 6 coverage measured across all classrooms', passed: true },
      { item: 'Acoustic panels installed per design drawing', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Digital classroom infrastructure verified complete. All 12 panels operational with school management software.',
    photos: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1550305080-4e029753abcf?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-08-05T11:15:00Z'
  },
  {
    id: 'insp_6',
    milestone_id: 'mile_4_1',
    inspector_name: 'Dr. C. Ramanathan',
    inspector_id: 'CCAMP-TECH-EXP-07',
    latitude: 13.0770,
    longitude: 77.5815,
    geo_verified: true,
    distance_meters: 22,
    checklist: [
      { item: 'PCB fabrication quality verified under microscope', passed: true },
      { item: 'Optical SNR tested: 98.4% accuracy confirmed', passed: true },
      { item: 'Cleanroom ISO Class 7 conditions maintained', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'PCB design is innovative and meets all DPIIT technical benchmarks. Prototype ready for clinical testing phase.',
    photos: [
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-05-16T12:00:00Z'
  },
  {
    id: 'insp_7',
    milestone_id: 'mile_5_1',
    inspector_name: 'Er. Kishan Patel',
    inspector_id: 'JJM-QI-GJ-033',
    latitude: 24.1726,
    longitude: 72.4348,
    geo_verified: true,
    distance_meters: 20,
    checklist: [
      { item: 'M25 concrete grade verified by cube test (28-day)', passed: true },
      { item: 'RCC staging columns plumb and vertical', passed: true },
      { item: 'Anchor bolt torque tested as per structural design', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Foundation and staging structure meets IS 456:2000 standards. Ready for tank erection phase.',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-07-18T14:00:00Z'
  },
  {
    id: 'insp_8',
    milestone_id: 'mile_7_1',
    inspector_name: 'Dr. Sneha Tiwari',
    inspector_id: 'NHM-QI-MP-019',
    latitude: 26.4972,
    longitude: 77.9963,
    geo_verified: true,
    distance_meters: 35,
    checklist: [
      { item: 'Labour room tiles anti-microbial and seamless joints', passed: true },
      { item: 'Oxygen pipeline pressure tested at 100 PSI', passed: true },
      { item: 'Delivery tables hydraulic mechanism functional', passed: true },
      { item: 'Infection control protocol: ventilation cross-check done', passed: true }
    ],
    verdict: 'APPROVED',
    notes: 'Labour room renovation meets NABH standards. Medical gas pipeline certified by PESO. Excellent quality work.',
    photos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
    ],
    inspected_at: '2026-07-28T15:00:00Z'
  }
];

const grievances = [
  {
    id: 'griev_1',
    entity_id: 'ent_1',
    project_id: 'proj_1',
    citizen_name: 'Manoj Kumar (Parent & SMC Member)',
    mobile: '+91 98991 77654',
    reporter_role: 'Parent',
    category: 'Water Pressure',
    description: 'During morning break around 10:30 AM, water pressure in 2nd floor washroom taps was low. Please ask contractor to check booster pump timer.',
    photo_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    before_photo_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    after_photo_url: null,
    status: 'RESOLVED',
    action_taken: 'Contractor recalibrated automated pressure sensor and cleaned inlet strainer on 2026-09-14. Water pressure restored to 2.8 bar.',
    created_at: '2026-09-13T11:20:00Z',
    resolved_at: '2026-09-14T17:00:00Z'
  },
  {
    id: 'griev_2',
    entity_id: 'ent_4',
    project_id: 'proj_3',
    citizen_name: 'Suraj Bhan Yadav (Local Resident & Farmer)',
    mobile: '+91 94511 88320',
    reporter_role: 'Local Citizen',
    category: 'Road Quality Scrutiny',
    description: 'Heavy dumper trucks passing near village culvert during rain. Small hairline edge cracking seen at km stone 2.4 before final asphalt coat.',
    photo_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
    before_photo_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
    after_photo_url: null,
    status: 'INVESTIGATION_ORDERED',
    action_taken: 'PWD Executive Engineer issued site inspection notice to contractor. Bituminous shoulder compaction being reinforced.',
    created_at: '2026-09-20T08:45:00Z',
    resolved_at: null
  }
];

const ledger = [
  {
    id: 'tx_pfms_001',
    utr_no: 'PFMS2026042400981123',
    project_id: 'proj_1',
    milestone_id: 'mile_1_1',
    amount: 1500000,
    from_account: 'RBI Consolidated Fund / MoE Escrow-98821',
    to_beneficiary: 'National Infra & Civic Builders Ltd (NICBL)',
    bank_account_masked: 'SBI A/C ***9012',
    approved_by: 'Shri Arvind Kaushik, IAS (Director)',
    verified_by_inspector: 'Er. Deepa Nair (PWD-QI-DL-088)',
    timestamp: '2026-04-24T16:00:00Z',
    cryptographic_hash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    project_title: 'Model Sanitation Block, RO Drinking Water & STEM Robotics Lab'
  },
  {
    id: 'tx_pfms_002',
    utr_no: 'PFMS2026071600874419',
    project_id: 'proj_1',
    milestone_id: 'mile_1_2',
    amount: 1500000,
    from_account: 'RBI Consolidated Fund / MoE Escrow-98821',
    to_beneficiary: 'National Infra & Civic Builders Ltd (NICBL)',
    bank_account_masked: 'SBI A/C ***9012',
    approved_by: 'Shri Arvind Kaushik, IAS (Director)',
    verified_by_inspector: 'Er. Deepa Nair (PWD-QI-DL-088)',
    timestamp: '2026-07-16T11:45:00Z',
    cryptographic_hash: 'SHA256: 9b2d88c2f1e63a137e5e3408a0d421d01fcf2634d284a1e944b0451cfbc988a1',
    project_title: 'Model Sanitation Block, RO Drinking Water & STEM Robotics Lab'
  },
  {
    id: 'tx_pfms_003',
    utr_no: 'PFMS2026032700341188',
    project_id: 'proj_2',
    milestone_id: 'mile_2_1',
    amount: 1600000,
    from_account: 'Delhi State Consolidated Fund / Solar Grant',
    to_beneficiary: 'Surya CleanTech & Solar EPC Solutions',
    bank_account_masked: 'HDFC A/C ***4431',
    approved_by: 'Dr. Meenakshi Sundaram, IAS',
    verified_by_inspector: 'Er. Rajesh K (EE-ELEC-DL-041)',
    timestamp: '2026-03-27T10:00:00Z',
    cryptographic_hash: 'SHA256: 3c62184518749a909477e7d6ab0251787c95e1e12760773d2745347209995166',
    project_title: 'High-Tech Digital Interactive Classrooms & Rooftop Solar 25kW'
  },
  {
    id: 'tx_pfms_004',
    utr_no: 'PFMS2026080800561234',
    project_id: 'proj_2',
    milestone_id: 'mile_2_2',
    amount: 1600000,
    from_account: 'Delhi State Consolidated Fund / Digital Edu',
    to_beneficiary: 'Surya CleanTech & Solar EPC Solutions',
    bank_account_masked: 'HDFC A/C ***4431',
    approved_by: 'Dr. Meenakshi Sundaram, IAS',
    verified_by_inspector: 'Er. Rajesh K (EE-ELEC-DL-041)',
    timestamp: '2026-08-08T15:30:00Z',
    cryptographic_hash: 'SHA256: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    project_title: 'High-Tech Digital Interactive Classrooms & Rooftop Solar 25kW'
  },
  {
    id: 'tx_pfms_005',
    utr_no: 'PFMS2026062500781290',
    project_id: 'proj_3',
    milestone_id: 'mile_3_1',
    amount: 4500000,
    from_account: 'National Rural Roads Development Agency (NRRDA)',
    to_beneficiary: 'Shree Ram Roads & Highway Developers',
    bank_account_masked: 'PNB A/C ***7821',
    approved_by: 'Er. Rajeshwar Tiwari (Chief Engineer)',
    verified_by_inspector: 'Er. Vikas Pandey (PWD-JE-VNS)',
    timestamp: '2026-06-25T16:10:00Z',
    cryptographic_hash: 'SHA256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    project_title: '4.8km Heavy Bituminous Pavement & Reinforced Concrete Culvert'
  },
  {
    id: 'tx_pfms_006',
    utr_no: 'PFMS2026051900118872',
    project_id: 'proj_4',
    milestone_id: 'mile_4_1',
    amount: 1500000,
    from_account: 'DPIIT Startup India Seed Fund Master Escrow',
    to_beneficiary: 'AarogyaMed Devices Pvt Ltd',
    bank_account_masked: 'ICICI A/C ***5519',
    approved_by: 'Smt. Radhika Nambiar',
    verified_by_inspector: 'Dr. C. Ramanathan (C-CAMP Technical Expert)',
    timestamp: '2026-05-19T11:30:00Z',
    cryptographic_hash: 'SHA256: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    project_title: 'Portable AI Edge Diagnostic Device - Cleanroom Prototype Tranche'
  },
  {
    id: 'tx_pfms_007',
    utr_no: 'PFMS2026072000219988',
    project_id: 'proj_5',
    milestone_id: 'mile_5_1',
    amount: 2000000,
    from_account: 'Jal Jeevan Mission State Implementation Agency Gujarat',
    to_beneficiary: 'Shakti Hydro & Jal Nigam Works',
    bank_account_masked: 'BOB A/C ***3312',
    approved_by: 'Shri Bhupendra Vaghela, IAS',
    verified_by_inspector: 'Er. Kishan Patel (JJM-QI-GJ-033)',
    timestamp: '2026-07-20T11:00:00Z',
    cryptographic_hash: 'SHA256: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    project_title: '80,000L Overhead Water Reservoir & Household Chlorination Network'
  },
  {
    id: 'tx_pfms_008',
    utr_no: 'PFMS2026073000449821',
    project_id: 'proj_7',
    milestone_id: 'mile_7_1',
    amount: 1900000,
    from_account: 'National Health Mission State Society MP',
    to_beneficiary: 'MediConstruct & Healthcare Infra Builders',
    bank_account_masked: 'SBI A/C ***6678',
    approved_by: 'Dr. Pradeep Mishra, IAS (Commissioner Health)',
    verified_by_inspector: 'Dr. Sneha Tiwari (NHM-QI-MP-019)',
    timestamp: '2026-07-30T10:30:00Z',
    cryptographic_hash: 'SHA256: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    project_title: 'PHC Morena - Labour Room Upgrade, Digital X-Ray & Oxygen Plant'
  }
];

async function runSeed() {
  console.log('🌱 Seeding Fund to Field database (all departments)...');

  await db.resetStore({
    departments,
    contractors,
    entities,
    projects,
    milestones,
    inspections,
    grievances,
    ledger
  });

  console.log('✅ Seed successful.');
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Contractors: ${contractors.length}`);
  console.log(`   - Entities: ${entities.length}`);
  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Milestones: ${milestones.length}`);
  console.log(`   - Inspections: ${inspections.length}`);
  console.log(`   - Grievances: ${grievances.length}`);
  console.log(`   - Ledger entries: ${ledger.length}`);
}

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = runSeed;
