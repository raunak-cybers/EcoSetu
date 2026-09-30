import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'widgets/shared_widgets.dart';
import 'screens/home_screen.dart';
import 'screens/my_lots_screen.dart';
import 'screens/prices_screen.dart';
import 'screens/recyclers_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/earnings_screen.dart';
import 'screens/payments_screen.dart';
import 'screens/payment_detail_screen.dart';
import 'screens/add_batch_screen.dart';
import 'screens/batch_summary_screen.dart';
import 'screens/lot_details_screen.dart';
import 'screens/recycler_details_screen.dart';
import 'screens/handover_record_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/language_selection_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/safety_tips_screen.dart';
import 'screens/edit_profile_screen.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'core/localization.dart';

import 'data/local_storage.dart';
import 'data/models.dart';
import 'services/tts_service.dart';

import 'package:supabase_flutter/supabase_flutter.dart';
import 'core/supabase_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  
  await Supabase.initialize(
    url: SupabaseConfig.url,
    anonKey: SupabaseConfig.anonKey,
  );
  
  await LocalStorageService.init();
  runApp(const EcoSetuApp());
}

class TtsRouteObserver extends NavigatorObserver {
  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);
    TtsService().stop();
  }
  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPop(route, previousRoute);
    TtsService().stop();
  }
}

final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();
final TtsRouteObserver ttsRouteObserver = TtsRouteObserver();

class EcoSetuApp extends StatefulWidget {
  const EcoSetuApp({super.key});

  @override
  State<EcoSetuApp> createState() => _EcoSetuAppState();
}

class _EcoSetuAppState extends State<EcoSetuApp> {
  AppLanguage _language = AppLanguage.en;
  bool _isVoiceModeEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  void _loadPreferences() {
    final langStr = LocalStorageService.getLanguage();
    if (langStr != null) {
      if (langStr == 'hi') _language = AppLanguage.hi;
      else if (langStr == 'mr') _language = AppLanguage.mr;
      else _language = AppLanguage.en;
      
      final langCode = _language == AppLanguage.hi ? 'hi-IN' : _language == AppLanguage.mr ? 'mr-IN' : 'en-IN';
      TtsService().setLanguage(langCode);
    }
    
    _isVoiceModeEnabled = LocalStorageService.getVoiceMode();
    setState(() {});
  }

  void _changeLanguage(AppLanguage lang) {
    setState(() {
      _language = lang;
    });
    
    String code = 'en';
    if (lang == AppLanguage.hi) code = 'hi';
    if (lang == AppLanguage.mr) code = 'mr';
    LocalStorageService.saveLanguage(code);
    
    final langCode = lang == AppLanguage.hi ? 'hi-IN' : lang == AppLanguage.mr ? 'mr-IN' : 'en-IN';
    TtsService().setLanguage(langCode);
  }

  void _toggleVoiceMode() {
    setState(() {
      _isVoiceModeEnabled = !_isVoiceModeEnabled;
    });
    LocalStorageService.saveVoiceMode(_isVoiceModeEnabled);
  }

  @override
  Widget build(BuildContext context) {
    return AppLocalizations(
      language: _language,
      isVoiceModeEnabled: _isVoiceModeEnabled,
      changeLanguage: _changeLanguage,
      toggleVoiceMode: _toggleVoiceMode,
      child: MaterialApp(
        title: 'EcoSetu',
        navigatorObservers: [routeObserver, ttsRouteObserver],
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      initialRoute: '/splash',
      routes: {
        '/splash':        (_) => const SplashScreen(),
        '/language-selection': (_) => const LanguageSelectionScreen(),
        '/onboarding':    (_) => const OnboardingScreen(),
        '/login':         (_) => const LoginScreen(),
        '/register':      (_) => const RegisterScreen(),
        '/home':          (_) => const MainShell(),
        '/prices':        (_) => const PricesScreen(),
        '/payments':      (_) => const PaymentsScreen(),
        '/payment-detail':(_) => const PaymentDetailScreen(),
        '/add-batch':     (_) => const AddBatchScreen(),
        '/batch-summary': (_) => const BatchSummaryScreen(),
        '/lot-details':   (_) => const LotDetailsScreen(),
        '/recycler-details': (_) => const RecyclerDetailsScreen(),
        '/handover-record': (_) => const HandoverRecordScreen(),
        '/safety-tips':   (_) => const SafetyTipsScreen(),
        '/edit-profile':  (_) => const EditProfileScreen(),
      },
    ));
  }
}

