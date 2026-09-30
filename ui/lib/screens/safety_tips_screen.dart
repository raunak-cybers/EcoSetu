import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';

class SafetyTipsScreen extends StatelessWidget {
  const SafetyTipsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textDark,
        elevation: 0,
        title: Text(
          AppLocalizations.of(context).t('safe_title'),
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            AppLocalizations.of(context).t('safe_desc'),
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: AppTheme.primaryDark,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            AppLocalizations.of(context).t('safe_sub'),
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 24),
          
          _buildSafetyCard(
            context: context,
            title: AppLocalizations.of(context).t('safe_gear'),
            description: AppLocalizations.of(context).t('safe_gear_desc'),
            icon: Icons.masks,
            color: AppTheme.accentGreen,
            isWarning: false,
          ),
          
          _buildSafetyCard(
            context: context,
            title: AppLocalizations.of(context).t('safe_burn'),
            description: AppLocalizations.of(context).t('safe_burn_desc'),
            icon: Icons.local_fire_department,
            color: AppTheme.accentRed,
            isWarning: false,
          ),
          
          _buildSafetyCard(
            context: context,
            title: AppLocalizations.of(context).t('safe_batt'),
            description: AppLocalizations.of(context).t('safe_batt_desc'),
            icon: Icons.battery_alert,
            color: AppTheme.accentOrange,
            isWarning: false,
          ),
          
          _buildSafetyCard(
            context: context,
            title: AppLocalizations.of(context).t('safe_crt'),
            description: AppLocalizations.of(context).t('safe_crt_desc'),
            icon: Icons.tv_off,
            color: AppTheme.purpleMedium,
            isWarning: false,
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyCard({
    required BuildContext context,
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required bool isWarning,
  }) {
    return AppCard(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textDark,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ListenButton(text: '$title. $description'),
                    if (isWarning)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.accentRed.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          AppLocalizations.of(context).t('safe_danger'),
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.accentRed,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.textSecondary,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
