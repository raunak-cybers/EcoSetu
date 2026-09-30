import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../data/mock_data.dart';
import '../data/local_storage.dart';
import '../core/localization.dart';

class PaymentDetailScreen extends StatelessWidget {
  const PaymentDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final allPayments = LocalStorageService.getPayments();
    final defaultPayment = allPayments.isNotEmpty ? allPayments[0] : Payment(id: '0', amount: 0, recycler: '', date: '', weight: 0, unit: '', material: '', status: '', referenceId: '');
    final payment = (ModalRoute.of(context)!.settings.arguments as Payment?) ?? defaultPayment;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).t('pd_title')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 24),
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: payment.status == 'received'
                    ? const Color(0xFFDCFCE7)
                    : const Color(0xFFFFF7ED),
                shape: BoxShape.circle,
              ),
              child: Icon(
                payment.status == 'received'
                    ? Icons.check_circle
                    : Icons.access_time,
                color: payment.status == 'received'
                    ? const Color(0xFF22C55E)
                    : const Color(0xFFF97316),
                size: 48,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              payment.status == 'received' ? AppLocalizations.of(context).t('pd_received') : AppLocalizations.of(context).t('pd_pending'),
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: payment.status == 'received'
                    ? const Color(0xFF22C55E)
                    : const Color(0xFFF97316),
              ),
            ),
            Text(
              payment.status == 'received'
                  ? AppLocalizations.of(context).t('pd_you_received')
                  : AppLocalizations.of(context).t('pd_awaiting'),
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '₹${payment.amount}',
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1B1464),
              ),
            ),
            const SizedBox(height: 12),
            ListenButton(text: AppLocalizations.of(context).language == AppLanguage.hi
                ? '${payment.recycler} से ${payment.amount} रुपये का भुगतान ${payment.status == 'received' ? "प्राप्त हुआ" : "लंबित है"}'
                : AppLocalizations.of(context).language == AppLanguage.mr
                    ? '${payment.recycler} कडून ${payment.amount} रुपयांचे पेमेंट ${payment.status == 'received' ? "प्राप्त झाले" : "प्रलंबित आहे"}'
                    : '${payment.status == 'received' ? 'Received' : 'Pending'} payment of ${payment.amount} rupees from ${payment.recycler}'),
            const SizedBox(height: 24),
            AppCard(
              child: Column(
                children: [
                  _DetailRow(
                    icon: Icons.account_balance,
                    iconColor: const Color(0xFF4A3AFF),
                    label: AppLocalizations.of(context).t('pd_from'),
                    value: payment.recycler,
                  ),
                  const Divider(height: 1),
                  _DetailRow(
                    icon: Icons.calendar_today,
                    iconColor: Colors.blue,
                    label: AppLocalizations.of(context).t('pd_date'),
                    value: payment.date,
                  ),
                  const Divider(height: 1),
                  _DetailRow(
                    icon: Icons.inventory_2,
                    iconColor: const Color(0xFFF97316),
                    label: AppLocalizations.of(context).t('pd_ewaste_coll'),
                    value: '${payment.weight} ${payment.unit}',
                  ),
                  const Divider(height: 1),
                  _DetailRow(
                    icon: Icons.category,
                    iconColor: const Color(0xFF22C55E),
                    label: AppLocalizations.of(context).t('pd_material'),
                    value: payment.material,
                  ),
                  const Divider(height: 1),
                  _DetailRow(
                    icon: Icons.tag,
                    iconColor: Colors.grey,
                    label: AppLocalizations.of(context).t('pd_ref_id'),
                    value: payment.referenceId,
                  ),
                  const Divider(height: 1),
                  _DetailRow(
                    icon: Icons.qr_code,
                    iconColor: Colors.grey,
                    label: AppLocalizations.of(context).t('label_lot_id'),
                    value: payment.lotId ?? AppLocalizations.of(context).t('label_na'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            AppCard(
              color: const Color(0xFFDCFCE7),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFF22C55E)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      AppLocalizations.of(context).t('pd_transferred_msg'),
                      style: const TextStyle(
                        color: Color(0xFF15803D),
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF22C55E),
                  foregroundColor: Colors.white,
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(AppLocalizations.of(context).t('pd_calling_support'))),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.phone),
                    const SizedBox(width: 8),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          AppLocalizations.of(context).t('pd_call_support'),
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          AppLocalizations.of(context).t('pd_talk_team'),
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.white.withValues(alpha: 0.8),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(AppLocalizations.of(context).t('pd_view_all')),
                    const Icon(Icons.chevron_right),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  const _DetailRow({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: iconColor),
          const SizedBox(width: 14),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF6B7280),
              fontSize: 13,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Color(0xFF1B1464),
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

