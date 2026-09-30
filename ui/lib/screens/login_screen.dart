import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;
  bool _isLoading = false;
  String? _phoneError;
  String? _otpError;

  void _sendOtp() {
    setState(() { _phoneError = null; });
    if (_phoneController.text.length < 10) {
      setState(() { _phoneError = 'Please enter a valid 10-digit phone number'; });
      return;
    }
    setState(() => _otpSent = true);
  }

  void _verifyOtp() {
    setState(() { _otpError = null; });
    if (_otpController.text.length < 4) {
      setState(() { _otpError = AppLocalizations.of(context).t('login_otp_error'); });
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
              Navigator.pushReplacementNamed(context, '/language-selection');
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
                  ? '${AppLocalizations.of(context).t('login_welcome')}। आगे बढ़ने के लिए कृपया अपना फोन नंबर और ओटीपी दर्ज करें।'
                  : AppLocalizations.of(context).language == AppLanguage.mr
                      ? '${AppLocalizations.of(context).t('login_welcome')}. पुढे जाण्यासाठी कृपया तुमचा फोन नंबर आणि ओटीपी प्रविष्ट करा.'
                      : '${AppLocalizations.of(context).t('login_welcome')}. Please enter your phone number and OTP to continue.',
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: GestureDetector(
          onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              
              // Logo / Brand
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
                  child: const Icon(Icons.eco, size: 48, color: Colors.white),
                ),
              ),
              const SizedBox(height: 24),
              
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: Text(
                      AppLocalizations.of(context).t('login_welcome'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.primaryDark,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                AppLocalizations.of(context).t('login_desc'),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 15,
                  color: AppTheme.textSecondary,
                ),
              ),
              
              const SizedBox(height: 48),
              
              // Login Card
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
                    // Phone Number Field
                    Text(
                      AppLocalizations.of(context).t('login_phone'),
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _phoneController,
                          onChanged: (val) { if (_phoneError != null) setState(() => _phoneError = null); },
                      keyboardType: TextInputType.phone,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      enabled: !_otpSent,
                      maxLength: 10,
                      decoration: InputDecoration(
                        counterText: '',
                        hintText: AppLocalizations.of(context).t('login_phone_hint'),
                          errorText: _phoneError,
                        prefixIcon: const Icon(Icons.phone_android, color: AppTheme.purpleMedium),
                        filled: true,
                        fillColor: AppTheme.background,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                    
                    if (_otpSent) ...[
                      const SizedBox(height: 20),
                      // OTP Field
                      Text(
                        AppLocalizations.of(context).t('login_otp'),
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryDark,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _otpController,
                          onChanged: (val) { if (_otpError != null) setState(() => _otpError = null); },
                        keyboardType: TextInputType.number,
                        maxLength: 4,
                        decoration: InputDecoration(
                          hintText: AppLocalizations.of(context).t('login_otp_hint'),
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
                  ],
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Switch to Register
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    AppLocalizations.of(context).t('login_no_acc'),
                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 15),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/register');
                    },
                    child: Text(
                      AppLocalizations.of(context).t('login_signup'),
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
      ),
    );
  }
}
