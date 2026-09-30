import 'package:flutter/material.dart';

// ── Color Palette ────────────────────────────────────────────────
class AppColors {
  AppColors._();
  static const purpleDark   = Color(0xFF1B1464);
  static const purpleMedium = Color(0xFF4A3AFF);
  static const purpleLight  = Color(0xFF6C63FF);
  static const purpleBg     = Color(0xFFF0EEFF);
  static const green        = Color(0xFF22C55E);
  static const greenLight   = Color(0xFFDCFCE7);
  static const orange       = Color(0xFFF97316);
  static const orangeLight  = Color(0xFFFFF7ED);
  static const red          = Color(0xFFEF4444);
  static const redLight     = Color(0xFFFEF2F2);
  static const background   = Color(0xFFF8F7FC);
  static const cardBg       = Colors.white;
  static const textDark     = Color(0xFF1B1464);
  static const textPrimary  = Color(0xFF111827);
  static const textSecondary= Color(0xFF6B7280);
  static const textMuted    = Color(0xFF9CA3AF);
  static const border       = Color(0xFFE5E7EB);
  static const borderLight  = Color(0xFFF3F4F6);
}

class AppTheme {
  AppTheme._();
  static const primaryDark   = AppColors.purpleDark;
  static const primaryMedium = AppColors.purpleMedium;
  static const primaryLight  = AppColors.purpleLight;
  static const purpleDark    = AppColors.purpleDark;
  static const purpleMedium  = AppColors.purpleMedium;
  static const purpleLight   = AppColors.purpleLight;
  static const purpleBg      = AppColors.purpleBg;
  static const accentGreen   = AppColors.green;
  static const accentOrange  = AppColors.orange;
  static const accentRed     = AppColors.red;
  static const green         = AppColors.green;
  static const greenLight    = AppColors.greenLight;
  static const orange        = AppColors.orange;
  static const orangeLight   = AppColors.orangeLight;
  static const red           = AppColors.red;
  static const redLight      = AppColors.redLight;
  static const background    = AppColors.background;
  static const cardBg        = AppColors.cardBg;
  static const textDark      = AppColors.textDark;
  static const white         = Colors.white;
  static const textGray      = AppColors.textSecondary;
  static const textPrimary   = AppColors.textPrimary;
  static const textSecondary = AppColors.textSecondary;
  static const textMuted     = AppColors.textMuted;
  static const border        = AppColors.border;
  static const borderLight   = AppColors.borderLight;
}



// ── Text Styles ──────────────────────────────────────────────────
class AppTextStyles {
  AppTextStyles._();

  static const heading1 = TextStyle(
    fontSize: 28, fontWeight: FontWeight.w800,
    color: AppColors.textDark, height: 1.2,
  );
  static const heading2 = TextStyle(
    fontSize: 22, fontWeight: FontWeight.w700,
    color: AppColors.textDark,
  );
  static const heading3 = TextStyle(
    fontSize: 18, fontWeight: FontWeight.w700,
    color: AppColors.textDark,
  );
  static const bodyLarge = TextStyle(
    fontSize: 16, fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
  );
  static const bodyMedium = TextStyle(
    fontSize: 14, fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );
  static const bodySmall = TextStyle(
    fontSize: 12, fontWeight: FontWeight.w400,
    color: AppColors.textMuted,
  );
  static const price = TextStyle(
    fontSize: 24, fontWeight: FontWeight.w800,
    color: AppColors.textDark,
  );
  static const priceLarge = TextStyle(
    fontSize: 32, fontWeight: FontWeight.w800,
    color: AppColors.textDark,
  );
  static const label = TextStyle(
    fontSize: 13, fontWeight: FontWeight.w600,
    color: AppColors.textSecondary,
  );
}

// ── Theme ────────────────────────────────────────────────────────
ThemeData buildAppTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.purpleMedium,
      primary: AppColors.purpleMedium,
      onPrimary: Colors.white,
      secondary: AppColors.green,
      surface: AppColors.background,
    ),
    scaffoldBackgroundColor: AppColors.background,
    fontFamily: 'Roboto',
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: AppColors.textDark,
      elevation: 0,
      shadowColor: Color(0x1A000000),
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        fontSize: 18, fontWeight: FontWeight.w700,
        color: AppColors.textDark,
      ),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 1,
      shadowColor: const Color(0x0D000000),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: EdgeInsets.zero,
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Colors.white,
      selectedItemColor: AppColors.purpleMedium,
      unselectedItemColor: AppColors.textSecondary,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
      selectedLabelStyle: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
      unselectedLabelStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
      selectedIconTheme: IconThemeData(size: 32),
      unselectedIconTheme: IconThemeData(size: 28),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.purpleDark,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        elevation: 0,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.borderLight,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      hintStyle: const TextStyle(color: AppColors.textMuted),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    ),
  );
}
