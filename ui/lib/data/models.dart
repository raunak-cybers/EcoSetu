// Mock data for EcoSetu Flutter app
import 'package:flutter/material.dart';


class Collector {
  final String id;
  final String name;
  final String initials;
  final String location;
  final String operatingArea;
  final String language;
  final int totalLots;
  final int totalEarnings;
  final int completedTransactions;
  final int cumulativeSavings;
  final String phone;

  const Collector({
    required this.id,
    required this.name,
    required this.initials,
    required this.location,
    required this.operatingArea,
    required this.language,
    required this.totalLots,
    required this.totalEarnings,
    required this.completedTransactions,
    required this.cumulativeSavings,
    required this.phone,
  });

  Collector copyWith({
    String? id,
    String? name,
    String? initials,
    String? location,
    String? operatingArea,
    String? language,
    int? totalLots,
    int? totalEarnings,
    int? completedTransactions,
    int? cumulativeSavings,
    String? phone,
  }) {
    return Collector(
      id: id ?? this.id,
      name: name ?? this.name,
      initials: initials ?? this.initials,
      location: location ?? this.location,
      operatingArea: operatingArea ?? this.operatingArea,
      language: language ?? this.language,
      totalLots: totalLots ?? this.totalLots,
      totalEarnings: totalEarnings ?? this.totalEarnings,
      completedTransactions: completedTransactions ?? this.completedTransactions,
      cumulativeSavings: cumulativeSavings ?? this.cumulativeSavings,
      phone: phone ?? this.phone,
    );
  }

  factory Collector.fromJson(Map<String, dynamic> json) {
    return Collector(
      id: json['id'] as String,
      name: json['name'] as String,
      initials: json['initials'] as String,
      location: json['location'] as String,
      operatingArea: json['operatingArea'] as String,
      language: json['language'] as String,
      totalLots: json['totalLots'] as int,
      totalEarnings: json['totalEarnings'] as int,
      completedTransactions: json['completedTransactions'] as int,
      cumulativeSavings: json['cumulativeSavings'] as int,
      phone: json['phone'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'initials': initials,
      'location': location,
      'operatingArea': operatingArea,
      'language': language,
      'totalLots': totalLots,
      'totalEarnings': totalEarnings,
      'completedTransactions': completedTransactions,
      'cumulativeSavings': cumulativeSavings,
      'phone': phone,
    };
  }
}

class Lot {
  final String lotId;
  final String batchId;
  String material;
  final int declaredWeight;
  final String condition;
  final int indicativeValue;
  final String? collectorDeclaration;
  
  // Recycler verification
  final String? verifiedMaterial;
  double? verifiedWeight;
  double? finalPrice;
  String? handoverStatus;
  final String? paymentStatus;
  final String imageUrl;
  String? recyclerName;

  Lot({
    required this.lotId,
    required this.batchId,
    required this.material,
    required this.declaredWeight,
    required this.condition,
    required this.indicativeValue,
    this.collectorDeclaration,
    this.verifiedMaterial,
    this.verifiedWeight,
    this.finalPrice,
    this.handoverStatus,
    this.paymentStatus,
    required this.imageUrl,
    this.recyclerName,
  });

  factory Lot.fromJson(Map<String, dynamic> json) {
    return Lot(
      lotId: json['lotId'] as String,
      batchId: json['batchId'] as String,
      material: json['material'] as String,
      declaredWeight: (json['declaredWeight'] as num).toInt(),
      condition: json['condition'] as String,
      indicativeValue: (json['indicativeValue'] as num).toInt(),
      collectorDeclaration: json['collectorDeclaration'] as String?,
      verifiedMaterial: json['verifiedMaterial'] as String?,
      verifiedWeight: (json['verifiedWeight'] as num?)?.toDouble(),
      finalPrice: (json['finalPrice'] as num?)?.toDouble(),
      handoverStatus: json['handoverStatus'] as String?,
      paymentStatus: json['paymentStatus'] as String?,
      imageUrl: json['imageUrl'] as String,
      recyclerName: json['recyclerName'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lotId': lotId,
      'batchId': batchId,
      'material': material,
      'declaredWeight': declaredWeight,
      'condition': condition,
      'indicativeValue': indicativeValue,
      'collectorDeclaration': collectorDeclaration,
      'verifiedMaterial': verifiedMaterial,
      'verifiedWeight': verifiedWeight,
      'finalPrice': finalPrice,
      'handoverStatus': handoverStatus,
      'paymentStatus': paymentStatus,
      'imageUrl': imageUrl,
      'recyclerName': recyclerName,
    };
  }
}

class Batch {
  final String batchId;
  final String collectorId;
  final String createdAt;
  String updatedAt; // Added to track lot modifications
  final List<Lot> lots;
  String status; // 'active', 'sold', 'pending'
  final String syncStatus; // 'synced', 'pending'

