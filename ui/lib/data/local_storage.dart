import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'mock_data.dart';

class LocalStorageService {
  static late SharedPreferences _prefs;
  
  static const String _keyCollector = 'collector_profile';
  static const String _keyBatches = 'batches_list';
  static const String _keyPayments = 'payments_list';
  static const String _keyLanguage = 'app_language';
  static const String _keyVoiceMode = 'voice_mode';
  static const String _keyNotifications = 'notifications_enabled';
  static const String _keyOnboarding = 'onboarding_complete';

  static bool hasCompletedOnboarding() {
    return _prefs.getBool(_keyOnboarding) ?? false;
  }

  static Future<void> completeOnboarding() async {
    await _prefs.setBool(_keyOnboarding, true);
  }

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    
    // Initialize with mock data if completely empty
    if (!_prefs.containsKey(_keyCollector)) {
      await saveCollector(mockCollector);
    }
    if (!_prefs.containsKey(_keyBatches)) {
      await saveBatches(mockBatches);
    }
    if (!_prefs.containsKey(_keyPayments)) {
      await savePayments(mockPayments);
    }
  }

  // --- Collector ---
  static Collector getCollector() {
    final String? jsonStr = _prefs.getString(_keyCollector);
    if (jsonStr != null) {
      try {
        final c = Collector.fromJson(jsonDecode(jsonStr));
        if (c.id == 'ES-1024' || !c.id.contains('-') || c.id.length < 32) {
          final migrated = c.copyWith(id: 'a1000000-0000-0000-0000-000000000001', name: 'Ravi Kumar');
          saveCollector(migrated);
          return migrated;
        }
        return c;
      } catch (e) {
        // Fallback to mock data on corruption
      }
    }
    return mockCollector; // Fallback
  }

  static Future<void> saveCollector(Collector collector) async {
    await _prefs.setString(_keyCollector, jsonEncode(collector.toJson()));
  }

  // --- Batches & Lots ---
  static List<Batch> getBatches() {
    final String? jsonStr = _prefs.getString(_keyBatches);
    if (jsonStr != null) {
      try {
        final List<dynamic> decoded = jsonDecode(jsonStr);
        return decoded.map((e) => Batch.fromJson(e)).toList();
      } catch (e) {
        // Fallback on corruption
      }
    }
    return [];
  }

  static Future<void> saveBatches(List<Batch> batches) async {
    final String encoded = jsonEncode(batches.map((e) => e.toJson()).toList());
    await _prefs.setString(_keyBatches, encoded);
  }

  static Future<void> saveBatch(Batch batch) async {
    batch.updatedAt = DateTime.now().toIso8601String(); // Update the modified timestamp
    final List<Batch> batches = getBatches();
    final index = batches.indexWhere((b) => b.batchId == batch.batchId);
    if (index >= 0) {
      batches[index] = batch;
    } else {
      batches.insert(0, batch);
    }
    await saveBatches(batches);
  }

  // Helper to get all lots
  static List<Lot> getAllLots() {
    return getBatches().expand((batch) => batch.lots).toList();
  }

  // --- Payments ---
  static List<Payment> getPayments() {
    final allLots = getAllLots();
    final allBatches = getBatches();
    
    List<Payment> dynamicPayments = [];
    
    for (var lot in allLots) {
      if (lot.handoverStatus == 'paid') {
        dynamicPayments.add(Payment(
          id: 'PAY-${lot.lotId.replaceAll('LOT-', '')}',
          amount: (lot.finalPrice ?? lot.indicativeValue).toInt(),
          recycler: lot.recyclerName ?? 'Unknown Recycler',
          date: DateTime.now().toString().substring(0, 10), // Use current date since lot doesn't store handoverDate
          weight: lot.verifiedWeight?.toInt() ?? lot.declaredWeight,
          unit: 'kg',
          material: lot.material,
          status: 'received',
          referenceId: 'REF-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
          hasDispute: false,
          lotId: lot.lotId,
        ));
      }
    }
    
    for (var batch in allBatches) {
      if (batch.status == 'sold') {
        dynamicPayments.add(Payment(
          id: 'PAY-${batch.batchId.replaceAll('B-', '')}',
          amount: batch.estimatedTotalValue,
          recycler: 'Batch Buyer',
          date: batch.createdAt.length >= 10 ? batch.createdAt.substring(0, 10) : batch.createdAt,
          weight: batch.totalWeight,
          unit: 'kg',
          material: 'Mixed E-Waste',
          status: 'received',
          referenceId: 'REF-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
          hasDispute: false,
          lotId: null,
        ));
      }
    }
    
    // Sort by most recent
    dynamicPayments.sort((a, b) => b.id.compareTo(a.id));
    return dynamicPayments;
  }

  static Future<void> savePayments(List<Payment> payments) async {
    final String encoded = jsonEncode(payments.map((e) => e.toJson()).toList());
    await _prefs.setString(_keyPayments, encoded);
  }

  // --- Preferences ---
  static String? getLanguage() {
    return _prefs.getString(_keyLanguage);
  }

  static Future<void> saveLanguage(String langCode) async {
    await _prefs.setString(_keyLanguage, langCode);
  }

  static bool getVoiceMode() {
    return _prefs.getBool(_keyVoiceMode) ?? true;
  }

  static Future<void> saveVoiceMode(bool isEnabled) async {
    await _prefs.setBool(_keyVoiceMode, isEnabled);
  }

  static bool getNotifications() {
    return _prefs.getBool(_keyNotifications) ?? true;
  }

  static Future<void> saveNotifications(bool isEnabled) async {
    await _prefs.setBool(_keyNotifications, isEnabled);
  }

  // Clear all data (for logout or reset)
  static Future<void> clearAll() async {
    await _prefs.clear();
  }
}
