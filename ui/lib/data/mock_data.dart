// Mock data for EcoSetu Flutter app
import 'package:flutter/material.dart';
import 'models.dart';
export 'models.dart';
// ── Singleton mock data ──────────────────────────────────────────

var mockCollector = const Collector(
  id: 'a1000000-0000-0000-0000-000000000001',
  name: 'Ravi Kumar',
  initials: 'RK',
  location: 'Andheri East, Mumbai',
  operatingArea: 'Andheri, Jogeshwari',
  language: 'English',
  totalLots: 24,
  totalEarnings: 24850,
  completedTransactions: 18,
  cumulativeSavings: 3200,
  phone: '+91 98765 43210',
);

final mockBatches = [
  Batch(
    batchId: 'BATCH-001',
    collectorId: 'ES-1024',
    createdAt: '31/08/2026',
    status: 'active',
    syncStatus: 'synced',
    lots: [
      Lot(lotId: 'LOT-8X91-A2', batchId: 'BATCH-001', material: 'LCD Panel', declaredWeight: 12, condition: 'Working/Broken', indicativeValue: 960, imageUrl: 'assets/images/materials/lcd_panel.png'),
      Lot(lotId: 'LOT-9Y23-B4', batchId: 'BATCH-001', material: 'Cable', declaredWeight: 8, condition: 'Stripped', indicativeValue: 3280, imageUrl: 'assets/images/materials/cable.png'),
    ],
  ),
  Batch(
    batchId: 'BATCH-002',
    collectorId: 'ES-1024',
    createdAt: '26/08/2026',
    status: 'active',
    syncStatus: 'synced',
    lots: [
      Lot(lotId: 'LOT-3K77-C1', batchId: 'BATCH-002', material: 'Battery', declaredWeight: 5, condition: 'Mixed', indicativeValue: 525, imageUrl: 'assets/images/materials/battery.png', recyclerName: 'Green Recycle Hub', handoverStatus: 'pickup_pending'),
    ],
  ),
  Batch(
    batchId: 'BATCH-003',
    collectorId: 'ES-1024',
    createdAt: '20/08/2026',
    status: 'sold',
    syncStatus: 'synced',
    lots: [
      Lot(lotId: 'LOT-5F44-D9', batchId: 'BATCH-003', material: 'PCB', declaredWeight: 3, condition: 'Mixed', indicativeValue: 720, verifiedWeight: 3, finalPrice: 720, imageUrl: 'assets/images/materials/pcb.png', recyclerName: 'Sigma Enterprises', handoverStatus: 'handed_over'),
      Lot(lotId: 'LOT-2J88-E5', batchId: 'BATCH-003', material: 'Mixed Plastics', declaredWeight: 15, condition: 'Mixed', indicativeValue: 375, verifiedWeight: 14, finalPrice: 350, imageUrl: 'assets/images/materials/mixed_plastics.png', recyclerName: 'Sigma Enterprises', handoverStatus: 'handed_over'),
    ],
  ),
  Batch(
    batchId: 'BATCH-004',
    collectorId: 'ES-1024',
    createdAt: '15/08/2026',
    status: 'disputed',
    syncStatus: 'synced',
    lots: [
      Lot(lotId: 'LOT-7M12-F3', batchId: 'BATCH-004', material: 'Cable', declaredWeight: 4, condition: 'Stripped', indicativeValue: 1640, verifiedWeight: null, finalPrice: null, imageUrl: 'assets/images/materials/cable.png', recyclerName: 'Navi E-Waste Solutions', handoverStatus: 'declined'),
    ],
  ),
];

// Helper to easily access all lots across all batches
List<Lot> get mockLots {
  return mockBatches.expand((batch) => batch.lots).toList();
}

