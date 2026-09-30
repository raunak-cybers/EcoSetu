import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../data/local_storage.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../data/models.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../screens/lot_details_screen.dart';
import '../services/supabase_sync_service.dart';

class RecyclerDetailsScreen extends StatelessWidget {
  const RecyclerDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final Object? args = ModalRoute.of(context)?.settings.arguments;
    Recycler recycler = mockRecyclers[0];
    bool isSmartFlow = false;
    bool showRequestButton = false;
    String? material;
    // *** FIX: capture lotArg HERE, at screen build time, NOT inside a callback ***
    Lot? capturedLot;

    if (args is Recycler) {
      recycler = args;
    } else if (args is Map) {
      recycler = (args['recycler'] as Recycler?) ?? mockRecyclers[0];
      isSmartFlow = (args['isSmartFlow'] as bool?) ?? false;
      material = args['material'] as String?;
      capturedLot = args['lot'] as Lot?;

      if (capturedLot != null) {
        final alreadyAssigned = capturedLot!.recyclerName != null &&
            capturedLot!.handoverStatus != 'declined' &&
            capturedLot!.handoverStatus != 'rejected' &&
            capturedLot!.handoverStatus != 'disputed';
        showRequestButton = !alreadyAssigned;
      } else {
        showRequestButton = isSmartFlow;
      }
    } else {
      showRequestButton = isSmartFlow;
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).t('rd_title')),
        backgroundColor: AppTheme.white,
        foregroundColor: AppTheme.primaryDark,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Hero Image & Header
            AppCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  Container(
                    height: 160,
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                    ),
                    clipBehavior: Clip.hardEdge,
                    child: Image.asset(
                      'assets/images/recycler_center.png',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: AppTheme.purpleBg,
                        child: const Icon(Icons.storefront, size: 80, color: AppTheme.purpleMedium),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              recycler.name,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.textDark,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(width: 8),
                            ListenButton(
                              text: AppLocalizations.of(context).language == AppLanguage.hi
                                  ? '${recycler.name}। यह रिसाइकिलर ${recycler.distance} दूर है और ${recycler.location} में स्थित है। यह एक ${recycler.verified ? "सत्यापित" : "असत्यापित"} रिसाइकिलर है। अगर आप इस रिसाइकिलर को लॉक करना चाहते हैं, तो रिक्वेस्ट पिकअप बटन पर क्लिक करें।'
                                  : AppLocalizations.of(context).language == AppLanguage.mr
                                      ? '${recycler.name}. हा रिसायकलर ${recycler.distance} दूर आहे आणि ${recycler.location} येथे आहे. हा एक ${recycler.verified ? "सत्यापित" : "असत्यापित"} रिसायकलर आहे. जर तुम्हाला हा रिसायकलर लॉक करायचा असेल, तर रिक्वेस्ट पिकअप बटणावर क्लिक करा.'
                                      : '${recycler.name}. This recycler is ${recycler.distance} away, located in ${recycler.location}. They are a ${recycler.verified ? "verified" : "unverified"} recycler. Click on request pickup if you want to lock this recycler.',
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.location_on, size: 16, color: AppTheme.textSecondary),
                            const SizedBox(width: 4),
                            Flexible(
                              child: Text(
                                '${recycler.distance} • ${recycler.location}',
                                style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            if (showRequestButton) ...[
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  if (material != null || capturedLot != null) {
                    showDialog(
                      context: context,
                      builder: (dialogContext) => AlertDialog(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        title: Text(AppLocalizations.of(context).language == AppLanguage.hi
                            ? 'पिकअप का अनुरोध करें?'
                            : AppLocalizations.of(context).language == AppLanguage.mr
                                ? 'पिकअपची विनंती करा?'
                                : 'Request Pickup?'),
                        content: Text(AppLocalizations.of(context).language == AppLanguage.hi
                            ? 'क्या आप वाकई ${recycler.name} को इस लॉट के लिए असाइन करना चाहते हैं?'
                            : AppLocalizations.of(context).language == AppLanguage.mr
                                ? 'तुम्हाला नक्की ${recycler.name} ला या लॉटसाठी नियुक्त करायचे आहे का?'
                                : 'Are you sure you want to assign ${recycler.name} for this lot?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(dialogContext),
                            child: Text(AppLocalizations.of(context).t('add_back'),
                                style: const TextStyle(color: Colors.grey)),
                          ),
                          ElevatedButton(
                            onPressed: () async {
                              Navigator.pop(dialogContext); // Close dialog only

                              // *** USE capturedLot from outer scope — no context re-read needed ***
                              final allLots = LocalStorageService.getAllLots();
                              Lot? lotToUpdate;

                              if (capturedLot != null) {
                                try {
                                  lotToUpdate = allLots.firstWhere((l) => l.lotId == capturedLot!.lotId);
                                } catch (_) {
                                  lotToUpdate = null;
                                }
                              } else {
                                final matToFind = material;
                                if (matToFind != null) {
                                  try {
                                    lotToUpdate = allLots.firstWhere(
                                      (lot) => lot.material == matToFind &&
                                          (lot.recyclerName == null ||
                                           lot.handoverStatus == 'declined' ||
                                           lot.handoverStatus == 'disputed' ||
                                           lot.handoverStatus == 'rejected'),
                                    );
                                  } catch (_) {
                                    lotToUpdate = null;
                                  }
                                }
                              }

                              if (lotToUpdate == null) {
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Please navigate from My Lots or Add E-waste to assign a lot.'),
                                    ),
                                  );
                                }
                                return;
                              }

                              // Fix old material name strings
                              if (lotToUpdate.material == 'Magnet' ||
                                  lotToUpdate.material == 'Magnet-Bearing' ||
                                  lotToUpdate.material == 'Magnet Assembly') {
                                lotToUpdate.material = 'Magnet-Bearing Assembly';
                              }

                              lotToUpdate.recyclerName = recycler.name;
                              lotToUpdate.handoverStatus = 'pickup_pending';

                              Batch? batchToUpdate;
                              try {
                                final batches = LocalStorageService.getBatches();
                                batchToUpdate = batches.firstWhere((b) => b.batchId == lotToUpdate!.batchId);
                                final lotIndex = batchToUpdate.lots.indexWhere((l) => l.lotId == lotToUpdate!.lotId);
                                if (lotIndex >= 0) {
                                  batchToUpdate.lots[lotIndex] = lotToUpdate;
                                }
                                if (batchToUpdate.status == 'disputed') {
                                  batchToUpdate.status = 'active';
                                }
                                await LocalStorageService.saveBatch(batchToUpdate);
                              } catch (e) {
                                print('Batch save error: $e');
                              }

                              // Supabase sync
                              try {
                                if (batchToUpdate != null) {
                                  await SupabaseSyncService.syncBatch(batchToUpdate!, LocalStorageService.getCollector());
                                }
                                await Supabase.instance.client.from('audit_logs').insert({
                                  'id': 'AL-${DateTime.now().millisecondsSinceEpoch}',
                                  'actor': 'Ramesh Kumar',
                                  'role': 'Collector',
                                  'action': 'Pickup Requested',
                                  'target': lotToUpdate.lotId,
                                  'changes': 'Requested pickup from ${recycler.name}',
                                  'facility_name': recycler.name,
                                }).catchError((_) {});
                                print('Successfully pushed lot to Supabase!');
                              } catch (e) {
                                print('Supabase Error: $e');
                              }

                              if (context.mounted) {
                                final finalLot = lotToUpdate;
                                final finalBatch = batchToUpdate;
                                showDialog(
                                  context: context,
                                  barrierDismissible: false,
                                  builder: (ctx) => AlertDialog(
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    title: Row(
                                      children: [
                                        const Icon(Icons.check_circle, color: Colors.green, size: 28),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Text(AppLocalizations.of(context).language == AppLanguage.hi
                                              ? 'पिकअप का अनुरोध किया गया!'
                                              : AppLocalizations.of(context).language == AppLanguage.mr
                                                  ? 'पिकअपची विनंती केली!'
                                                  : 'Pickup Requested!'),
                                        ),
                                      ],
                                    ),
                                    content: Text(
                                      AppLocalizations.of(context).language == AppLanguage.hi
                                          ? '${recycler.name} को आपके लॉट के लिए असाइन किया गया है।\n\nरिसाइकिलर द्वारा स्वीकार किए जाने पर आपको सूचित किया जाएगा।'
                                          : AppLocalizations.of(context).language == AppLanguage.mr
                                              ? '${recycler.name} ला तुमच्या लॉटसाठी नियुक्त केले आहे.\n\nरिसायकलरने स्वीकारल्यावर तुम्हाला सूचित केले जाईल.'
                                              : '${recycler.name} has been assigned for your lot.\n\nYou will be notified once the recycler accepts.',
                                    ),
                                    actions: [
                                      ElevatedButton(
                                        onPressed: () {
                                          Navigator.pushAndRemoveUntil(
                                            ctx,
                                            MaterialPageRoute(
                                              builder: (_) => const LotDetailsScreen(),
                                              settings: RouteSettings(
                                                arguments: {'lot': finalLot, 'batch': finalBatch},
                                              ),
                                            ),
                                            (route) => route.isFirst,
                                          );
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: AppTheme.primaryDark,
                                          foregroundColor: Colors.white,
                                        ),
                                        child: Text(AppLocalizations.of(context).language == AppLanguage.hi
                                            ? 'लॉट देखें'
                                            : AppLocalizations.of(context).language == AppLanguage.mr
                                                ? 'लॉट पहा'
                                                : 'View Lot'),
                                      ),
                                    ],
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF166534)),
                            child: Text(
                              AppLocalizations.of(context).t('rd_req_pickup'),
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF166534),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 6,
                  shadowColor: const Color(0xFF166534).withValues(alpha: 0.4),
                ),
                icon: const Icon(Icons.local_shipping, size: 24),
                label: Text(
                  AppLocalizations.of(context).t('rd_req_pickup'),
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                ),
              ),
            ],

            const SizedBox(height: 16),

            // Exact Address & Operating Hours
            AppCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.map_outlined, color: AppTheme.primaryMedium, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(AppLocalizations.of(context).t('rd_address'),
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            const SizedBox(height: 4),
                            Text('${recycler.name} Facility,\n${recycler.location}',
                                style: const TextStyle(color: AppTheme.textDark, fontSize: 14)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.access_time, color: AppTheme.primaryMedium, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(AppLocalizations.of(context).t('rd_operating_hours'),
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            const SizedBox(height: 4),
                            Text(AppLocalizations.of(context).t('rd_hours_desc'),
                                style: const TextStyle(color: AppTheme.textDark, fontSize: 14)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Official Authorization Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.verified_user, color: Color(0xFF15803D), size: 20),
                      const SizedBox(width: 8),
                      Text(
                        AppLocalizations.of(context).t('rd_verified'),
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF15803D),
                        ),
                      ),
                      const Spacer(),
                      StatusBadge.green(AppLocalizations.of(context).t('rd_active')),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '${AppLocalizations.of(context).t('rd_reg_no')}${recycler.authorization}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    AppLocalizations.of(context).t('rd_auth_by'),
                    style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Quick Actions
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final url = Uri.parse('tel:1234567890');
                      if (await canLaunchUrl(url)) {
                        await launchUrl(url);
                      }
                    },
                    icon: const Icon(Icons.phone),
                    label: Text(AppLocalizations.of(context).t('rd_phone')),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.purpleMedium,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: AppTheme.purpleMedium),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final query = Uri.encodeComponent(recycler.location);
                      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$query');
                      try {
                        await launchUrl(url, mode: LaunchMode.externalApplication);
                      } catch (_) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Could not open Maps')),
                          );
                        }
                      }
                    },
                    icon: const Icon(Icons.location_on, color: Colors.red),
                    label: Text(AppLocalizations.of(context).t('rd_directions')),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.purpleMedium,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: AppTheme.purpleMedium),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Service Area
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppTheme.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Row(
                children: [
                  Icon(
                    recycler.pickupAvailable ? Icons.local_shipping : Icons.store_mall_directory,
                    color: recycler.pickupAvailable ? AppTheme.green : AppTheme.orange,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    recycler.pickupAvailable
                        ? AppLocalizations.of(context).t('rd_comes_area')
                        : AppLocalizations.of(context).t('rd_drop_only'),
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: recycler.pickupAvailable ? const Color(0xFF15803D) : const Color(0xFFC2410C),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Materials Accepted & Rates
            Text(
              AppLocalizations.of(context).t('rd_acc_mat'),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            AppCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: (() {
                  var mats = recycler.materials.toList();
                  mats.sort((a, b) {
                    final priceA = recycler.customPrices?[a] ??
                        mockPrices.firstWhere((p) => p.category == a, orElse: () => mockPrices.first).pricePerKg;
                    final priceB = recycler.customPrices?[b] ??
                        mockPrices.firstWhere((p) => p.category == b, orElse: () => mockPrices.first).pricePerKg;
                    return priceB.compareTo(priceA);
                  });
                  return mats.map((m) {
                    final basePrice = mockPrices.firstWhere(
                      (p) => p.category == m,
                      orElse: () => PriceItem(
                          category: m,
                          description: '',
                          pricePerKg: 0,
                          trend: 'stable',
                          trendPercent: 0,
                          imageUrl: ''),
                    );
                    final displayPrice = recycler.customPrices?[m] ?? basePrice.pricePerKg;

                    return Column(
                      children: [
                        ListTile(
                          leading: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: AppTheme.purpleBg,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            clipBehavior: Clip.hardEdge,
                            child: basePrice.imageUrl.isNotEmpty
                                ? Image.asset(basePrice.imageUrl,
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) =>
                                        const Icon(Icons.recycling, color: AppTheme.purpleMedium))
                                : const Icon(Icons.recycling, color: AppTheme.purpleMedium),
                          ),
                          title: Text(
                            AppLocalizations.of(context).translateMaterial(m),
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                          ),
                          trailing: Text(
                            displayPrice > 0
                                ? '₹$displayPrice${AppLocalizations.of(context).t('unit_per_kg')}'
                                : AppLocalizations.of(context).t('rd_varies'),
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.purpleDark,
                            ),
                          ),
                        ),
                        if (m != mats.last)
                          const Divider(height: 1, indent: 16, endIndent: 16, color: AppTheme.borderLight),
                      ],
                    );
                  }).toList();
                })(),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
