import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';
import '../main.dart';

class BatchSummaryScreen extends StatelessWidget {
  const BatchSummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final batch = ModalRoute.of(context)!.settings.arguments as Batch;
    final lot = batch.lots.firstOrNull; // The single item

    if (lot == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: const Center(child: Text('No lots in batch.')),
      );
    }

    // Filter recyclers that accept this material or 'All Categories'
    List<Recycler> applicableRecyclers = mockRecyclers.where(
      (r) => r.materials.contains(lot.material) || r.materials.contains('All Categories')
    ).toList();

    // Sort by distance (parsing numeric prefix)
    applicableRecyclers.sort((a, b) {
      double distA = double.tryParse(a.distance.replaceAll(RegExp(r'[^0-9.]'), '')) ?? 0.0;
      double distB = double.tryParse(b.distance.replaceAll(RegExp(r'[^0-9.]'), '')) ?? 0.0;
      return distA.compareTo(distB);
    });

    // Value Calculation
    int formalValue = lot.indicativeValue;
    int informalValue = (formalValue * 0.8).toInt();

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).t('bs_title')),
        automaticallyImplyLeading: false, // Prevent going back after finding recyclers
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                // Item Summary Banner
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                    boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2))],
                  ),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (_) => Dialog(
                              backgroundColor: Colors.transparent,
                              insetPadding: const EdgeInsets.all(8),
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  InteractiveViewer(
                                    child: Image.asset(lot.imageUrl),
                                  ),
                                  Positioned(
                                    top: 0,
                                    right: 0,
                                    child: IconButton(
                                      icon: const Icon(Icons.close, color: Colors.white, size: 32, shadows: [Shadow(color: Colors.black54, blurRadius: 4)]),
                                      onPressed: () => Navigator.pop(context),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.asset(lot.imageUrl, width: 56, height: 56, fit: BoxFit.cover),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(AppLocalizations.of(context).translateMaterial(lot.material), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryDark)),
                            const SizedBox(height: 4),
                            Text('${lot.declaredWeight} ${AppLocalizations.of(context).t('unit_kg')} • ${lot.condition}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('₹$formalValue', style: const TextStyle(color: Colors.green, fontSize: 22, fontWeight: FontWeight.w900)),
                          Text(AppLocalizations.of(context).t('bs_est_value'), style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      AppLocalizations.of(context).t('bs_rec_buyers'),
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryDark),
                    ),
                    ListenButton(
                      text: '${AppLocalizations.of(context).t('bs_rec_buyers')}. ${AppLocalizations.of(context).t('bs_est_value')} $formalValue.',
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Recyclers List
                if (applicableRecyclers.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 32.0),
                      child: Column(
                        children: [
                          const Icon(Icons.business_center_outlined, size: 64, color: AppColors.textMuted),
                          const SizedBox(height: 16),
                          Text(AppLocalizations.of(context).t('empty_recyclers_title'), 
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  )
                else
                  ...applicableRecyclers.asMap().entries.map((entry) {
                    final index = entry.key;
                  final recycler = entry.value;
                  final isBestMatch = index == 0; // Top one is best match
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: AppCard(
                      padding: const EdgeInsets.all(0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (isBestMatch)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
                              decoration: const BoxDecoration(
                                color: Color(0xFFDCFCE7),
                                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.star, color: Colors.green, size: 16),
                                  const SizedBox(width: 6),
                                  Text(AppLocalizations.of(context).t('bs_best_match'), style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                                ],
                              ),
                            ),
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF3F4F6),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.business, color: AppTheme.primaryMedium),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(recycler.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primaryDark)),
                                      const SizedBox(height: 2),
                                      Row(
                                        children: [
                                          const Icon(Icons.location_on, size: 14, color: AppTheme.textSecondary),
                                          const SizedBox(width: 4),
                                          Text('${recycler.distance}${AppLocalizations.of(context).t('bs_away')}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(AppLocalizations.of(context).t('bs_pays_up_to'), style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                                    Text('₹$formalValue', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.green, fontSize: 16)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ],
            ),
          ),
          
          // Bottom Action
          Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(color: Color(0x1A000000), blurRadius: 10, offset: Offset(0, -4)),
              ],
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: SizedBox(
                      height: 54,
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.popUntil(context, ModalRoute.withName('/'));
                        },
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.primaryDark, width: 2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: Text(AppLocalizations.of(context).t('bs_home'), style: const TextStyle(fontSize: 16, color: AppTheme.primaryDark, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    flex: 2,
                    child: SizedBox(
                      height: 54,
                      child: ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(AppLocalizations.of(context).t('bs_lot_added'))),
                          );
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(builder: (context) => const MainShell(initialIndex: 1)),
                            (route) => false,
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryDark,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: Text(AppLocalizations.of(context).t('bs_check_lot_status'), style: const TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
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
}