// ── Main shell with bottom nav ────────────────────────────────────
class MainShell extends StatefulWidget {
  final int initialIndex;
  final String? initialCategory;

  const MainShell({super.key, this.initialIndex = 0, this.initialCategory});
  
  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  late int _currentIndex;
  String? _currentCategory;
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;

  late RealtimeChannel _globalSyncChannel;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _currentCategory = widget.initialCategory;
    
    _globalSyncChannel = Supabase.instance.client.channel('public:lots:global');
    _globalSyncChannel.onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: 'public',
      table: 'lots',
      callback: (payload) async {
        if (payload.newRecord.isNotEmpty) {
           final row = payload.newRecord;
           final lotId = row['id'];
           final allLots = LocalStorageService.getAllLots();
           final lIdx = allLots.indexWhere((l) => l.lotId == lotId);
           if (lIdx >= 0) {
              final lot = allLots[lIdx];
              final newStatus = row['handover_status'];
              final vWeight = row['verified_weight'];
              final fPrice = row['final_price'];
              
              String newLocalStatus = lot.handoverStatus ?? 'pickup_pending';
              if (newStatus == 'accepted') newLocalStatus = 'accepted';
              if (newStatus == 'declined') newLocalStatus = 'declined';
              if (newStatus == 'rejected') newLocalStatus = 'rejected';
              if (newStatus == 'disputed') newLocalStatus = 'disputed';
              if (newStatus == 'handed_over') newLocalStatus = 'handed_over';
              if (newStatus == 'paid') newLocalStatus = 'paid';
              
              bool changed = false;
              if (lot.handoverStatus != newLocalStatus) { 
                // No need to auto-generate payment, handled dynamically in LocalStorageService

                lot.handoverStatus = newLocalStatus; 
                changed = true; 
              }
              if (vWeight != null && lot.verifiedWeight != (vWeight as num).toDouble()) { lot.verifiedWeight = (vWeight as num).toDouble(); changed = true; }
              if (fPrice != null && lot.finalPrice != (fPrice as num).toDouble()) { lot.finalPrice = (fPrice as num).toDouble(); changed = true; }
              
              if (changed) {
                final batches = LocalStorageService.getBatches();
                final batchToUpdate = batches.firstWhere((b) => b.batchId == lot.batchId);
                final lotIndex = batchToUpdate.lots.indexWhere((l) => l.lotId == lot.lotId);
                if (lotIndex >= 0) batchToUpdate.lots[lotIndex] = lot;
                await LocalStorageService.saveBatches(batches);
                if (mounted) setState((){});
              }
           }
        }
      }
    ).subscribe();

    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      if (results.contains(ConnectivityResult.none)) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showMaterialBanner(
          MaterialBanner(
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  AppLocalizations.of(context).t('offline_banner_title'),
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
                ),
                const SizedBox(height: 4),
                Text(
                  AppLocalizations.of(context).t('offline_banner_desc'),
                  style: const TextStyle(fontWeight: FontWeight.w500, color: Colors.white, fontSize: 13),
                ),
              ],
            ),
            backgroundColor: const Color(0xFFEF4444),
            padding: const EdgeInsets.all(16),
            actions: [
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () {
                  ScaffoldMessenger.of(context).hideCurrentMaterialBanner();
                },
              ),
            ],
          ),
        );
      } else {
        ScaffoldMessenger.of(context).hideCurrentMaterialBanner();
      }
    });
  }

  @override
  void dispose() {
    _globalSyncChannel.unsubscribe();
    _connectivitySubscription.cancel();
    super.dispose();
  }




  Widget _buildBadgedIcon(IconData icon, bool showBadge) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Icon(icon),
        if (showBadge)
          Positioned(
            right: -2,
            top: -2,
            child: Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: AppTheme.accentRed,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ),
      ],
    );
  }

  bool _hasViewedLots = false;
  bool _hasViewedEarnings = false;

  bool get _showLotsBadge {
    if (_hasViewedLots || !LocalStorageService.getNotifications()) return false;
    final lots = LocalStorageService.getAllLots();
    return lots.any((l) => l.handoverStatus == 'accepted' || l.handoverStatus == 'handed_over' || l.handoverStatus == 'declined');
  }

  bool get _showEarningsBadge {
    if (_hasViewedEarnings || !LocalStorageService.getNotifications()) return false;
    final payments = LocalStorageService.getPayments();
    final batches = LocalStorageService.getBatches();
    return payments.any((p) => p.status == 'pending' || p.hasDispute == true) || batches.any((b) => b.status == 'disputed');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: _currentIndex == 4 ? null : EcoSetuAppBar(
        onProfileTap: () {
          HapticFeedback.selectionClick();
          TtsService().stop();
          setState(() => _currentIndex = 4);
        },
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          HomeScreen(
            onTabSelected: (i) {
              HapticFeedback.selectionClick();
              TtsService().stop();
              setState(() {
                _currentIndex = i;
                _currentCategory = null;
                if (i == 1) _hasViewedLots = true;
                if (i == 2) _hasViewedEarnings = true;
              });
            },
          ),
          MyLotsScreen(initialCategory: _currentCategory),
          EarningsScreen(),
          RecyclersScreen(initialCategory: _currentIndex == 3 ? _currentCategory : null),
          ProfileScreen(
            onTabSelected: (i, {String? category}) {
              HapticFeedback.selectionClick();
              TtsService().stop();
              setState(() {
                _currentIndex = i;
                _currentCategory = category;
                if (i == 1) _hasViewedLots = true;
                if (i == 2) _hasViewedEarnings = true;
              });
            },
            onNotificationToggled: () {
              setState(() {}); // Rebuild MainShell to update badges based on LocalStorageService setting
            },
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
            child: BottomNavigationBar(
              elevation: 0,
              backgroundColor: Colors.transparent,
              currentIndex: _currentIndex,
              onTap: (i) {
                HapticFeedback.selectionClick();
                TtsService().stop();
                setState(() {
                  _currentIndex = i;
                  _currentCategory = null;
                  if (i == 1) _hasViewedLots = true;
                  if (i == 2) _hasViewedEarnings = true;
                });
              },
              items: [
                BottomNavigationBarItem(icon: const Icon(Icons.home_outlined), activeIcon: const Icon(Icons.home), label: AppLocalizations.of(context).t('nav_home')),
                BottomNavigationBarItem(
                  icon: _buildBadgedIcon(Icons.inventory_2_outlined, _showLotsBadge),
                  activeIcon: _buildBadgedIcon(Icons.inventory_2, _showLotsBadge),
                  label: AppLocalizations.of(context).t('nav_my_lots'),
                ),
                BottomNavigationBarItem(
                  icon: _buildBadgedIcon(Icons.currency_rupee, _showEarningsBadge),
                  activeIcon: _buildBadgedIcon(Icons.currency_rupee, _showEarningsBadge),
                  label: AppLocalizations.of(context).t('nav_earnings'),
                ),
                BottomNavigationBarItem(icon: const Icon(Icons.factory_outlined), activeIcon: const Icon(Icons.factory), label: AppLocalizations.of(context).t('nav_recyclers')),
                BottomNavigationBarItem(icon: const Icon(Icons.person_outline), activeIcon: const Icon(Icons.person), label: AppLocalizations.of(context).t('nav_profile')),
              ],
            ),
          ),
        ),
        ),
      ),
    );
  }
}

