import sys

with open('ui/lib/screens/register_screen.dart', 'r', encoding='utf-8') as f:
    text = f.read()

target = "// OTP Field"
btn = '''
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 48,
                    child: OutlinedButton.icon(
                      onPressed: _otpSent || _isDetectingLocation ? null : () {
                        _autoDetectLocation(_cityController);
                      },
                      icon: _isDetectingLocation
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.my_location, size: 18),
                      label: const Text(
                        'Auto-detect my location',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.purpleDark,
                        side: const BorderSide(color: AppTheme.purpleMedium),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // OTP Field'''
text = text.replace(target, btn)

with open('ui/lib/screens/register_screen.dart', 'w', encoding='utf-8') as f:
    f.write(text)
print('done insert button')
