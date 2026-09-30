import 'dart:async';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../data/local_storage.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';
import 'recyclers_screen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/supabase_sync_service.dart';

class LotDetailsScreen extends StatefulWidget {
  const LotDetailsScreen({super.key});

  @override
  State<LotDetailsScreen> createState() => _LotDetailsScreenState();
}

class _LotDetailsScreenState extends State<LotDetailsScreen> {
  bool _hasSynced = false;
  RealtimeChannel? _subscription;
  Timer? _syncTimer;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_hasSynced) {
      _hasSynced = true;
      _syncLotStatus();
      
      final args = ModalRoute.of(context)!.settings.arguments;
      Lot? targetLot;
      if (args is Lot) targetLot = args;
      if (args is Map<String, dynamic> && args['lot'] is Lot) targetLot = args['lot'];
      
      if (targetLot != null) {
        _subscription = Supabase.instance.client
            .channel('public:lots:details')
            .onPostgresChanges(
              event: PostgresChangeEvent.update,
              schema: 'public',
              table: 'lots',
              filter: PostgresChangeFilter(
                type: PostgresChangeFilterType.eq,
                column: 'lot_id',
                value: targetLot.lotId,
              ),
              callback: (payload) {
                _syncLotStatus();
              },
            )
            .subscribe();

        // Fallback polling every 3 seconds to guarantee updates
        _syncTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
          _syncLotStatus();
        });
      }
    }
  }

  @override
  void dispose() {
    _subscription?.unsubscribe();
    _syncTimer?.cancel();
    super.dispose();
  }

  Future<void> _syncLotStatus() async {
    final args = ModalRoute.of(context)!.settings.arguments;
    if (args == null) return;
    
    Lot? targetLot;
    if (args is Lot) targetLot = args;
    if (args is Map<String, dynamic> && args['lot'] is Lot) targetLot = args['lot'];
    
    if (targetLot != null) {
      try {
        final response = await Supabase.instance.client.from('lots').select('handover_status, verified_weight, final_price, recycler_name').eq('lot_id', targetLot.lotId).maybeSingle();
        if (response != null) {
          final newStatus = response['handover_status'] as String?;
          final vWeight = response['verified_weight'];
          final fPrice = response['final_price'];
          final recName = response['recycler_name'] as String?;
          
          final batches = LocalStorageService.getBatches();
          bool shouldUpdate = false;

          for (var batch in batches) {
            final lotIndex = batch.lots.indexWhere((l) => l.lotId == targetLot!.lotId);
            if (lotIndex >= 0) {
              final lotToUpdate = batch.lots[lotIndex];

              if (recName != null && recName.isNotEmpty && lotToUpdate.recyclerName != recName) {
                lotToUpdate.recyclerName = recName;
                shouldUpdate = true;
              }

              if (newStatus != null && lotToUpdate.handoverStatus != newStatus) {
                lotToUpdate.handoverStatus = newStatus;
                if (newStatus == 'paid' || newStatus == 'handed_over' || newStatus == 'settled') {
                  batch.status = 'sold';
                }
                shouldUpdate = true;
              }

              if (vWeight != null && lotToUpdate.verifiedWeight != (vWeight as num).toDouble()) {
                lotToUpdate.verifiedWeight = (vWeight as num).toDouble();
                shouldUpdate = true;
              }

              if (fPrice != null && lotToUpdate.finalPrice != (fPrice as num).toDouble()) {
                lotToUpdate.finalPrice = (fPrice as num).toDouble();
                shouldUpdate = true;
              }
            }
          }
          
          if (shouldUpdate) {
            await LocalStorageService.saveBatches(batches);
            if (mounted) setState(() {});
          }
        }
      } catch (e) {
        print("Sync error: $e");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments;
    final allBatches = LocalStorageService.getBatches();
    final defaultBatch = allBatches.isNotEmpty ? allBatches[0] : Batch(batchId: 'B-000', status: 'active', lots: [], collectorId: 'C-000', createdAt: AppLocalizations.of(context).t('label_today'));
    final defaultLot = defaultBatch.lots.isNotEmpty ? defaultBatch.lots[0] : Lot(lotId: 'L-000', batchId: 'B-000', material: AppLocalizations.of(context).t('label_unknown'), imageUrl: '', declaredWeight: 0, indicativeValue: 0, condition: AppLocalizations.of(context).t('label_unknown'));

    Lot initialLot = args is Lot 
        ? args 
        : (args is Map<String, dynamic> ? (args['lot'] as Lot? ?? defaultLot) : defaultLot);
        
    Lot lot = LocalStorageService.getAllLots().firstWhere(
      (l) => l.lotId == initialLot.lotId,
      orElse: () => initialLot,
    );
        
    Batch batch = args is Map<String, dynamic> 
        ? (args['batch'] as Batch? ?? defaultBatch) 
        : defaultBatch;
        
    try {
      final freshLots = LocalStorageService.getAllLots();
      lot = freshLots.firstWhere((l) => l.lotId == lot.lotId);
      final freshBatches = LocalStorageService.getBatches();
      batch = freshBatches.firstWhere((b) => b.batchId == lot.batchId);
    } catch (e) {
      // ignore
    }

    final bool hideTimelineAndQR = args is Map<String, dynamic> ? (args['hideTimelineAndQR'] as bool? ?? false) : false;

    // Use the recycler assigned to this lot, or fall back to the first one
    final matchedRecycler = lot.recyclerName != null
        ? mockRecyclers.firstWhere(
            (r) => r.name == lot.recyclerName,
            orElse: () => mockRecyclers[0],
          )
        : mockRecyclers[0];

            bool hasHighVariance = false;
            if (lot.verifiedWeight != null && lot.declaredWeight > 0) {
              final variance = (lot.verifiedWeight! - lot.declaredWeight).abs() / lot.declaredWeight;
              hasHighVariance = variance > 0.10;
            }
            bool isDisputed = lot.handoverStatus == 'declined' || lot.handoverStatus == 'rejected' || batch.status == 'disputed';
            bool isPickupGreen = (lot.recyclerName != null && (lot.handoverStatus == 'accepted')) || lot.handoverStatus == 'handed_over' || lot.handoverStatus == 'paid' || batch.status == 'sold';
            bool isMatchedGreen = (lot.recyclerName != null && !isDisputed) || batch.status == 'sold';

            return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).t('lot_det_title')),
        backgroundColor: AppTheme.primaryDark,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Card 1: Bill UI
            AppCard(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${AppLocalizations.of(context).t('lot_det_bill')} • ${lot.lotId}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textSecondary, letterSpacing: 1.2)),
                              const SizedBox(height: 4),
                              Text(
                                AppLocalizations.of(context).translateMaterial(lot.material).toUpperCase(),
                                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.primaryDark),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            ListenButton(
                              text: AppLocalizations.of(context).language == AppLanguage.hi
                                  ? 'आपका बिल। अनुमानित सामग्री: ${AppLocalizations.of(context).translateMaterial(lot.material)}। अनुमानित वजन: ${lot.declaredWeight} ${AppLocalizations.of(context).t('unit_kg')}। अनुमानित स्थिति: ${AppLocalizations.of(context).translateCondition(lot.condition)}। अनुमानित कुल मूल्य: ${lot.indicativeValue} रुपये।${lot.finalPrice != null ? " अंतिम सामग्री: " + AppLocalizations.of(context).translateMaterial(lot.verifiedMaterial ?? lot.material) + "। अंतिम वजन: ${lot.verifiedWeight} " + AppLocalizations.of(context).t('unit_kg') + "। अंतिम स्थिति: " + AppLocalizations.of(context).translateCondition(lot.condition) + "। अंतिम कुल मूल्य: ${lot.finalPrice} रुपये।" : ""} ${lot.recyclerName != null ? "रिसाइकिलर मिल गया है: ${lot.recyclerName}।" : "अभी तक कोई रिसाइकिलर नहीं मिला है।"}'
                                  : AppLocalizations.of(context).language == AppLanguage.mr
                                      ? 'तुमचे बिल. अंदाजित सामग्री: ${AppLocalizations.of(context).translateMaterial(lot.material)}. अंदाजित वजन: ${lot.declaredWeight} ${AppLocalizations.of(context).t('unit_kg')}. अंदाजित स्थिती: ${AppLocalizations.of(context).translateCondition(lot.condition)}. अंदाजित एकूण किंमत: ${lot.indicativeValue} रुपये.${lot.finalPrice != null ? " अंतिम सामग्री: " + AppLocalizations.of(context).translateMaterial(lot.verifiedMaterial ?? lot.material) + ". अंतिम वजन: ${lot.verifiedWeight} " + AppLocalizations.of(context).t('unit_kg') + ". अंतिम स्थिती: " + AppLocalizations.of(context).translateCondition(lot.condition) + ". अंतिम एकूण किंमत: ${lot.finalPrice} रुपये." : ""} ${lot.recyclerName != null ? "रिसायकलर मिळाला आहे: ${lot.recyclerName}." : "अद्याप कोणताही रिसायकलर मिळालेला नाही."}'
                                      : 'Your Bill. Estimated material: ${AppLocalizations.of(context).translateMaterial(lot.material)}. Estimated weight: ${lot.declaredWeight} ${AppLocalizations.of(context).t('unit_kg')}. Estimated condition: ${lot.condition}. Estimated total price: ${lot.indicativeValue} rupees.${lot.finalPrice != null ? " Final material: " + AppLocalizations.of(context).translateMaterial(lot.verifiedMaterial ?? lot.material) + ". Final weight: ${lot.verifiedWeight} " + AppLocalizations.of(context).t('unit_kg') + ". Final condition: ${lot.condition}. Final total price: ${lot.finalPrice} rupees." : ""} ${lot.recyclerName != null ? "Recycler matched: ${lot.recyclerName}." : "No recycler matched yet."}',
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isDisputed ? AppTheme.accentRed.withValues(alpha: 0.1) : ((lot.handoverStatus == 'paid' || lot.handoverStatus == 'handed_over' || lot.handoverStatus == 'settled' || batch.status == 'sold') ? AppTheme.accentGreen.withValues(alpha: 0.1) : const Color(0xFFFEF3C7)),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                isDisputed ? 'Disputed' : ((lot.handoverStatus == 'paid' || lot.handoverStatus == 'handed_over' || lot.handoverStatus == 'settled' || batch.status == 'sold') ? AppLocalizations.of(context).t('lot_det_handed_over') : AppLocalizations.of(context).t('lot_det_in_progress')),
                                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: isDisputed ? AppTheme.accentRed : ((lot.handoverStatus == 'paid' || lot.handoverStatus == 'handed_over' || lot.handoverStatus == 'settled' || batch.status == 'sold') ? AppTheme.accentGreen : const Color(0xFFD97706))),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(height: 1, color: AppTheme.border),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Expanded(flex: 3, child: SizedBox()),
                        Expanded(
                          flex: 2,
                          child: Text(AppLocalizations.of(context).t('lot_det_final'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textSecondary)),
                        ),
                        Container(width: 1, height: 12, color: Colors.transparent, margin: const EdgeInsets.symmetric(horizontal: 8)),
                        Expanded(
                          flex: 3,
                          child: Text(AppLocalizations.of(context).t('lot_det_est'), textAlign: TextAlign.right, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textSecondary)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    _buildTableRow(AppLocalizations.of(context).t('lot_det_material'), lot.verifiedMaterial != null ? AppLocalizations.of(context).translateMaterial(lot.verifiedMaterial!) : '--', AppLocalizations.of(context).translateMaterial(lot.material), isDisputed),
                    _buildTableRow(AppLocalizations.of(context).t('lot_det_weight'), lot.verifiedWeight != null ? '${lot.verifiedWeight} ${AppLocalizations.of(context).t('unit_kg')}' : '--', '${lot.declaredWeight} ${AppLocalizations.of(context).t('unit_kg')}', isDisputed),
                    _buildTableRow(AppLocalizations.of(context).t('lot_det_condition'), lot.finalPrice != null ? AppLocalizations.of(context).translateCondition(lot.condition) : '--', AppLocalizations.of(context).translateCondition(lot.condition), isDisputed),
                    _buildTableRow(AppLocalizations.of(context).t('lot_det_rate'), lot.finalPrice != null && lot.verifiedWeight != null && lot.verifiedWeight! > 0 ? '₹${(lot.finalPrice! / lot.verifiedWeight!).toStringAsFixed(0)}${AppLocalizations.of(context).t('unit_per_kg')}' : '--', '₹${(lot.indicativeValue / lot.declaredWeight).toStringAsFixed(0)}${AppLocalizations.of(context).t('unit_per_kg')}', isDisputed),
                    const SizedBox(height: 4),
                    const Divider(color: AppTheme.border),
                    const SizedBox(height: 4),
                    _buildTableRow(AppLocalizations.of(context).t('lot_det_total_price'), lot.finalPrice != null ? '₹${lot.finalPrice}' : '--', '₹${lot.indicativeValue}', isDisputed, isTotal: true),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Card 2: Recycler Info
            if (isDisputed)
              AppCard(
                padding: EdgeInsets.zero,
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: AppTheme.accentRed, width: 2),
                    borderRadius: BorderRadius.circular(16),
                    color: AppTheme.accentRed.withValues(alpha: 0.05),
                  ),
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppTheme.accentRed.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.error_outline, color: AppTheme.accentRed),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AppLocalizations.of(context).t('lot_det_declined_title'),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.accentRed,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${lot.recyclerName ?? "Recycler"} could not accept the lot because the material condition or weight did not match the declaration.',
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => Scaffold(
                                appBar: AppBar(
                                  backgroundColor: AppTheme.primaryDark,
                                  foregroundColor: Colors.white,
                                ),
                                body: RecyclersScreen(initialCategory: (lot.material == 'Magnet' || lot.material == 'Magnet-Bearing' || lot.material == 'Magnet Assembly') ? 'Magnet-Bearing Assembly' : lot.material, lot: lot),
                              ),
                            ),
                          ).then((_) => setState(() {}));
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.accentRed,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          elevation: 0,
                        ),
                        child: Text(AppLocalizations.of(context).t('lot_det_find_match'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                      ),
                    ],
                  ),
                ),
              )
            else if (lot.recyclerName != null) 
              AppCard(
                child: InkWell(
                  onTap: () async {
                    final result = await Navigator.pushNamed(context, '/recycler-details', arguments: {
                      'recycler': matchedRecycler,
                      'isSmartFlow': false,
                      'material': lot.material,
                      'lot': lot,
                    });
                    if (result == true && mounted) {
                      setState(() {
                         lot = LocalStorageService.getAllLots().firstWhere((l) => l.lotId == lot.lotId, orElse: () => lot);
                         batch = LocalStorageService.getBatches().firstWhere((b) => b.batchId == lot.batchId, orElse: () => batch);
                      });
                      _syncLotStatus();
                    }
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: AppTheme.accentGreen.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.factory, color: AppTheme.accentGreen),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                AppLocalizations.of(context).t('lot_det_matched_recycler'),
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                              Text(
                                matchedRecycler.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                      ],
                    ),
                  ),
                ),
              )
            else
              AppCard(
                padding: EdgeInsets.zero,
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: AppTheme.orangeLight, width: 2),
                    borderRadius: BorderRadius.circular(16),
                    color: const Color(0xFFFFF7ED),
                  ),
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: const BoxDecoration(
                          color: AppTheme.orangeLight,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.search, color: Color(0xFFC2410C)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AppLocalizations.of(context).t('lot_det_no_recycler'),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF9A3412),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              AppLocalizations.of(context).t('lot_det_find_verified'),
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => Scaffold(
                                appBar: AppBar(
                                  backgroundColor: AppTheme.primaryDark,
                                  foregroundColor: Colors.white,
                                ),
                                body: RecyclersScreen(initialCategory: (lot.material == 'Magnet' || lot.material == 'Magnet-Bearing' || lot.material == 'Magnet Assembly') ? 'Magnet-Bearing Assembly' : lot.material, lot: lot),
                              ),
                            ),
                          ).then((_) => setState(() {}));
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEA580C),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          elevation: 0,
                        ),
                        child: Text(AppLocalizations.of(context).t('lot_det_find_match'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                      ),
                    ],
                  ),
                ),
              ),
            if (!hideTimelineAndQR) ...[
              const SizedBox(height: 16),

              // Card 3: Lot Status (Timeline)
              AppCard(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          AppLocalizations.of(context).t('lot_det_status'),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.primaryDark,
                          ),
                        ),
                        ListenButton(
                          text: '${AppLocalizations.of(context).t('lot_det_status')}. '
                                '${AppLocalizations.of(context).t('lot_det_created')}. '
                                '${(isMatchedGreen) ? AppLocalizations.of(context).t('lot_det_matched') + ". " : ""}'
                                '${(isPickupGreen) ? AppLocalizations.of(context).t('lot_det_pickup') + ". " : ""}'
                                '${(lot.handoverStatus == 'handed_over' || batch.status == 'sold') ? AppLocalizations.of(context).t('lot_det_confirmed') + ". " : ""}',
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildTimelineStep(
                      title: AppLocalizations.of(context).t('lot_det_created'),
                      subtitle: AppLocalizations.of(context).t('lot_det_created_desc'),
                      isCompleted: true,
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: AppLocalizations.of(context).t('lot_det_matched'),
                      subtitle: AppLocalizations.of(context).t('lot_det_matched_desc'),
                      isCompleted: isMatchedGreen, 
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: AppLocalizations.of(context).t('lot_det_pickup'),
                      subtitle: AppLocalizations.of(context).t('lot_det_pickup_desc'),
                      isCompleted: isPickupGreen, 
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: AppLocalizations.of(context).t('lot_det_confirmed'),
                      subtitle: AppLocalizations.of(context).t('lot_det_confirmed_desc'),
                      isCompleted: lot.handoverStatus == 'handed_over' || lot.handoverStatus == 'paid' || batch.status == 'sold', 
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: AppLocalizations.of(context).t('lot_det_paid'),
                      subtitle: AppLocalizations.of(context).t('lot_det_paid_desc'),
                      isCompleted: lot.handoverStatus == 'paid' || batch.status == 'sold', 
                      isLast: true,
                    ),
                    if (lot.handoverStatus == 'paid' || batch.status == 'sold')
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Center(
                          child: TextButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Your request has been forwarded to support. We will verify the payment status with the recycler and update you shortly.'),
                                  backgroundColor: AppTheme.primaryDark,
                                  behavior: SnackBarBehavior.floating,
                                  margin: EdgeInsets.all(16),
                                ),
                              );
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.support_agent, size: 18, color: AppTheme.primaryDark),
                                const SizedBox(width: 6),
                                Text(
                                  "Didn't receive payment?",
                                  style: TextStyle(
                                    fontSize: 15,
                                    color: AppTheme.primaryDark,
                                    fontWeight: FontWeight.bold,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            ],
          ],
        ),
      ),
      ),
      if (!hideTimelineAndQR && isPickupGreen)
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, -5),
              ),
            ],
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                          onPressed: () => _showHandoverQR(context, lot),
                  icon: const Icon(Icons.qr_code_scanner, size: 24),
                  label: Text(AppLocalizations.of(context).t('lot_det_show_qr'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryDark,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 8,
                    shadowColor: AppTheme.primaryDark.withValues(alpha: 0.5),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
      ),
    );
  }

  Widget _buildTimelineStep({
    required String title,
    required String subtitle,
    required bool isCompleted,
    required bool isLast,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isCompleted ? AppTheme.accentGreen : const Color(0xFFF3F4F6),
                  shape: BoxShape.circle,
                  border: isCompleted ? null : Border.all(color: const Color(0xFFE5E7EB), width: 2),
                ),
                child: isCompleted
                    ? const Icon(Icons.circle, color: Colors.white, size: 10)
                    : null,
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: const Color(0xFFE5E7EB),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isCompleted ? AppTheme.primaryDark : AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showHandoverQR(BuildContext context, Lot lot) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(AppLocalizations.of(context).t('lot_det_qr_title'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primaryDark)),
                  ListenButton(
                    text: AppLocalizations.of(context).language == AppLanguage.hi
                        ? 'अपना फोन रिसाइकिलर को दें ताकि वह यह क्यूआर कोड स्कैन कर सके और पिकअप की पुष्टि कर सके।'
                        : AppLocalizations.of(context).language == AppLanguage.mr
                            ? 'तुमचा फोन रिसायकलरला द्या जेणेकरून तो हा क्यूआर कोड स्कॅन करू शकेल आणि पिकअपची पुष्टी करू शकेल.'
                            : 'Show this QR code to the recycler so they can scan it and confirm the pickup.',
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(AppLocalizations.of(context).t('lot_det_qr_desc'), textAlign: TextAlign.center, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary)),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.border, width: 2),
                ),
                child: QrImageView(
                  data: lot.lotId,
                  version: QrVersions.auto,
                  size: 200.0,
                  foregroundColor: AppTheme.primaryDark,
                ),
              ),
              const SizedBox(height: 32),
              Text(AppLocalizations.of(context).t('lot_det_or_ref'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textSecondary, letterSpacing: 1.2)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  color: AppTheme.purpleBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.purpleMedium.withValues(alpha: 0.3)),
                ),
                child: Text(lot.lotId, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppTheme.purpleDark, letterSpacing: 2)),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryDark,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text(AppLocalizations.of(context).t('lot_det_done'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTableRow(String label, String finalVal, String estVal, bool isDisputed, {bool isTotal = false}) {
    final bool isAmount = isTotal || finalVal.contains('₹') || estVal.contains('₹');
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(label, style: TextStyle(fontSize: 14, color: isTotal ? AppTheme.primaryDark : AppTheme.textSecondary, fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
          ),
          Expanded(
            flex: 2,
            child: Text(finalVal, style: TextStyle(fontSize: isAmount ? 16 : 14, fontWeight: FontWeight.bold, color: finalVal == '--' ? AppTheme.textSecondary.withValues(alpha: 0.5) : (isDisputed ? AppTheme.accentRed : AppTheme.accentGreen))),
          ),
          Container(
            width: 1,
            height: 16,
            color: AppTheme.border,
            margin: const EdgeInsets.symmetric(horizontal: 8),
          ),
          Expanded(
            flex: 3,
            child: Text(estVal, textAlign: TextAlign.right, style: TextStyle(fontSize: isAmount ? 16 : 14, fontWeight: isTotal ? FontWeight.bold : FontWeight.w600, color: AppTheme.textDark)),
          ),
        ],
      ),
    );
  }
}



