import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../core/localization.dart';
import '../widgets/shared_widgets.dart';

class HandoverRecordScreen extends StatelessWidget {
  const HandoverRecordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>? ?? {};
    final lot = args['lot'] as Lot? ?? mockLots[0];
    final recyclerName = args['recyclerName'] as String? ?? 'Green Recycle Hub';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).t('hr_title')),
        backgroundColor: AppTheme.white,
        foregroundColor: AppTheme.primaryDark,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Booking Confirmed Header
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    AppLocalizations.of(context).t('hr_booking'),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF15803D), // Green
                    ),
                  ),
                  const SizedBox(width: 8),
                  ListenButton(
                    text: '${AppLocalizations.of(context).t('hr_booking')}. ${AppLocalizations.of(context).t('hr_pickup_today')}${recyclerName}${AppLocalizations.of(context).t('hr_today')}.',
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                AppLocalizations.of(context).language == AppLanguage.hi 
                  ? '${recyclerName} ${AppLocalizations.of(context).t('hr_pickup_today')}${AppLocalizations.of(context).t('hr_today')}' 
                  : '${AppLocalizations.of(context).t('hr_pickup_today')}${recyclerName}${AppLocalizations.of(context).t('hr_today')}',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),

              // Large QR Code
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: const [
                    BoxShadow(color: Color(0x0F000000), blurRadius: 16, offset: Offset(0, 8)),
                  ],
                ),
                child: QrImageView(
                  data: 'https://ecosetu.com/verify?txn=${lot.lotId}',
                  version: QrVersions.auto,
                  size: 200.0,
                ),
              ),
              const SizedBox(height: 32),

              // Instructions (English & Hindi)
              Text(
                AppLocalizations.of(context).t('hr_show_qr'),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                AppLocalizations.of(context).t('hr_show_qr_sub'),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 24),

              // Reference Pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9), // Light Slate
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      '# ',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    Text(
                      lot.lotId,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textDark,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 32),

              // Single confirmation line
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.check, color: Color(0xFF15803D), size: 20),
                  const SizedBox(width: 8),
                  Text(
                    AppLocalizations.of(context).t('hr_saved'),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Done Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.popUntil(context, (route) => route.isFirst);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.purpleMedium,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: Text(
                    AppLocalizations.of(context).t('hr_done'),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
      ),
    );
  }
}

