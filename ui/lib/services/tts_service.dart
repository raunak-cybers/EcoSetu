import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter/foundation.dart';
import 'dart:async';

class TtsService {
  static final TtsService _instance = TtsService._internal();
  factory TtsService() => _instance;

  final FlutterTts _flutterTts = FlutterTts();
  bool _isInitialized = false;
  Future<void>? _initFuture;

  TtsService._internal() {
    _initFuture = _initTts();
  }

  Future<void> _initTts() async {
    try {
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setSpeechRate(kIsWeb ? 1.0 : 0.5); // 1.0 for Web, 0.5 for Android/iOS
      await _flutterTts.setPitch(1.0);
      _isInitialized = true;
    } catch (e) {
      debugPrint("TTS Initialization error: $e");
    }
  }
  
  Future<void> _ensureInitialized() async {
    if (_isInitialized) return;
    if (_initFuture != null) {
      await _initFuture;
    } else {
      _initFuture = _initTts();
      await _initFuture;
    }
  }

  Future<void> setLanguage(String languageCode) async {
    await _ensureInitialized();
    String ttsLang = 'en-IN'; // Default to Indian English
    if (languageCode == 'hi' || languageCode == 'hi-IN') {
      ttsLang = 'hi-IN';
    } else if (languageCode == 'mr' || languageCode == 'mr-IN') {
      ttsLang = 'mr-IN';
    } else {
      ttsLang = 'en-IN';
    }
    
    try {
      if (ttsLang == 'mr-IN') {
        dynamic isAvailable = await _flutterTts.isLanguageAvailable("mr-IN");
        if (isAvailable is bool && !isAvailable) {
          // Fallback if Marathi is missing
          ttsLang = 'hi-IN';
        }
      }
      await _flutterTts.setLanguage(ttsLang);
    } catch (e) {
      debugPrint("TTS SetLanguage error: $e");
    }
  }

  Future<void> speak(String text) async {
    await _ensureInitialized();
    if (text.isNotEmpty) {
      try {
        await _flutterTts.speak(text);
      } catch (e) {
        debugPrint("TTS Speak error: $e");
      }
    }
  }

  Future<void> stop() async {
    await _ensureInitialized();
    try {
      await _flutterTts.stop();
    } catch (e) {
      debugPrint("TTS Stop error: $e");
    }
  }
}
