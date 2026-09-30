import re

with open('ui/lib/screens/add_batch_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace imports
content = re.sub(
    r"import 'package:google_generative_ai/google_generative_ai\.dart';",
    "import 'package:flutter_image_compress/flutter_image_compress.dart';\nimport 'package:supabase_flutter/supabase_flutter.dart';",
    content
)

# Replace _handleCapture
new_capture = '''  Future<void> _handleCapture(ImageSource source) async {
    try {
      final XFile? image = await _picker.pickImage(source: source);
      if (image == null) return;
      if (!mounted) return;

      setState(() {
        _capturedImage = image;
        if (_currentStep != 3) {
          _isAnalyzing = true;
          _suggestedCategory = null;
          _selectedCategory = null;
          _currentStep = 1; // Move to Verify step
        }
      });

      if (_currentStep == 3) return;

      // Stage 2: Compress and call Supabase Edge Function
      try {
        final compressedBytes = await FlutterImageCompress.compressWithFile(
          image.path,
          minWidth: 1024,
          minHeight: 1024,
          quality: 80,
        );
        
        if (compressedBytes == null) throw Exception("Image compression failed");
        final base64Image = base64Encode(compressedBytes);

        final response = await Supabase.instance.client.functions.invoke(
          'classify-ewaste',
          body: {
            "image_base64": base64Image,
            "mime_type": "image/jpeg"
          },
        ).timeout(const Duration(seconds: 15));

        if (!mounted) return;

        final data = response.data;
        if (data != null && data['category'] != null && data['confidence'] != null) {
          final String cat = data['category'];
          final String conf = data['confidence'];

          if ((conf == 'high' || conf == 'medium') && cat != 'Unknown') {
            setState(() {
              _isAnalyzing = false;
              _suggestedCategory = _categories.firstWhere(
                (c) => c["id"] == cat || c["label"] == cat,
                orElse: () => _categories.firstWhere((c) => c["id"] == "PCB")
              );
              _selectedCategory = _suggestedCategory;
            });
          } else {
            // Low confidence or Unknown
            setState(() {
              _isAnalyzing = false;
              _suggestedCategory = null;
              _selectedCategory = null;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Couldn't identify this. Please choose the material.")),
            );
          }
        } else {
           throw Exception("Invalid response format");
        }
      } on TimeoutException {
        if (!mounted) return;
        setState(() {
          _isAnalyzing = false;
          _suggestedCategory = null;
          _selectedCategory = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Couldn't identify this. Please choose the material.")),
        );
      } catch (e) {
        debugPrint("Classification Error: ");
        if (mounted) {
          setState(() {
            _isAnalyzing = false;
            _suggestedCategory = null;
            _selectedCategory = null;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Couldn't identify this. Please choose the material.")),
          );
        }
      }
    } catch (e) {
      debugPrint('Camera/Gallery error: ');
      if (mounted) {
        setState(() {
          _isAnalyzing = false;
        });
      }
    }
  }'''

content = re.sub(
    r"  Future<void> _handleCapture\(ImageSource source\) async \{.*?(?=  void _handleNumpad)",
    new_capture + "\n\n",
    content,
    flags=re.DOTALL
)

with open('ui/lib/screens/add_batch_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
