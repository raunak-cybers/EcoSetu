import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../core/localization.dart';
import '../data/local_storage.dart';
import 'package:flutter/services.dart';
import '../services/tts_service.dart';

class LanguageSelectionScreen extends StatefulWidget {
  const LanguageSelectionScreen({super.key});

  @override
  State<LanguageSelectionScreen> createState() => _LanguageSelectionScreenState();
}

class _LanguageSelectionScreenState extends State<LanguageSelectionScreen> {
  AppLanguage? _selectedLang;

  @override
  void initState() {
    super.initState();
    // Default to currently saved language or English
    _selectedLang = AppLanguage.en;
    
    // We defer getting the current locale since AppLocalizations needs context
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        setState(() {
          _selectedLang = AppLocalizations.of(context).language;
        });
      }
    });
  }

  void _onLanguageSelect(AppLanguage lang) {
    HapticFeedback.selectionClick();
    setState(() {
      _selectedLang = lang;
    });
    AppLocalizations.of(context).changeLanguage(lang);
    
    final langCode = lang == AppLanguage.hi ? 'hi-IN' : lang == AppLanguage.mr ? 'mr-IN' : 'en-IN';
    TtsService().setLanguage(langCode);
  }

  void _onProceed() {
    Navigator.pushNamed(context, '/login');
  }

  Widget _buildLangButton(String text, String nativeText, AppLanguage lang) {
    final isSelected = _selectedLang == lang;
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: InkWell(
        onTap: () => _onLanguageSelect(lang),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.purpleMedium.withValues(alpha: 0.1) : AppTheme.background,
            border: Border.all(color: isSelected ? AppTheme.purpleMedium : Colors.transparent, width: 2),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(nativeText, style: TextStyle(
                    fontSize: 22, 
                    fontWeight: FontWeight.bold,
                    color: isSelected ? AppTheme.purpleDark : AppTheme.textDark,
                  )),
                  const SizedBox(height: 4),
                  Text(text, style: TextStyle(
                    fontSize: 14, 
                    color: isSelected ? AppTheme.purpleMedium : AppTheme.textSecondary,
                  )),
                ],
              ),
              if (isSelected) 
                const Icon(Icons.check_circle, color: AppTheme.purpleMedium, size: 28)
              else
                Icon(Icons.circle_outlined, color: AppTheme.textSecondary.withValues(alpha: 0.3), size: 28),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.purpleBg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              
              // Logo matching the login screen theme
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.purpleMedium,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.purpleMedium.withValues(alpha: 0.3),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.language, size: 48, color: Colors.white),
                ),
              ),
              const SizedBox(height: 32),
              
              const Text(
                'Choose your language',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.primaryDark,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'भाषा निवडा / अपनी भाषा चुनें',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textSecondary,
                ),
              ),
              
              const SizedBox(height: 40),
              
              // Language Selection Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildLangButton('English', 'English', AppLanguage.en),
                    _buildLangButton('Hindi', 'हिंदी', AppLanguage.hi),
                    _buildLangButton('Marathi', 'मराठी', AppLanguage.mr),
                    
                    const SizedBox(height: 16),
                    
                    // Proceed button
                    SizedBox(
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _selectedLang != null ? _onProceed : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.purpleMedium,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 0,
                          disabledBackgroundColor: AppTheme.border,
                        ),
                        child: Text(
                          AppLocalizations.of(context).t('login_continue'),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
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
}
