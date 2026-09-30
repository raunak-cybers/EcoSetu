import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../data/mock_data.dart';
import '../data/local_storage.dart';
import '../core/localization.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({Key? key}) : super(key: key);

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _syncPayments();
  }

  Future<void> _syncPayments() async {
    try {
      final response = await Supabase.instance.client
          .from('lots')
          .select('lot_id, material, declared_weight, verified_weight, final_price, indicative_value, recycler_name, handover_status, updated_at');
      
      if (response != null && response is List) {
        final payments = LocalStorageService.getPayments();
        bool changed = false;

        for (var row in response) {
          final lotId = row['lot_id'] as String?;
          final status = row['handover_status'] as String?;
          final finalPrice = row['final_price'];
          final verifiedWeight = row['verified_weight'];
          final declaredWeight = row['declared_weight'];
          final indicativeVal = row['indicative_value'];
          final recycler = row['recycler_name'] as String? ?? 'Green Recycle Hub';
          final mat = row['material'] as String? ?? 'E-Waste';

          if (lotId != null && (status == 'paid' || status == 'settled')) {
            final existingIdx = payments.indexWhere((p) => p.lotId == lotId);
            final amount = finalPrice != null 
                ? (finalPrice as num).toInt() 
                : (indicativeVal != null ? (indicativeVal as num).toInt() : 1500);
            final weight = verifiedWeight != null 
                ? (verifiedWeight as num).toInt() 
                : (declaredWeight != null ? (declaredWeight as num).toInt() : 10);

            if (existingIdx >= 0) {
              if (payments[existingIdx].status != 'received' || payments[existingIdx].amount != amount) {
                payments[existingIdx] = Payment(
                  id: payments[existingIdx].id,
                  amount: amount,
                  recycler: recycler,
                  date: payments[existingIdx].date,
                  weight: weight,
                  unit: 'kg',
                  material: mat,
                  status: 'received',
                  referenceId: 'REF-$lotId',
                  lotId: lotId,
                );
                changed = true;
              }
            } else {
              payments.insert(0, Payment(
                id: 'PAY-${DateTime.now().millisecondsSinceEpoch}',
                amount: amount,
                recycler: recycler,
                date: 'Today',
                weight: weight,
                unit: 'kg',
                material: mat,
                status: 'received',
                referenceId: 'REF-$lotId',
                lotId: lotId,
              ));
              changed = true;
            }
          }
        }

        if (changed) {
          await LocalStorageService.savePayments(payments);
          if (mounted) setState(() {});
        }
      }
    } catch (e) {
      print('[PaymentsScreen] Sync error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final allPayments = LocalStorageService.getPayments();
    final total = allPayments
        .where((p) => p.status == 'received')
        .fold(0, (sum, p) => sum + p.amount);
    final pending = allPayments
        .where((p) => p.status == 'pending')
        .fold(0, (sum, p) => sum + p.amount);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).t('pay_title')),
        backgroundColor: AppTheme.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: _syncPayments,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: AppCard(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: const BoxDecoration(
                            color: AppTheme.accentGreen,
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Text('💰', style: TextStyle(fontSize: 24)),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          AppLocalizations.of(context).t('pay_received_title'),
                          style: const TextStyle(color: AppTheme.textGray, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Text(
                            '₹$total',
                            style: const TextStyle(
                              color: AppTheme.primaryDark,
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        ListenButton(text: AppLocalizations.of(context).language == AppLanguage.hi
                            ? 'आपको $total रुपये प्राप्त हुए हैं, और $pending रुपये लंबित हैं।'
                            : AppLocalizations.of(context).language == AppLanguage.mr
                                ? 'तुम्हाला $total रुपये प्राप्त झाले आहेत, आणि $pending रुपये प्रलंबित आहेत.'
                                : 'You have received $total rupees, and $pending rupees is pending.'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: AppCard(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: const BoxDecoration(
                            color: AppTheme.accentOrange,
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Text('⏳', style: TextStyle(fontSize: 24)),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          AppLocalizations.of(context).t('pay_pending_title'),
                          style: const TextStyle(color: AppTheme.textGray, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Text(
                            '₹$pending',
                            style: const TextStyle(
                              color: AppTheme.primaryDark,
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              AppLocalizations.of(context).t('pay_recent'),
              style: const TextStyle(
                color: AppTheme.primaryDark,
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            if (allPayments.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 40),
                  child: Column(
                    children: [
                      Icon(Icons.receipt_long_outlined, size: 64, color: AppTheme.textGray.withValues(alpha: 0.5)),
                      const SizedBox(height: 16),
                      Text('No payments yet', style: TextStyle(color: AppTheme.textSecondary, fontSize: 16)),
                    ],
                  ),
                ),
              )
            else
              ...allPayments.map((payment) {
              final isReceived = payment.status == 'received';
              return Padding(
                padding: const EdgeInsets.only(bottom: 10.0),
                child: GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/payment-detail',
                      arguments: payment),
                  child: AppCard(
                    padding: const EdgeInsets.all(12.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isReceived
                                ? AppTheme.accentGreen
                                : AppTheme.accentOrange,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isReceived ? Icons.check_circle : Icons.access_time,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '₹${payment.amount}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.primaryDark,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                payment.recycler,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: AppTheme.primaryDark,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${payment.date}\n${payment.weight}${payment.unit} • ${payment.material}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: AppTheme.textGray,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            StatusBadge.withColor(
                              text: isReceived ? AppLocalizations.of(context).t('pay_received') : AppLocalizations.of(context).t('pay_pending_title'),
                              color: isReceived
                                  ? AppTheme.accentGreen
                                  : AppTheme.accentOrange,
                            ),
                            const SizedBox(height: 8),
                            const Row(
                              children: [
                                Icon(Icons.chevron_right, color: AppTheme.textGray, size: 20),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
            const SizedBox(height: 16),
            AppCard(
              color: AppTheme.purpleBg,
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryMedium,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.headset_mic, color: AppTheme.white),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          AppLocalizations.of(context).t('pay_help'),
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryDark,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          AppLocalizations.of(context).t('pay_help_desc'),
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppTheme.textGray,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: AppTheme.textGray),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
}