  int get totalWeight => lots.fold(0, (sum, lot) => sum + lot.declaredWeight);
  int get estimatedTotalValue => lots.fold(0, (sum, lot) => sum + lot.indicativeValue);

  Batch({
    required this.batchId,
    required this.collectorId,
    required this.createdAt,
    String? updatedAt,
    required this.lots,
    required this.status,
    this.syncStatus = 'synced',
  }) : updatedAt = updatedAt ?? createdAt;

  factory Batch.fromJson(Map<String, dynamic> json) {
    return Batch(
      batchId: json['batchId'] as String,
      collectorId: json['collectorId'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String?, // Fallback to createdAt via constructor
      status: json['status'] as String,
      syncStatus: json['syncStatus'] as String? ?? 'synced',
      lots: (json['lots'] as List<dynamic>).map((e) => Lot.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'batchId': batchId,
      'collectorId': collectorId,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'status': status,
      'syncStatus': syncStatus,
      'lots': lots.map((e) => e.toJson()).toList(),
    };
  }
}

class PriceItem {
  final String category;
  final String description;
  final int pricePerKg;
  final String? priceRange;
  final String trend; // 'up', 'down', 'stable'
  final int trendPercent;
  final String imageUrl;

  const PriceItem({
    required this.category,
    required this.description,
    required this.pricePerKg,
    this.priceRange,
    required this.trend,
    required this.trendPercent,
    required this.imageUrl,
  });

  String get displayPrice => priceRange ?? pricePerKg.toString();
}

class Recycler {
  final String id;
  final String name;
  final bool verified;
  final String distance;
  final String location;
  final List<String> materials;
  final int currentOffer;
  final bool pickupAvailable;
  final String phone;
  final String authorization;
  final String rating;
  final Map<String, int>? customPrices;

  const Recycler({
    required this.id,
    required this.name,
    required this.verified,
    required this.distance,
    required this.location,
    required this.materials,
    required this.currentOffer,
    this.customPrices,
    required this.pickupAvailable,
    required this.phone,
    required this.authorization,
    this.rating = '4.8',
  });

  double get distanceInKm {
    final str = distance.toLowerCase();
    final value = double.tryParse(str.replaceAll(RegExp(r'[^0-9.]'), '')) ?? double.infinity;
    if (str.contains('m') && !str.contains('km')) {
      return value / 1000.0;
    }
    return value;
  }
}

class Payment {
  final String id;
  final int amount;
  final String recycler;
  final String date;
  final int weight;
  final String unit;
  final String material;
  final String status; // 'received', 'pending'
  final String referenceId;
  final bool hasDispute;
  final String? lotId;

  const Payment({
    required this.id,
    required this.amount,
    required this.recycler,
    required this.date,
    required this.weight,
    required this.unit,
    required this.material,
    required this.status,
    required this.referenceId,
    this.hasDispute = false,
    this.lotId,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] as String,
      amount: json['amount'] as int,
      recycler: json['recycler'] as String,
      date: json['date'] as String,
      weight: json['weight'] as int,
      unit: json['unit'] as String,
      material: json['material'] as String,
      status: json['status'] as String,
      referenceId: json['referenceId'] as String,
      hasDispute: json['hasDispute'] as bool? ?? false,
      lotId: json['lotId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'recycler': recycler,
      'date': date,
      'weight': weight,
      'unit': unit,
      'material': material,
      'status': status,
      'referenceId': referenceId,
      'hasDispute': hasDispute,
      'lotId': lotId,
    };
  }
}