final mockPrices = [
  PriceItem(category: 'PCB',           description: 'Electronic circuit board',  pricePerKg: 280, trend: 'up',     trendPercent: 5, imageUrl: 'assets/images/materials/pcb.png'),
  PriceItem(category: 'Cable',         description: 'Aluminum or Copper wires',   pricePerKg: 340, priceRange: '300-450', trend: 'stable', trendPercent: 0, imageUrl: 'assets/images/materials/cable.png'),
  PriceItem(category: 'Magnet-Bearing Assembly', description: 'Neodymium & magnet parts', pricePerKg: 345, trend: 'up', trendPercent: 6, imageUrl: 'assets/images/materials/magnet_bearing.png'),
  PriceItem(category: 'Battery',       description: 'Lithium or Lead-Acid',  pricePerKg: 120, priceRange: '80-150', trend: 'down', trendPercent: 2, imageUrl: 'assets/images/materials/battery.png'),
  PriceItem(category: 'LCD Panel',     description: 'TV or monitor screen',      pricePerKg: 80,  trend: 'up',     trendPercent: 3, imageUrl: 'assets/images/materials/lcd_panel.png'),
  PriceItem(category: 'Motor',         description: 'Electric motors & parts',   pricePerKg: 205, trend: 'up',     trendPercent: 1, imageUrl: 'assets/images/materials/motor.png'),
  PriceItem(category: 'Mixed Plastics',description: 'Plastic casings & covers',  pricePerKg: 14,  trend: 'stable', trendPercent: 0, imageUrl: 'assets/images/materials/mixed_plastics.png'),
  PriceItem(category: 'CRT Glass',     description: 'Cathode ray tube glass',    pricePerKg: 18,  trend: 'down',   trendPercent: 4, imageUrl: 'assets/images/materials/crt_glass.png'),
];

final mockRecyclers = [
  Recycler(
    id: 'REC-001', name: 'Green Recycle Hub', verified: true,
    distance: '8.1 km', location: 'Navi Mumbai',
    materials: ['PCB', 'Cable', 'Battery', 'LCD Panel', 'Motor', 'Mixed Plastics', 'CRT Glass', 'Magnet-Bearing Assembly'],
    customPrices: {'Magnet-Bearing Assembly': 350, 'Motor': 210, 'Cable': 350, 'PCB': 290, 'Battery': 130, 'LCD Panel': 85, 'Mixed Plastics': 16, 'CRT Glass': 20},
    currentOffer: 350, pickupAvailable: true,
    phone: '+91 22 1234 5678', authorization: 'CPCB/2024/REC-445',
    rating: '4.2',
  ),
  Recycler(
    id: 'REC-002', name: 'Sigma Enterprises', verified: true,
    distance: '12.3 km', location: 'Panvel',
    materials: ['Battery', 'Mixed Plastics', 'CRT Glass', 'LCD Panel', 'PCB', 'Cable'],
    customPrices: {'Battery': 120, 'Mixed Plastics': 14, 'CRT Glass': 18, 'LCD Panel': 80, 'PCB': 275, 'Cable': 335},
    currentOffer: 120, pickupAvailable: true,
    phone: '+91 22 9876 5432', authorization: 'MPCB/2024/REC-112',
    rating: '4.8',
  ),
  Recycler(
    id: 'REC-003', name: 'Navi E-Waste Solutions', verified: true,
    distance: '3.2 km', location: 'Vashi, Navi Mumbai',
    materials: ['LCD Panel', 'CRT Glass', 'Battery', 'Motor', 'Mixed Plastics'],
    customPrices: {'LCD Panel': 75, 'CRT Glass': 17, 'Battery': 115, 'Motor': 195, 'Mixed Plastics': 13},
    currentOffer: 120, pickupAvailable: false,
    phone: '+91 22 5555 1234', authorization: 'CPCB/2023/REC-298',
    rating: '3.9',
  ),
  Recycler(
    id: 'REC-004', name: 'Omni Earth Recyclers', verified: true,
    distance: '5.8 km', location: 'Thane',
    materials: ['Cable', 'Motor', 'PCB', 'Mixed Plastics', 'Magnet-Bearing Assembly'],
    customPrices: {'Cable': 340, 'Motor': 200, 'PCB': 280, 'Mixed Plastics': 15, 'Magnet-Bearing Assembly': 340},
    currentOffer: 340, pickupAvailable: true,
    phone: '+91 22 4444 5678', authorization: 'CPCB/2024/REC-501',
    rating: '4.5',
  ),
];

final mockPayments = [
  Payment(id: 'TXN-001', amount: 720,   recycler: 'Sigma Enterprises',       date: '20/08/2026', weight: 3,  unit: 'kg', material: 'PCB',            status: 'received', referenceId: 'GRH-20260820-001', lotId: 'LOT-5F44-D9'),
  Payment(id: 'TXN-002', amount: 350,   recycler: 'Sigma Enterprises',       date: '20/08/2026', weight: 14, unit: 'kg', material: 'Mixed Plastics', status: 'received', referenceId: 'GRH-20260820-002', lotId: 'LOT-2J88-E5'),
  Payment(id: 'TXN-004', amount: 1640,  recycler: 'Navi E-Waste Solutions',  date: '15/08/2026', weight: 4,  unit: 'kg', material: 'Cable',          status: 'received', referenceId: 'NE-20260815-004', hasDispute: true, lotId: 'LOT-7M12-F3'),
];
