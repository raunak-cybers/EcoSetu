import 'package:flutter/material.dart';
import 'dart:async';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/shared_widgets.dart';
import 'package:shimmer/shimmer.dart';
import '../core/localization.dart';

import '../data/models.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class RecyclersScreen extends StatefulWidget {
  final String? initialCategory;
  final Lot? lot;
  
  const RecyclersScreen({Key? key, this.initialCategory, this.lot}) : super(key: key);

  @override
  State<RecyclersScreen> createState() => _RecyclersScreenState();
}

class _RecyclersScreenState extends State<RecyclersScreen> {
  String _searchQuery = '';
  String _activeFilter = 'Best match';
  Timer? _debounce;
  bool _isLoading = true;
  bool _isOffline = false;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySubscription;

  @override
  void initState() {
    super.initState();
    _checkConnectivity();
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      final isOffline = results.isEmpty || results.every((r) => r == ConnectivityResult.none);
      if (mounted && _isOffline != isOffline) {
        setState(() {
          _isOffline = isOffline;
        });
      }
    });
  }

  Future<void> _checkConnectivity() async {
    final results = await Connectivity().checkConnectivity();
    final isOffline = results.isEmpty || results.every((r) => r == ConnectivityResult.none);
    if (mounted && _isOffline != isOffline) {
      setState(() {
        _isOffline = isOffline;
      });
    }
  }
  @override
  void dispose() {
    _debounce?.cancel();
    _connectivitySubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final List<String> _filters = [
      AppLocalizations.of(context).t('rec_filter_best'), 
      AppLocalizations.of(context).t('rec_filter_near'), 
      AppLocalizations.of(context).t('rec_filter_high')
    ];
    if (!(_filters.contains(_activeFilter))) {
        _activeFilter = _filters[0];
    }
    var filteredRecyclers = mockRecyclers.where((r) {
      final query = _searchQuery.toLowerCase();
      final matchName = r.name.toLowerCase().contains(query);
      final matchLocation = r.location.toLowerCase().contains(query);
      final matchMaterials = r.materials.any((m) => m.toLowerCase().contains(query));
      return matchName || matchLocation || matchMaterials;
    }).toList();

    if (widget.initialCategory != null) {
      filteredRecyclers = filteredRecyclers.where((r) => r.materials.contains(widget.initialCategory)).toList();
    }

    if (_activeFilter == AppLocalizations.of(context).t('rec_filter_near')) {
      filteredRecyclers.sort((a, b) {
        final distA = double.tryParse(a.distance.split(' ')[0]) ?? double.infinity;
        final distB = double.tryParse(b.distance.split(' ')[0]) ?? double.infinity;
        return distA.compareTo(distB);
      });
    } else if (_activeFilter == AppLocalizations.of(context).t('rec_filter_high')) {
      filteredRecyclers.sort((a, b) => b.rating.compareTo(a.rating));
    }

    if (_isOffline) {
      filteredRecyclers = [];
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.initialCategory != null ? AppLocalizations.of(context).t('rec_matched') : AppLocalizations.of(context).t('rec_near'),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.purpleDark,
                    ),
                  ),
                  ListenButton(
                      text: widget.initialCategory != null 
                        ? (AppLocalizations.of(context).language == AppLanguage.hi
                            ? 'नीचे दिए गए रिसाइकलर्स आपके आइटम से मैच करते हैं। उस रिसाइकिलर की अधिक जानकारी के लिए विवरण देखें पर क्लिक करें।'
                            : AppLocalizations.of(context).language == AppLanguage.mr
                                ? 'खाली दिलेले रिसायकलर्स तुमच्या आयटमशी जुळतात. त्या रिसायकलरच्या अधिक तपशीलांसाठी तपशील पहा वर क्लिक करा.'
                                : 'Below are the matched recyclers. Click on view details for more details of that recycler.')
                        : (AppLocalizations.of(context).language == AppLanguage.hi
                            ? 'नीचे दिए गए रिसाइकलर्स आपके आसपास हैं। उस रिसाइकिलर की अधिक जानकारी के लिए विवरण देखें पर क्लिक करें।'
                            : AppLocalizations.of(context).language == AppLanguage.mr
                                ? 'खाली दिलेले रिसायकलर्स तुमच्या जवळ आहेत. त्या रिसायकलरच्या अधिक तपशीलांसाठी तपशील पहा वर क्लिक करा.'
                                : 'Below are the recyclers near you. Click on view details for more details of that recycler.')
                  )
                ],
              ),
              if (widget.initialCategory == null) ...[
                const SizedBox(height: 4),
                Text(
                  AppLocalizations.of(context).t('rec_near_desc'),
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ],
          ),
        ),
        Container(
          margin: const EdgeInsets.only(left: 16, right: 16, top: 12),
          child: TextField(
            onChanged: (value) {
              if (_debounce?.isActive ?? false) _debounce!.cancel();
              _debounce = Timer(const Duration(milliseconds: 300), () {
                if (mounted) {
                  setState(() {
                    _searchQuery = value;
                  });
                }
              });
            },
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.search, color: AppTheme.textSecondary),
              hintText: widget.initialCategory != null ? AppLocalizations.of(context).t('rec_search_name') : AppLocalizations.of(context).t('rec_search_mat'),
              hintStyle: const TextStyle(color: AppTheme.textSecondary),
              filled: true,
              fillColor: AppTheme.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppTheme.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppTheme.border),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppTheme.purpleMedium),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _filters.map((filter) {
                final isSelected = _activeFilter == filter;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    onTap: () {
                      setState(() {
                        _activeFilter = filter;
                      });
                    },
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppTheme.purpleDark : Colors.transparent,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSelected ? AppTheme.purpleDark : AppTheme.border,
                        ),
                      ),
                      child: Text(
                        filter,
                        style: TextStyle(
                          color: isSelected ? AppTheme.white : AppTheme.textSecondary,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
        Expanded(
          child: Builder(
            builder: (context) {
              int? bestPriceIndex;
              int? nearestIndex;
              if (widget.initialCategory != null && filteredRecyclers.isNotEmpty) {
                double maxPrice = -1;
                double minDistance = double.infinity;
                for (int i = 0; i < filteredRecyclers.length; i++) {
                  final rec = filteredRecyclers[i];
                  if (rec.currentOffer > maxPrice) {
                    maxPrice = rec.currentOffer.toDouble();
                    bestPriceIndex = i;
                  }
                  double dist = rec.distanceInKm;
                  if (dist < minDistance) {
                    minDistance = dist;
                    nearestIndex = i;
                  }
                }
              }

              if (filteredRecyclers.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(_isOffline ? Icons.wifi_off : Icons.search_off, size: 64, color: _isOffline ? AppTheme.orange : AppTheme.textSecondary.withValues(alpha: 0.5)),
                        const SizedBox(height: 16),
                        Text(
                          _isOffline 
                              ? (AppLocalizations.of(context).language == AppLanguage.hi ? 'आप ऑफ़लाइन हैं' : AppLocalizations.of(context).language == AppLanguage.mr ? 'तुम्ही ऑफलाइन आहात' : 'You are offline') 
                              : AppLocalizations.of(context).t('empty_recyclers_title'),
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _isOffline
                              ? (AppLocalizations.of(context).language == AppLanguage.hi ? 'आसपास के रिसाइकलर्स देखने के लिए कृपया इंटरनेट से कनेक्ट करें। आप अभी भी ऑफ़लाइन लॉट बना सकते हैं।' : AppLocalizations.of(context).language == AppLanguage.mr ? 'जवळपासचे रिसायकलर्स पाहण्यासाठी कृपया इंटरनेटशी कनेक्ट करा. तुम्ही अजूनही ऑफलाइन लॉट तयार करू शकता.' : 'Please connect to the internet to find nearby recyclers. You can still create lots offline.')
                              : AppLocalizations.of(context).t('empty_recyclers_desc'),
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.only(top: 8, bottom: 16),
                itemCount: filteredRecyclers.length,
                itemBuilder: (context, index) {
                  final recycler = filteredRecyclers[index];
                  
                  String? recommendTag;
                  if (widget.initialCategory != null) {
                    if (index == bestPriceIndex) {
                      recommendTag = AppLocalizations.of(context).t('rec_rec_best');
                    } else if (index == nearestIndex) {
                      recommendTag = AppLocalizations.of(context).t('rec_rec_near');
                    }
                  }

                  final cardColor = AppTheme.purpleMedium;

                  Widget cardContent = Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: cardColor.withValues(alpha: 0.3), width: 1.5),
                      boxShadow: [
                        BoxShadow(
                          color: cardColor.withValues(alpha: 0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Left Icon block
                            Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppTheme.primaryDark.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Center(
                                child: Icon(Icons.domain, color: AppTheme.primaryDark, size: 28),
                              ),
                            ),
                            const SizedBox(width: 14),
                            // Right column
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          recycler.name,
                                          style: const TextStyle(
                                            fontSize: 17,
                                            fontWeight: FontWeight.w800,
                                            color: AppTheme.textDark,
                                          ),
                                        ),
                                      ),
                                        Container(
                                          margin: const EdgeInsets.only(left: 8),
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFDCFCE7),
                                            borderRadius: BorderRadius.circular(100),
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Icon(Icons.verified, color: Color(0xFF15803D), size: 14),
                                              const SizedBox(width: 4),
                                              Text(AppLocalizations.of(context).t('rec_verified'), style: const TextStyle(color: Color(0xFF15803D), fontSize: 13, fontWeight: FontWeight.bold)),
                                            ],
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on, size: 14, color: AppTheme.textSecondary),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          '${recycler.distance} • ${recycler.location}',
                                          style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      const Icon(Icons.star, size: 14, color: Colors.orange),
                                      const SizedBox(width: 4),
                                      Text('${recycler.rating}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textDark)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Divider(height: 1, color: AppTheme.border),
                        const SizedBox(height: 16),
                        if (widget.initialCategory != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            margin: const EdgeInsets.only(bottom: 12),
                            decoration: BoxDecoration(
                              color: AppTheme.purpleBg,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppTheme.purpleLight),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(AppLocalizations.of(context).t('rec_mat_est'), style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                                      const SizedBox(height: 2),
                                      Text(AppLocalizations.of(context).translateMaterial(widget.initialCategory!), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.purpleDark)),
                                    ],
                                  ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Builder(
                                    builder: (context) {
                                      final fallbackPrice = mockPrices.firstWhere((p) => p.category == widget.initialCategory!, orElse: () => mockPrices.first).pricePerKg;
                                      final matPrice = recycler.customPrices?[widget.initialCategory] ?? fallbackPrice;
                                      return Text('₹$matPrice${AppLocalizations.of(context).t('unit_per_kg')}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppTheme.purpleDark));
                                    }
                                  ),
                                ),
                              ],
                            ),
                          )
                        else ...[
                          Row(
                            children: [
                              Text(
                                AppLocalizations.of(context).t('rec_accepts'),
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: SingleChildScrollView(
                                  scrollDirection: Axis.horizontal,
                                  physics: const NeverScrollableScrollPhysics(),
                                  child: Row(
                                    children: [
                                      ...(() {
                                        var mats = recycler.materials.toList();
                                        mats.sort((a, b) {
                                          final priceA = recycler.customPrices?[a] ?? mockPrices.firstWhere((p) => p.category == a, orElse: () => mockPrices.first).pricePerKg;
                                          final priceB = recycler.customPrices?[b] ?? mockPrices.firstWhere((p) => p.category == b, orElse: () => mockPrices.first).pricePerKg;
                                          return priceB.compareTo(priceA);
                                        });
                                        return mats.take(2).map<Widget>((m) {
                                          return Container(
                                          margin: const EdgeInsets.only(right: 8),
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            border: Border.all(color: AppTheme.border),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            AppLocalizations.of(context).translateMaterial(m),
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: AppTheme.purpleDark,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                        );
                                      });
                                      })(),
                                      if (recycler.materials.length > 2)
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF3F4F6),
                                            border: Border.all(color: AppTheme.border),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            '+${recycler.materials.length - 2}',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: AppTheme.textSecondary,
                                              fontWeight: FontWeight.w800,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                        ],
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            if (recycler.pickupAvailable)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFDCFCE7),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Text('🚚', style: TextStyle(fontSize: 14)),
                                      const SizedBox(width: 6),
                                      Text(AppLocalizations.of(context).t('rec_pickup'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.blue)),
                                    ],
                                  ),
                                )
                            else
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF3F4F6),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Text('🏢', style: TextStyle(fontSize: 14)),
                                      const SizedBox(width: 6),
                                      Text(AppLocalizations.of(context).t('rec_dropoff'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey)),
                                    ],
                                  ),
                                ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {
                                  Navigator.pushNamed(
                                    context, 
                                  '/recycler-details',
                                  arguments: {
                                    'recycler': recycler,
                                    'isSmartFlow': widget.initialCategory != null,
                                    'material': widget.initialCategory,
                                    'lot': widget.lot,
                                  },
                                );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.purpleMedium,
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  minimumSize: const Size.fromHeight(40),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      AppLocalizations.of(context).t('rec_view_details'),
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    const Icon(Icons.arrow_forward, size: 16),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );

                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        cardContent,
                        if (recommendTag != null)
                          Positioned(
                            top: -10,
                            right: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF15803D),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.white, width: 2),
                                boxShadow: const [
                                  BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
                                ],
                              ),
                              child: Text(
                                recommendTag,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}

