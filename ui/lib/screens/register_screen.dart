import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cityController = TextEditingController();
  TextEditingController? _autocompleteController;
  String? _selectedCity;
  final List<String> _cities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Navi Mumbai', 'Delhi', 'Bangalore', 'Panvel, Maharashtra'];
  final _otpController = TextEditingController();
  
  bool _otpSent = false;
  bool _isLoading = false;
  bool _isDetectingLocation = false;
  String? _nameError;
  String? _phoneError;
  String? _cityError;
  String? _otpError;

  void _autoDetectLocation() async {
    setState(() => _isDetectingLocation = true);
    await Future.delayed(const Duration(seconds: 1));
    if (!mounted) return;
    setState(() {
      _isDetectingLocation = false;
      _selectedCity = 'Panvel, Maharashtra';
      if (_autocompleteController != null) {
        _autocompleteController!.text = 'Panvel, Maharashtra';
      }
      _cityController.text = 'Panvel, Maharashtra';
    });
  }

  void _sendOtp() {
    setState(() {
      _nameError = null;
      _phoneError = null;
      _cityError = null;
    });
    
    bool hasError = false;
    if (_nameController.text.trim().isEmpty) {
      setState(() => _nameError = 'Please enter your full name');
      hasError = true;
    }
    if (_phoneController.text.length != 10) {
      setState(() => _phoneError = 'Please enter a valid 10-digit phone number');
      hasError = true;
    }
    if (_selectedCity == null || _selectedCity!.isEmpty) {
      setState(() => _cityError = 'Please select your city');
      hasError = true;
    }
    
    if (hasError) return;
    
    setState(() => _otpSent = true);
  }

  void _verifyOtp() {
    setState(() => _otpError = null);
    if (_otpController.text.length < 4) {
      setState(() => _otpError = 'Please enter the 4-digit OTP');
      return;
    }
    
    setState(() => _isLoading = true);
    
    Future.delayed(const Duration(seconds: 1), () {
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.purpleBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leadingWidth: 100,
        leading: InkWell(
          onTap: () {
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            } else {
              Navigator.pushReplacementNamed(context, '/login');
            }
          },
          child: Row(
            children: [
              const SizedBox(width: 16),
              const Icon(Icons.arrow_back_ios_new, color: AppTheme.primaryDark, size: 20),
              const SizedBox(width: 4),
              Text(
                AppLocalizations.of(context).language == AppLanguage.hi 
                    ? 'पीछे' 
                    : AppLocalizations.of(context).language == AppLanguage.mr 
                        ? 'मागे' 
                        : 'Back',
                style: const TextStyle(color: AppTheme.primaryDark, fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: ListenButton(
              text: AppLocalizations.of(context).language == AppLanguage.hi
                  ? '${AppLocalizations.of(context).t('reg_title')}। कृपया अपना पूरा नाम, फोन नंबर और शहर दर्ज करें, फिर रजिस्टर बटन पर क्लिक करें।'
                  : AppLocalizations.of(context).language == AppLanguage.mr
                      ? '${AppLocalizations.of(context).t('reg_title')}. कृपया तुमचे पूर्ण नाव, फोन नंबर आणि शहर प्रविष्ट करा, नंतर रजिस्टर बटणावर क्लिक करा.'
                      : '${AppLocalizations.of(context).t('reg_title')}. Please enter your full name, phone number, and city, then click on register.',
            ),
          ),
        ],
      ),
      body: GestureDetector(
        onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    AppLocalizations.of(context).t('reg_title'),
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.primaryDark,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              AppLocalizations.of(context).t('reg_desc'),
              style: const TextStyle(
                fontSize: 15,
                color: AppTheme.textSecondary,
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Register Card
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
                  // Full Name Field
                  _buildInputLabel(AppLocalizations.of(context).t('reg_name')),
                  _buildTextField(
                    controller: _nameController,
                    onChanged: (val) { if (_nameError != null) setState(() => _nameError = null); },
                    hint: AppLocalizations.of(context).t('reg_name_hint'),
                    icon: Icons.person_outline,
                    enabled: !_otpSent,
                    errorText: _nameError,
                  ),
                  const SizedBox(height: 20),
                  
                  // Phone Number Field
                  _buildInputLabel(AppLocalizations.of(context).t('login_phone')),
                  _buildTextField(
                    controller: _phoneController,
                    onChanged: (val) { if (_phoneError != null) setState(() => _phoneError = null); },
                    hint: AppLocalizations.of(context).t('login_phone_hint'),
                    icon: Icons.phone_android,
                    keyboardType: TextInputType.phone,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    enabled: !_otpSent,
                    maxLength: 10,
                    errorText: _phoneError,
                  ),
                  const SizedBox(height: 20),
                  
                  // City Field
                  _buildInputLabel(AppLocalizations.of(context).t('reg_city')),
                  LayoutBuilder(
                    builder: (context, constraints) => Autocomplete<String>(
                      optionsBuilder: (TextEditingValue textEditingValue) {
                        if (textEditingValue.text.isEmpty) {
                          return _cities;
                        }
                        return _cities.where((String option) {
                          return option.toLowerCase().contains(textEditingValue.text.toLowerCase());
                        });
                      },
                      onSelected: (String selection) {
                        setState(() {
                          _selectedCity = selection;
                          _cityController.text = selection;
                        });
                      },
                      fieldViewBuilder: (context, fieldTextEditingController, fieldFocusNode, onFieldSubmitted) {
                          _autocompleteController = fieldTextEditingController;
                          return TextField(
                            controller: fieldTextEditingController,
                            focusNode: fieldFocusNode,
                            enabled: !_otpSent,
                            onChanged: (val) {
                              if (_cityError != null) setState(() => _cityError = null);
                            },
                            decoration: InputDecoration(
                              hintText: AppLocalizations.of(context).t('reg_city_hint'),
                              errorText: _cityError,
                              prefixIcon: const Icon(Icons.location_city_outlined, color: AppTheme.purpleMedium),
                              filled: true,
                              fillColor: AppTheme.background,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
                          );
                        },
                        optionsViewBuilder: (context, onSelected, options) {
                        return Align(
                          alignment: Alignment.topLeft,
                          child: Material(
                            elevation: 8,
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.white,
                            clipBehavior: Clip.antiAlias,
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: AppTheme.borderLight),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              constraints: const BoxConstraints(maxHeight: 250),
                              width: constraints.maxWidth,
                              child: ListView.separated(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                shrinkWrap: true,
                                itemCount: options.length,
                                separatorBuilder: (context, index) => const Divider(height: 1, color: AppTheme.borderLight),
                                itemBuilder: (BuildContext context, int index) {
                                  final String option = options.elementAt(index);
                                  return InkWell(
                                    onTap: () => onSelected(option),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
                                      child: Row(
                                        children: [
                                          const Icon(Icons.location_on_outlined, size: 20, color: AppTheme.textSecondary),
                                          const SizedBox(width: 12),
                                          Text(option, style: const TextStyle(color: AppTheme.textDark, fontSize: 16, fontWeight: FontWeight.w500)),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Expanded(child: Divider(color: AppTheme.borderLight)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          AppLocalizations.of(context).language == AppLanguage.hi 
                              ? 'या' 
                              : AppLocalizations.of(context).language == AppLanguage.mr 
                                  ? 'किंवा' 
                                  : 'OR',
                          style: const TextStyle(color: AppTheme.textSecondary, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const Expanded(child: Divider(color: AppTheme.borderLight)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 52,
                    child: OutlinedButton.icon(
                      onPressed: _otpSent || _isDetectingLocation ? null : () {
                        _autoDetectLocation();
                      },
                      icon: _isDetectingLocation
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.my_location, size: 20),
                      label: Text(
                        AppLocalizations.of(context).language == AppLanguage.hi 
                            ? 'मेरा स्थान खोजें' 
                            : AppLocalizations.of(context).language == AppLanguage.mr 
                                ? 'माझे स्थान शोधा' 
                                : 'Auto-detect my location',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.accentGreen,
                        side: const BorderSide(color: AppTheme.accentGreen, width: 1.5),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),

                  if (_otpSent) ...[
                    const SizedBox(height: 20),
                    const Divider(color: AppTheme.borderLight),
                    const SizedBox(height: 20),
                  
                  // OTP Field
                    _buildInputLabel(AppLocalizations.of(context).t('reg_enter_otp')),
                    TextField(
                      controller: _otpController,
                          onChanged: (val) { if (_otpError != null) setState(() => _otpError = null); },
                      keyboardType: TextInputType.number,
                      maxLength: 4,
                      decoration: InputDecoration(
                        hintText: AppLocalizations.of(context).t('reg_otp_hint'),
                        errorText: _otpError,
                        prefixIcon: const Icon(Icons.lock_outline, color: AppTheme.purpleMedium),
                        filled: true,
                        fillColor: AppTheme.background,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(vertical: 16),
                        counterText: '',
                      ),
                    ),
                  ],
                  
                  const SizedBox(height: 32),
                  
                  // Main Action Button
                  SizedBox(
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _otpSent ? _verifyOtp : _sendOtp,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.purpleMedium,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: _isLoading 
                        ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text(
                            AppLocalizations.of(context).t('login_continue'),
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    AppLocalizations.of(context).language == AppLanguage.hi
                        ? 'जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं।'
                        : AppLocalizations.of(context).language == AppLanguage.mr
                            ? 'पुढे चालू ठेवून, तुम्ही आमच्या सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहात.'
                            : 'By continuing, you agree to our Terms & Privacy Policy.',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textMuted,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Switch to Login
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  AppLocalizations.of(context).t('reg_have_acc'),
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 15),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text(
                    AppLocalizations.of(context).t('reg_login'),
                    style: const TextStyle(
                      color: AppTheme.purpleMedium,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
        ),
    );
  }

  Widget _buildInputLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: AppTheme.primaryDark,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool enabled = true,
    TextInputType keyboardType = TextInputType.text,
    int? maxLength,
    String? errorText,
    Function(String)? onChanged,
    List<TextInputFormatter>? inputFormatters,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      enabled: enabled,
      maxLength: maxLength,
      onChanged: onChanged,
      decoration: InputDecoration(
        counterText: '',
        hintText: hint,
        errorText: errorText,
        prefixIcon: Icon(icon, color: AppTheme.purpleMedium),
        filled: true,
        fillColor: AppTheme.background,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
      ),
    );
  }
}
