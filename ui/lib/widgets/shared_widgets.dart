import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../services/tts_service.dart';
import '../core/localization.dart';
import 'package:flutter/services.dart';
import '../data/local_storage.dart';

class LanguageToggleChip extends StatelessWidget {
  const LanguageToggleChip({super.key});

  String _getLanguageLabel(AppLanguage lang) {
    switch (lang) {
      case AppLanguage.hi: return "हिंदी";
      case AppLanguage.mr: return "मराठी";
      case AppLanguage.en:
      default: return "English";
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<AppLanguage>(
      onSelected: (AppLanguage newLang) {
        HapticFeedback.selectionClick();
        AppLocalizations.of(context).changeLanguage(newLang);
        final langCode = newLang == AppLanguage.hi ? "hi-IN" : newLang == AppLanguage.mr ? "mr-IN" : "en-IN";
        TtsService().setLanguage(langCode);
      },
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      offset: const Offset(0, 48),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(24),
        ),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'A/अ', 
              style: TextStyle(
                color: AppColors.purpleDark,
                fontWeight: FontWeight.w900,
                fontSize: 16,
                letterSpacing: 1.0,
              )
            ),
            SizedBox(width: 4),
            Icon(Icons.keyboard_arrow_down, color: AppColors.purpleDark, size: 18),
          ],
        ),
      ),
      itemBuilder: (context) {
        final currentLang = AppLocalizations.of(context).language;
        return [
          PopupMenuItem(
            value: AppLanguage.en,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("English", style: TextStyle(fontWeight: FontWeight.w600)),
                if (currentLang == AppLanguage.en) const Icon(Icons.check, color: AppColors.purpleDark, size: 18),
              ],
            ),
          ),
          PopupMenuItem(
            value: AppLanguage.hi,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("हिंदी", style: TextStyle(fontWeight: FontWeight.w600)),
                if (currentLang == AppLanguage.hi) const Icon(Icons.check, color: AppColors.purpleDark, size: 18),
              ],
            ),
          ),
          PopupMenuItem(
            value: AppLanguage.mr,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("मराठी", style: TextStyle(fontWeight: FontWeight.w600)),
                if (currentLang == AppLanguage.mr) const Icon(Icons.check, color: AppColors.purpleDark, size: 18),
              ],
            ),
          ),
        ];
      }
    );
  }
}


// ── App Header (used in main scaffold) ───────────────────────────
class EcoSetuAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback? onProfileTap;
  
  const EcoSetuAppBar({
    super.key, 
    this.onProfileTap,
  });

  String _getLanguageLabel(AppLanguage lang) {
    switch (lang) {
      case AppLanguage.hi: return 'हिंदी';
      case AppLanguage.mr: return 'मराठी';
      case AppLanguage.en:
      default: return 'English';
    }
  }

  @override
  Size get preferredSize => const Size.fromHeight(80.0);

  @override
  Widget build(BuildContext context) {
    final collector = LocalStorageService.getCollector();
    final parts = collector.name.split(' ');
    final initials = parts.length > 1 && parts[0].isNotEmpty && parts[1].isNotEmpty ? '${parts[0][0]}${parts[1][0]}' : (parts.isNotEmpty && parts[0].isNotEmpty ? parts[0][0] : 'U');

    return AppBar(
      toolbarHeight: 80.0,
      backgroundColor: Colors.white,
      elevation: 0,
      shadowColor: const Color(0x1A000000),
      surfaceTintColor: Colors.transparent,
      titleSpacing: 0,
      leadingWidth: 72,
      leading: GestureDetector(
        onTap: onProfileTap,
        child: Padding(
          padding: const EdgeInsets.only(left: 16, top: 16, bottom: 16, right: 8),
          child: Container(
            decoration: const BoxDecoration(
              color: AppColors.purpleDark,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(initials.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
            ),
          ),
        ),
      ),
      title: GestureDetector(
        onTap: onProfileTap,
        behavior: HitTestBehavior.opaque,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(collector.name,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textDark)),
            const SizedBox(height: 2),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.location_on, size: 16, color: AppColors.purpleDark),
                const SizedBox(width: 4),
                Text(collector.operatingArea,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.purpleDark)),
                const SizedBox(width: 4),
                const Icon(Icons.keyboard_arrow_down, size: 20, color: AppColors.purpleDark),
              ],
            ),
          ],
        ),
      ),
      actions: [
        const Padding(
          padding: EdgeInsets.only(right: 16),
          child: Center(
            child: LanguageToggleChip(),
          ),
        ),
      ],
    );
  }
}

// ── Status Badge ─────────────────────────────────────────────────
class StatusBadge extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final Color textColor;

  const StatusBadge({
    super.key,
    required this.label,
    required this.backgroundColor,
    required this.textColor,
  });

  /// Used by payments_screen: StatusBadge(text: '...', color: Colors.green)
  factory StatusBadge.withColor({Key? key, required String text, required Color color}) {
    return StatusBadge(
      key: key,
      label: text,
      backgroundColor: color.withValues(alpha: 0.15),
      textColor: color,
    );
  }

  factory StatusBadge.green(String label) => StatusBadge(
    label: label,
    backgroundColor: AppColors.greenLight,
    textColor: const Color(0xFF15803D),
  );

  factory StatusBadge.orange(String label) => StatusBadge(
    label: label,
    backgroundColor: AppColors.orangeLight,
    textColor: const Color(0xFFC2410C),
  );

  factory StatusBadge.red(String label) => StatusBadge(
    label: label,
    backgroundColor: AppColors.redLight,
    textColor: const Color(0xFFDC2626),
  );

  factory StatusBadge.purple(String label) => StatusBadge(
    label: label,
    backgroundColor: AppColors.purpleBg,
    textColor: AppColors.purpleMedium,
  );

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textColor)),
    );
  }
}

// ── App Card ─────────────────────────────────────────────────────
class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final VoidCallback? onTap;
  final Color? color;

  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: margin,
        decoration: BoxDecoration(
          color: color ?? Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2)),
          ],
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Padding(
          padding: padding ?? const EdgeInsets.all(16),
          child: child,
        ),
      ),
    );
  }
}

// ── Listen Button ─────────────────────────────────────────────────
class ListenButton extends StatelessWidget {
  final String text;
  
  const ListenButton({
    super.key, 
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    if (!AppLocalizations.of(context).isVoiceModeEnabled) {
      return const SizedBox.shrink();
    }
    
    return GestureDetector(
      onTap: () {
        TtsService().speak(text);
      },
      child: Container(
        margin: const EdgeInsets.only(left: 8),
        padding: const EdgeInsets.all(8),
        decoration: const BoxDecoration(
          color: AppColors.purpleBg,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.volume_up, size: 24, color: AppColors.purpleMedium),
      ),
    );
  }
}

// ── Toggle Setting Row ─────────────────────────────────────────────
class SettingRow extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final bool? toggleValue;
  final ValueChanged<bool>? onToggle;
  final VoidCallback? onTap;

  const SettingRow({
    super.key,
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    this.toggleValue,
    this.onToggle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        if (onTap != null) {
          onTap!();
        } else if (onToggle != null && toggleValue != null) {
          onToggle!(!toggleValue!);
        }
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTextStyles.bodyLarge.copyWith(fontWeight: FontWeight.w600, fontSize: 15)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: AppTextStyles.bodyMedium),
                ],
              ),
            ),
            if (toggleValue != null && onToggle != null)
              Switch(
                value: toggleValue!,
                onChanged: onToggle,
                activeThumbColor: AppColors.purpleMedium,
              )
            else
              const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}


