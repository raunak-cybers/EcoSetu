import 'package:supabase_flutter/supabase_flutter.dart';
import '../data/models.dart';

/// SupabaseSyncService — syncs lots/batches from the app to the cloud DB
/// so the Dashboard can see them in real-time.
/// All methods are fire-and-forget safe: they never crash the app on failure.
class SupabaseSyncService {
  static final _client = Supabase.instance.client;

  // ─── Sync a batch + its lots to Supabase ────────────────────────────────
  static Future<void> syncBatch(Batch batch, Collector collector) async {
    try {
      final validCollectorId = (collector.id.length >= 32 && collector.id.contains('-'))
          ? collector.id
          : 'a1000000-0000-0000-0000-000000000001';

      final validBatchId = (batch.batchId.length >= 32 && batch.batchId.contains('-'))
          ? batch.batchId
          : 'b1000000-0000-0000-0000-000000000099';

      // 1. Upsert collector profile
      await _client.from('collectors').upsert({
        'id': validCollectorId,
        'name': collector.name,
        'initials': collector.initials,
        'phone': collector.phone,
        'location': collector.location,
        'operating_area': collector.operatingArea,
        'language': collector.language,
        'total_lots': collector.totalLots,
        'total_earnings': collector.totalEarnings,
        'completed_transactions': collector.completedTransactions,
      });

      // 2. Upsert the batch
      await _client.from('batches').upsert({
        'batch_id': validBatchId,
        'collector_id': validCollectorId,
        'status': batch.status,
        'sync_status': 'synced',
        'updated_at': DateTime.now().toIso8601String(),
      });

      // 3. Upsert all lots in the batch
      for (final lot in batch.lots) {
        await _client.from('lots').upsert({
          'lot_id': lot.lotId,
          'batch_id': validBatchId,
          'collector_id': validCollectorId,
          'material': lot.material,
          'declared_weight': lot.declaredWeight,
          'condition': lot.condition,
          'indicative_value': lot.indicativeValue,
          'collector_declaration': lot.collectorDeclaration,
          'handover_status': lot.handoverStatus ?? 'pending',
          'payment_status': lot.paymentStatus ?? 'pending',
          'image_url': lot.imageUrl,
          'recycler_name': lot.recyclerName,
          'updated_at': DateTime.now().toIso8601String(),
        });
      }
      print('[SupabaseSync] syncBatch successful for batch $validBatchId and lots: ${batch.lots.map((l) => l.lotId).join(', ')}');
    } catch (e) {
      print('[SupabaseSync] syncBatch error: $e');
    }
  }

  // ─── Update a single lot's status (e.g. handover, payment) ──────────────
  static Future<void> updateLotStatus(Lot lot) async {
    try {
      await _client.from('lots').update({
        'handover_status': lot.handoverStatus,
        'payment_status': lot.paymentStatus,
        'verified_weight': lot.verifiedWeight,
        'final_price': lot.finalPrice,
        'verified_material': lot.verifiedMaterial,
        'recycler_name': lot.recyclerName,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('lot_id', lot.lotId);
    } catch (e) {
      print('[SupabaseSync] updateLotStatus error: $e');
    }
  }

  // ─── Update batch status (active → pending → sold) ──────────────────────
  static Future<void> updateBatchStatus(String batchId, String status) async {
    try {
      await _client.from('batches').update({
        'status': status,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('batch_id', batchId);
    } catch (e) {
      print('[SupabaseSync] updateBatchStatus error: $e');
    }
  }

  // ─── Sync a payment when a lot is marked as paid ────────────────────────
  static Future<void> syncPayment(Payment payment, String collectorId) async {
    try {
      await _client.from('payments').upsert({
        'id': payment.id,
        'lot_id': payment.lotId,
        'collector_id': collectorId,
        'recycler_name': payment.recycler,
        'amount': payment.amount,
        'material': payment.material,
        'weight': payment.weight,
        'unit': payment.unit,
        'status': payment.status,
        'has_dispute': payment.hasDispute,
        'reference_id': payment.referenceId,
      });
    } catch (e) {
      print('[SupabaseSync] syncPayment error: $e');
    }
  }

  // ─── Update collector totals after completing a transaction ─────────────
  static Future<void> updateCollectorStats(Collector collector) async {
    try {
      await _client.from('collectors').update({
        'total_lots': collector.totalLots,
        'total_earnings': collector.totalEarnings,
        'completed_transactions': collector.completedTransactions,
      }).eq('id', collector.id);
    } catch (e) {
      print('[SupabaseSync] updateCollectorStats error: $e');
    }
  }
}
