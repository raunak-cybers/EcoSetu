import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/shared_widgets.dart';
import '../main.dart';
import '../data/local_storage.dart';
import '../core/localization.dart';

class ProfileScreen extends StatefulWidget {
  final void Function(int, {String? category})? onTabSelected;
  final VoidCallback? onNotificationToggled;
  
  const ProfileScreen({super.key, this.onTabSelected, this.onNotificationToggled});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _notifications = LocalStorageService.getNotifications();

  String _formatCurrency(int amount) {
    final format = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    return format.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    final collector = LocalStorageService.getCollector();
    final allLots = LocalStorageService.getAllLots();
    final payments = LocalStorageService.getPayments();
    
    final realTotalLots = allLots.length;
    final realTotalEarnings = payments.where((p) => p.status == 'received').fold(0, (sum, p) => sum + p.amount);
    final realCompleted = allLots.where((l) => l.handoverStatus == 'handed_over' || l.handoverStatus == 'paid').length;
    final topPadding = MediaQuery.of(context).padding.top;
    
    return SingleChildScrollView(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. HERO BANNER
          Container(
            width: double.infinity,
            padding: EdgeInsets.only(top: topPadding > 0 ? topPadding + 16 : 48, left: 24, right: 24, bottom: 64),
            decoration: const BoxDecoration(
              color: AppTheme.primaryDark,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Avatar
                Stack(
                  children: [
                    Container(
                      width: 72,
                      height: 72,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        collector.initials,
                        style: const TextStyle(
                          color: Color(0xFF002244),
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 4,
                      child: Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF002244), width: 3),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 16),
                // Name & Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        collector.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Collector • ES-1024',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 14, color: Colors.white70),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              collector.location,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                color: Colors.white70,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Edit Button
                OutlinedButton.icon(
                  onPressed: () {
                    Navigator.pushNamed(context, '/edit-profile');
                  },
                  icon: const Icon(Icons.edit, size: 14, color: Colors.white),
                  label: const Text('Edit', style: TextStyle(color: Colors.white, fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: Colors.white.withOpacity(0.4)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                ),
              ],
            ),
          ),
          
          // 2. OVERLAPPING ANALYTICS CARD
          Transform.translate(
            offset: const Offset(0, -32),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 16,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    child: Row(
                      children: [
                        Expanded(child: _buildNewStatColumn(context, realTotalLots.toString(), AppLocalizations.of(context).t('profile_total_lots'), Icons.inventory_2_outlined, const Color(0xFF3B82F6), const Color(0xFFEFF6FF), onTap: () {
                          if (widget.onTabSelected != null) {
                            widget.onTabSelected!(1, category: 'all');
                          } else {
                            Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MainShell(initialIndex: 1, initialCategory: 'all')));
                          }
                        })),
                        const SizedBox(height: 60, child: VerticalDivider(color: AppTheme.borderLight)),
                        Expanded(child: _buildNewStatColumn(context, _formatCurrency(realTotalEarnings), AppLocalizations.of(context).t('profile_total_earnings'), Icons.currency_rupee, const Color(0xFF10B981), const Color(0xFFECFDF5), onTap: () {
                          if (widget.onTabSelected != null) {
                            widget.onTabSelected!(2);
                          } else {
                            Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MainShell(initialIndex: 2)));
                          }
                        })),
                        const SizedBox(height: 60, child: VerticalDivider(color: AppTheme.borderLight)),
                        Expanded(child: _buildNewStatColumn(context, realCompleted.toString(), AppLocalizations.of(context).t('profile_completed'), Icons.check_circle_outline, const Color(0xFFF59E0B), const Color(0xFFFFFBEB), onTap: () {
                          if (widget.onTabSelected != null) {
                            widget.onTabSelected!(1, category: 'completed');
                          } else {
                            Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MainShell(initialIndex: 1, initialCategory: 'completed')));
                          }
                        })),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // 4. Settings Section
          Text(
            AppLocalizations.of(context).t('profile_settings'),
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          
          // 5. Settings Card
          AppCard(
            padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 8),
            child: Column(
              children: [
                SettingRow(
                  icon: Icons.language,
                  iconColor: AppTheme.textSecondary,
                  title: AppLocalizations.of(context).t('profile_lang'),
                  subtitle: AppLocalizations.of(context).t('profile_lang_desc'),
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                      ),
                      builder: (context) => Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AppLocalizations.of(context).t('label_select_language'),
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                            ),
                            const SizedBox(height: 16),
                            ...AppLanguage.values.map((lang) {
                              String langName = lang == AppLanguage.en ? 'English' : lang == AppLanguage.hi ? 'हिंदी' : 'मराठी';
                              bool isSelected = AppLocalizations.of(context).language == lang;
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8.0),
                                child: InkWell(
                                  onTap: () {
                                    AppLocalizations.of(context).changeLanguage(lang);
                                    Navigator.pop(context);
                                  },
                                  borderRadius: BorderRadius.circular(12),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                    decoration: BoxDecoration(
                                      border: Border.all(color: isSelected ? AppTheme.primaryDark : AppTheme.borderLight, width: isSelected ? 2 : 1),
                                      borderRadius: BorderRadius.circular(12),
                                      color: isSelected ? AppTheme.primaryLight.withValues(alpha: 0.1) : Colors.transparent,
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(langName, style: TextStyle(fontSize: 16, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: isSelected ? AppTheme.primaryDark : AppTheme.textDark)),
                                        if (isSelected) const Icon(Icons.check_circle, color: AppTheme.primaryDark),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            }),
                            const SizedBox(height: 8),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                const Divider(height: 1, color: AppTheme.borderLight),
                SettingRow(
                  icon: Icons.volume_up,
                  iconColor: AppTheme.purpleMedium,
                  title: AppLocalizations.of(context).t('profile_voice_mode'),
                  subtitle: AppLocalizations.of(context).t('profile_voice_mode_desc'),
                  toggleValue: AppLocalizations.of(context).isVoiceModeEnabled,
                  onToggle: (val) => AppLocalizations.of(context).toggleVoiceMode(),
                ),
                const Divider(height: 1, color: AppTheme.borderLight),
                SettingRow(
                  icon: Icons.notifications,
                  iconColor: AppTheme.accentOrange,
                  title: AppLocalizations.of(context).t('profile_notif'),
                  subtitle: AppLocalizations.of(context).t('profile_notif_desc'),
                  toggleValue: _notifications,
                  onToggle: (val) {
                    setState(() => _notifications = val);
                    LocalStorageService.saveNotifications(val);
                    if (widget.onNotificationToggled != null) widget.onNotificationToggled!();
                  },
                ),
                const Divider(height: 1, color: AppTheme.borderLight),
                SettingRow(
                  icon: Icons.health_and_safety_outlined,
                  iconColor: AppTheme.accentGreen,
                  title: AppLocalizations.of(context).t('profile_safety'),
                  subtitle: AppLocalizations.of(context).t('profile_safety_desc'),
                  onTap: () {
                    Navigator.pushNamed(context, '/safety-tips');
                  },
                ),
                const Divider(height: 1, color: AppTheme.borderLight),
                SettingRow(
                  icon: Icons.help_outline,
                  iconColor: Colors.blue,
                  title: AppLocalizations.of(context).t('profile_help'),
                  subtitle: AppLocalizations.of(context).t('profile_help_desc'),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(AppLocalizations.of(context).t('toast_help_soon'))),
                    );
                  },
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // 6. Log out button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: OutlinedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    title: Text(AppLocalizations.of(context).language == AppLanguage.hi ? 'लॉग आउट करें?' : AppLocalizations.of(context).language == AppLanguage.mr ? 'लॉग आउट करा?' : 'Log Out?'),
                    content: Text(AppLocalizations.of(context).language == AppLanguage.hi ? 'क्या आप वाकई लॉग आउट करना चाहते हैं?' : AppLocalizations.of(context).language == AppLanguage.mr ? 'तुम्हाला नक्की लॉग आउट करायचे आहे का?' : 'Are you sure you want to log out?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: Text(AppLocalizations.of(context).t('add_back'), style: const TextStyle(color: Colors.grey)),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          LocalStorageService.clearAll();
                          Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.accentRed),
                        child: Text(AppLocalizations.of(context).t('profile_logout'), style: const TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                );
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.accentRed,
                side: const BorderSide(color: AppTheme.accentRed),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.logout, color: AppTheme.accentRed, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    AppLocalizations.of(context).t('profile_logout'),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
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

  Widget _buildNewStatColumn(
    BuildContext context,
    String value,
    String label,
    IconData icon,
    Color color,
    Color bgColor,
    {VoidCallback? onTap}
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: bgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                value,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textDark,
                ),
                maxLines: 1,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}


