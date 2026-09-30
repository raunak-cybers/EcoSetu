import 'dart:async';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../data/local_storage.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';
import 'package:shimmer/shimmer.dart';
import 'package:flutter/services.dart';

class MyLotsScreen extends StatefulWidget {
  final String? initialCategory;
  const MyLotsScreen({super.key, this.initialCategory});

  @override
  State<MyLotsScreen> createState() => _MyLotsScreenState();
}

class _MyLotsScreenState extends State<MyLotsScreen> {
  late String _selectedTab;
  bool _isLoading = true;
  RealtimeChannel? _subscription;
  Timer? _pollTimer;

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialCategory ?? 'all';
    _loadData();

    try {
      _subscription = Supabase.instance.client
          .channel('public:lots:realtime_my_lots')
          .onPostgresChanges(
            event: PostgresChangeEvent.all,
            schema: 'public',
            table: 'lots',
            callback: (payload) {
              _syncSupabase().then((_) {
                if (mounted) setState(() {});
              });
            },
          )
          .subscribe();
    } catch (_) {}

    _pollTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      _syncSupabase().then((_) {
        if (mounted) setState(() {});
      });
    });
  }

  @override
  void dispose() {
    _subscription?.unsubscribe();
    _pollTimer?.cancel();
    super.dispose();
  }

  Future<void> _syncSupabase() async {
    try {
      final response = await Supabase.instance.client.from('lots').select('lot_id, batch_id, material, declared_weight, verified_weight, final_price, indicative_value, condition, image_url, recycler_name, handover_status, payment_status, created_at, updated_at');
      if (response != null && response is List) {
        final batches = LocalStorageService.getBatches();
        bool changed = false;
        
        for (var batch in batches) {
          for (var lot in batch.lots) {
            final matches = response.where((r) => r['lot_id'] == lot.lotId);
            if (matches.isNotEmpty) {
              final match = matches.first;
              final newStatus = match['handover_status'] as String?;
              final vWeight = match['verified_weight'];
              final fPrice = match['final_price'];
              final recName = match['recycler_name'] as String?;

              if (recName != null && recName.isNotEmpty && lot.recyclerName != recName) {
                lot.recyclerName = recName;
                changed = true;
              }

              if (newStatus != null && lot.handoverStatus != newStatus) {
                lot.handoverStatus = newStatus;
                changed = true;

                if (newStatus == 'paid' || newStatus == 'handed_over' || newStatus == 'settled') {
                  batch.status = 'sold';
                  
                  if (newStatus == 'paid' || newStatus == 'settled') {
                    final payments = LocalStorageService.getPayments();
                    final existingPayment = payments.where((p) => p.lotId == lot.lotId).toList();
                    if (existingPayment.isEmpty) {
                      final payment = Payment(
                        id: 'PAY-${DateTime.now().millisecondsSinceEpoch}',
                        amount: (fPrice != null) ? (fPrice as num).toInt() : lot.indicativeValue.toInt(),
                        recycler: lot.recyclerName ?? 'Green Recycle Hub',
                        date: DateTime.now().toIso8601String(),
                        weight: (vWeight != null) ? (vWeight as num).toInt() : lot.declaredWeight.toInt(),
                        unit: 'kg',
                        material: lot.material,
                        status: 'received',
                        referenceId: 'REF-${lot.lotId}',
                        lotId: lot.lotId,
                      );
                      payments.insert(0, payment);
                      LocalStorageService.savePayments(payments);
                    }
                  }
                }
              }

              if (vWeight != null && lot.verifiedWeight != (vWeight as num).toDouble()) {
                lot.verifiedWeight = (vWeight as num).toDouble();
                changed = true;
              }
              if (fPrice != null && lot.finalPrice != (fPrice as num).toDouble()) {
                lot.finalPrice = (fPrice as num).toDouble();
                changed = true;
              }
            }
          }
        }

        if (changed) {
          await LocalStorageService.saveBatches(batches);
        }
      }
    } catch (e) {
      print('Sync err: $e');
    }
  }

  Future<void> _loadData() async {
    await _syncSupabase();
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleRefresh() async {
    HapticFeedback.lightImpact();
    setState(() => _isLoading = true);
    await _loadData();
  }

  // ── Status logic ─────────────────────────────────────────────────
  // 3 clear states based on real conditions:
  //   'handed_over' → batch sold OR lot.handoverStatus == 'paid' / 'handed_over' / 'settled'
  //   'pickup_pending' → lot has a recycler assigned and awaiting pickup
  //   'not_assigned' → lot created, no recycler yet
  String _lotStatus(Lot lot, Batch batch) {
    final status = (lot.handoverStatus ?? '').toLowerCase().trim();
    if (lot.paymentStatus == 'disputed' || status == 'declined' || status == 'disputed' || status == 'rejected' || batch.status == 'disputed') {
      return 'disputed';
    }
    if (batch.status == 'sold' || 
        status == 'handed over' || 
        status == 'handed_over' || 
        status == 'paid' || 
        status == 'settled' ||
        lot.paymentStatus == 'received' ||
        lot.paymentStatus == 'paid') {
      return 'handed_over';
    }
    if (lot.recyclerName != null || status == 'pickup pending' || status == 'pickup_pending' || status == 'accepted') {
      return 'pickup_pending';
    }
    return 'not_assigned';
  }

  // Filter tabs now use lot-level status
  List<Map<String, dynamic>> _buildFlatLots() {
    final list = LocalStorageService.getBatches()
        .expand((b) => b.lots.map((l) => {'lot': l, 'batch': b}))
        .where((item) {
          final lot = item['lot'] as Lot;
          final batch = item['batch'] as Batch;
          final status = _lotStatus(lot, batch);
          if (_selectedTab == 'all') return true;
          if (_selectedTab == 'in_progress') return status == 'pickup_pending' || status == 'not_assigned';
          if (_selectedTab == 'completed') return status == 'handed_over';
          if (_selectedTab == 'disputed') return status == 'disputed';
          return false;
        })
        .toList();
        
    list.sort((a, b) {
      final batchA = a['batch'] as Batch;
      final batchB = b['batch'] as Batch;
      final dateA = DateTime.tryParse(batchA.updatedAt) ?? DateTime.tryParse(batchA.createdAt) ?? DateTime(2000);
      final dateB = DateTime.tryParse(batchB.updatedAt) ?? DateTime.tryParse(batchB.createdAt) ?? DateTime(2000);
      return dateB.compareTo(dateA);
    });
    
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final flatLots = _buildFlatLots();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Header ───────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                AppLocalizations.of(context).t('mylots_title'),
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: AppColors.purpleDark,
                ),
              ),
                ListenButton(
                  text: AppLocalizations.of(context).language == AppLanguage.hi
                      ? 'किसी भी लॉट पर क्लिक करके उसकी पूरी जानकारी देखें।'
                      : AppLocalizations.of(context).language == AppLanguage.mr
                          ? 'कोणत्याही लॉटवर क्लिक करून त्याचे अधिक तपशील पहा.'
                          : 'Click on any lot to view its more details.',
                ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(left: 16, bottom: 16),
          child: Text(
            AppLocalizations.of(context).t('mylots_subtitle'),
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 15),
          ),
        ),

        // ── Add Batch Button ──────────────────────────────────────
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.pushNamed(context, '/add-batch', arguments: {'autoOpenAI': false});
              },
              icon: const Icon(Icons.add, color: Colors.white),
              label: Text(
                AppLocalizations.of(context).t('mylots_new_batch'),
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.purpleDark,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ),

        // ── Filter Tabs ───────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              _buildFilterTab(AppLocalizations.of(context).t('mylots_tab_all'), 'all'),
              const SizedBox(width: 8),
              _buildFilterTab(AppLocalizations.of(context).t('mylots_tab_disputed'), 'disputed'),
              const SizedBox(width: 8),
              _buildFilterTab(AppLocalizations.of(context).t('mylots_tab_progress'), 'in_progress'),
              const SizedBox(width: 8),
              _buildFilterTab(AppLocalizations.of(context).t('mylots_tab_completed'), 'completed'),
            ],
          ),
        ),

        // ── Lot List ──────────────────────────────────────────────
        Expanded(
          child: _isLoading
              ? _buildShimmerList()
              : RefreshIndicator(
                  onRefresh: _handleRefresh,
                  child: flatLots.isEmpty
                      ? ListView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          children: [
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.4,
                              child: _buildEmptyState(),
                            ),
                          ],
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.only(bottom: 16),
                          physics: const AlwaysScrollableScrollPhysics(),
                          itemCount: flatLots.length,
                          itemBuilder: (context, index) {
                            final lot = flatLots[index]['lot'] as Lot;
                            final batch = flatLots[index]['batch'] as Batch;
                            return _buildLotCard(context, lot, batch);
                          },
                        ),
                ),
        ),
      ],
    );
  }

  Widget _buildShimmerList() {
    return ListView.builder(
      padding: const EdgeInsets.only(bottom: 16),
      itemCount: 4,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10, left: 16, right: 16),
          child: Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Container(
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildLotCard(BuildContext context, Lot lot, Batch batch) {
    final status = _lotStatus(lot, batch);
    final isCompleted = status == 'handed_over' || lot.paymentStatus == 'received';

    return Padding(
      padding: const EdgeInsets.only(bottom: 10, left: 16, right: 16),
      child: GestureDetector(
        onTap: () => Navigator.pushNamed(
          context,
          '/lot-details',
          arguments: {'lot': lot, 'batch': batch},
        ).then((_) {
          if (mounted) setState(() {});
        }),
        child: Container(
          constraints: const BoxConstraints(minHeight: 86),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
            boxShadow: const [
              BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 2)),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Material image thumbnail
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.purpleBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                clipBehavior: Clip.hardEdge,
                child: Image.asset(
                  lot.imageUrl,
                  width: 44,
                  height: 44,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      const Icon(Icons.list_alt, color: AppColors.purpleDark, size: 24),
                ),
              ),
              const SizedBox(width: 12),

              // Material name + details
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                              Text(
                                AppLocalizations.of(context).translateMaterial(lot.material),
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.purpleDark,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                _buildSubtitle(lot, batch),
                                style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                              ),

                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            _buildStatusBadge(status),
                            if (isCompleted && lot.finalPrice != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                '+₹${lot.finalPrice}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF15803D),
                                ),
                              ),
                            ] else if (!isCompleted) ...[
                              const SizedBox(height: 4),
                              IconButton(
                                padding: const EdgeInsets.all(4),
                                constraints: const BoxConstraints(),
                                onPressed: () => _confirmDeleteLot(context, lot, batch),
                                icon: const Icon(
                                  Icons.delete_outline,
                                  color: Colors.red,
                                  size: 20,
                                ),
                              ),
                            ],
                          ],
                        ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _confirmDeleteLot(BuildContext context, Lot lot, Batch batch) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(AppLocalizations.of(context).t('mylots_delete_title')),
        content: Text(AppLocalizations.of(context).t('mylots_delete_desc')),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(AppLocalizations.of(context).t('add_cancel'), style: const TextStyle(color: AppColors.textSecondary)),
          ),
          TextButton(
            onPressed: () {
              // Delete the lot from the batch
              batch.lots.removeWhere((l) => l.lotId == lot.lotId);
              Supabase.instance.client.from('lots').delete().eq('lot_id', lot.lotId).catchError((_) {});
              
              final allBatches = LocalStorageService.getBatches();
              if (batch.lots.isEmpty) {
                allBatches.removeWhere((b) => b.batchId == batch.batchId);
              } else {
                final idx = allBatches.indexWhere((b) => b.batchId == batch.batchId);
                if (idx >= 0) allBatches[idx] = batch;
              }
              LocalStorageService.saveBatches(allBatches).then((_) {
                if (mounted) {
                  setState(() {});
                }
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(AppLocalizations.of(context).t('mylots_deleted_msg'))),
              );
            },
            child: Text(AppLocalizations.of(context).t('mylots_delete_btn'), style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  String _buildSubtitle(Lot lot, Batch batch) {
    final weight = '${lot.declaredWeight}${AppLocalizations.of(context).t('unit_kg')}';
    final date = batch.createdAt == 'Today' ? AppLocalizations.of(context).t('label_today') : batch.createdAt;
    return '$weight  •  $date';
  }

  Widget _buildStatusBadge(String status) {
    late Color bgColor;
    late Color textColor;
    late String text;

    switch (status) {
      case 'disputed':
        bgColor = const Color(0xFFFEE2E2);
        textColor = const Color(0xFFDC2626);
        text = AppLocalizations.of(context).t('mylots_tab_disputed');
        break;
      case 'handed_over':
        bgColor = AppColors.greenLight;
        textColor = const Color(0xFF15803D);
        text = AppLocalizations.of(context).t('mylots_tab_completed');
        break;
      default: // pickup_pending or not_assigned
        bgColor = const Color(0xFFFEF3C7);
        textColor = const Color(0xFFB45309);
        text = AppLocalizations.of(context).t('mylots_tab_progress');
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontSize: 13,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.2,
        ),
      ),
    );
  }

  Widget _buildFilterTab(String label, String value) {
    final isSelected = _selectedTab == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 9),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.purpleDark : Colors.transparent,
            border: Border.all(
              color: isSelected ? AppColors.purpleDark : const Color(0xFFD1D5DB),
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : AppColors.textSecondary,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: AppColors.purpleBg,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.inventory_2_outlined, color: AppColors.purpleDark, size: 36),
            ),
            const SizedBox(height: 16),
            Text(
              AppLocalizations.of(context).t('mylots_empty_title'),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.purpleDark),
            ),
            const SizedBox(height: 8),
            Text(
              AppLocalizations.of(context).t('mylots_empty_desc'),
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 14, height: 1.4),
            ),
          ],
        ),
      ),
    );
  }
}
