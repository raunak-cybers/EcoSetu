import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../data/mock_data.dart';
import '../data/local_storage.dart';
import '../core/localization.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _locationController;
  late String _selectedLanguage;

  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final collector = LocalStorageService.getCollector();
    _nameController = TextEditingController(text: collector.name);
    _phoneController = TextEditingController(text: collector.phone);
    _locationController = TextEditingController(text: collector.location);
    _selectedLanguage = collector.language;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  void _handleSave() {
    if (_formKey.currentState?.validate() ?? false) {
      final collector = LocalStorageService.getCollector();
      // Check if phone changed
      if (_phoneController.text.trim() != collector.phone) {
        _showOtpBottomSheet();
      } else {
        _saveChanges();
      }
    }
  }

  void _saveChanges() {
    setState(() => _isSaving = true);
    
    // Simulate network delay
    Future.delayed(const Duration(milliseconds: 800), () async {
      if (mounted) {
        // Generate new initials
        final nameParts = _nameController.text.trim().split(' ');
        String newInitials = '';
        if (nameParts.isNotEmpty) {
          newInitials += nameParts[0].substring(0, 1).toUpperCase();
          if (nameParts.length > 1) {
            newInitials += nameParts[1].substring(0, 1).toUpperCase();
          }
        }

        final collector = LocalStorageService.getCollector();
        final updatedCollector = collector.copyWith(
          name: _nameController.text.trim(),
          phone: _phoneController.text.trim(),
          location: _locationController.text.trim(),
          operatingArea: _locationController.text.trim(), // keeping them synced for simplicity
          language: _selectedLanguage,
          initials: newInitials,
        );
        
        await LocalStorageService.saveCollector(updatedCollector);

        if (mounted) {
          Navigator.pop(context); // Go back to profile screen
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(AppLocalizations.of(context).t('ep_success')), backgroundColor: AppTheme.accentGreen),
          );
        }
      }
    });
  }

  void _showOtpBottomSheet() {
    final otpController = TextEditingController();
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.security, size: 48, color: AppTheme.primaryDark),
              const SizedBox(height: 16),
              Text(
                AppLocalizations.of(context).t('ep_verify_phone'),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${AppLocalizations.of(context).t('ep_enter_otp')}${_phoneController.text.trim()}',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: otpController,
                keyboardType: TextInputType.number,
                maxLength: 4,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 24, letterSpacing: 16, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  counterText: '',
                  hintText: '0000',
                  hintStyle: const TextStyle(color: AppTheme.textMuted),
                  filled: true,
                  fillColor: AppTheme.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
                child: Text(AppLocalizations.of(context).t('ep_verify_save')),
                onPressed: () {
                  if (otpController.text.length == 4) {
                    Navigator.pop(context); // close bottom sheet
                    _saveChanges(); // trigger save
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(AppLocalizations.of(context).t('ep_invalid_otp')), backgroundColor: AppTheme.accentRed),
                    );
                  }
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final collector = LocalStorageService.getCollector();
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textDark,
        elevation: 0,
        title: Text(
          AppLocalizations.of(context).t('ep_title'),
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
        ),
        actions: [
          ListenButton(
            text: AppLocalizations.of(context).language == AppLanguage.hi
                ? 'अपना नाम, फोन नंबर, पसंदीदा भाषा और ऑपरेटिंग स्थान बदलकर अपनी प्रोफ़ाइल संपादित करें। अंत में प्रोफ़ाइल सहेजने के लिए सेव चेंजेस पर क्लिक करें।'
                : AppLocalizations.of(context).language == AppLanguage.mr
                    ? 'तुमचे नाव, फोन नंबर, आवडती भाषा आणि ऑपरेटिंग स्थान बदलून तुमची प्रोफाइल संपादित करा. शेवटी प्रोफाइल जतन करण्यासाठी सेव्ह चेंजेस वर क्लिक करा.'
                    : 'Edit your profile by changing name, phone number, preferred language, and operating location. Finally, click on save changes to save the profile.',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isSaving
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryDark))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Profile Photo area
                    Center(
                      child: Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: const BoxDecoration(
                              color: AppTheme.purpleDark,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              collector.initials,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 36,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: InkWell(
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(AppLocalizations.of(context).t('ep_photo_soon'))),
                                );
                              },
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryDark,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 3),
                                ),
                                child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    Text(AppLocalizations.of(context).t('ep_name'), style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _nameController,
                      decoration: _inputDecoration(AppLocalizations.of(context).t('ep_name_hint')),
                      validator: (val) => val == null || val.trim().length < 2 ? AppLocalizations.of(context).t('ep_name_req') : null,
                    ),
                    const SizedBox(height: 20),
                    
                    Text(AppLocalizations.of(context).t('ep_phone'), style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: _inputDecoration(AppLocalizations.of(context).t('ep_phone_hint')).copyWith(
                        helperText: AppLocalizations.of(context).t('ep_phone_helper'),
                        helperStyle: const TextStyle(color: AppTheme.textSecondary),
                      ),
                      validator: (val) => val == null || val.trim().length < 10 ? AppLocalizations.of(context).t('ep_phone_req') : null,
                    ),
                    const SizedBox(height: 20),
                    
                    Text(AppLocalizations.of(context).t('ep_lang'), style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    InkWell(
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
                                ...['English', 'Hindi', 'Marathi'].map((langName) {
                                  bool isSelected = _selectedLanguage == langName;
                                  String display = langName == 'Hindi' ? 'Hindi (हिंदी)' : langName == 'Marathi' ? 'Marathi (मराठी)' : 'English';
                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 8.0),
                                    child: InkWell(
                                      onTap: () {
                                        setState(() => _selectedLanguage = langName);
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
                                            Text(display, style: TextStyle(fontSize: 16, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: isSelected ? AppTheme.primaryDark : AppTheme.textDark)),
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
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppTheme.borderLight),
                          borderRadius: BorderRadius.circular(12),
                          color: const Color(0xFFF9FAFB),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _selectedLanguage == 'Hindi' ? 'Hindi (हिंदी)' : _selectedLanguage == 'Marathi' ? 'Marathi (मराठी)' : 'English',
                              style: const TextStyle(fontSize: 16, color: AppTheme.textDark),
                            ),
                            const Icon(Icons.arrow_drop_down, color: AppTheme.textSecondary),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    Text(AppLocalizations.of(context).t('ep_loc'), style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _locationController,
                      decoration: _inputDecoration(AppLocalizations.of(context).t('ep_loc_hint')),
                      validator: (val) => val == null || val.trim().length < 3 ? AppLocalizations.of(context).t('ep_loc_req') : null,
                    ),
                    const SizedBox(height: 40),
                    
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      onPressed: _handleSave,
                      child: Text(AppLocalizations.of(context).t('ep_save')),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppTheme.borderLight),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppTheme.borderLight),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppTheme.primaryDark, width: 2),
      ),
    );
  }
}
