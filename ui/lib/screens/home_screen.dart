import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';
import '../data/local_storage.dart';
import 'package:shimmer/shimmer.dart';



class HomeScreen extends StatefulWidget {
  final Function(int) onTabSelected;
  const HomeScreen({super.key, required this.onTabSelected});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Widget _buildShimmer() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 10),
          Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Container(width: 120, height: 20, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(4))),
          ),
          const SizedBox(height: 8),
          Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Container(width: 200, height: 40, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(4))),
          ),
          const SizedBox(height: 24),
          Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Container(
              width: double.infinity,
              height: 140,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),
          const SizedBox(height: 32),
          Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Container(width: 150, height: 20, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(4))),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 180,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              separatorBuilder: (_, __) => const SizedBox(width: 16),
              itemBuilder: (_, __) => Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: Container(
                  width: 150,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;

    if (_isLoading) {
      return _buildShimmer();
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20.0, 24.0, 20.0, 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(
                right: -screenWidth * 0.05,
                top: screenWidth * 0.015,
                child: IgnorePointer(
                  child: Image.asset(
                    'assets/images/hero_combined.png',
                    width: screenWidth * 0.55,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        child: Text(
                          '${AppLocalizations.of(context).language == AppLanguage.en ? 'Hello' : AppLocalizations.of(context).language == AppLanguage.hi ? 'नमस्ते' : 'नमस्कार'} ${LocalStorageService.getCollector().name.split(' ')[0]},',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primaryDark,
                          ),
                        ),
                      ),
                        ListenButton(
                          text: AppLocalizations.of(context).language == AppLanguage.hi
                              ? 'नमस्ते ${LocalStorageService.getCollector().name.split(' ')[0]}, आज आपने क्या जमा किया? फोटो खींचकर ई-कचरे को पहचानने और उसकी कीमत जानने के लिए, नीचे दिए गए नीले ई-कचरा जोड़ें बटन पर क्लिक करें।'
                              : AppLocalizations.of(context).language == AppLanguage.mr
                                  ? 'नमस्कार ${LocalStorageService.getCollector().name.split(' ')[0]}, आज तुम्ही काय जमा केले? फोटो काढून ई-कचरा ओळखण्यासाठी आणि त्याची किंमत तपासण्यासाठी, खालील निळ्या ई-कचरा जोडा बटणावर क्लिक करा.'
                                  : 'Hello ${LocalStorageService.getCollector().name.split(' ')[0]}, what did you collect today? Click the blue Add E-waste button below to take a photo, identify material, and check prices.',
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  RichText(
                    text: TextSpan(
                      style: const TextStyle(
                        fontSize: 34,
                          fontWeight: FontWeight.w900,
                          height: 1.05,
                          letterSpacing: -0.5,
                      ),
                      children: [
                        TextSpan(
                          text: AppLocalizations.of(context).language == AppLanguage.en
                              ? 'What did you\n'
                              : AppLocalizations.of(context).language == AppLanguage.hi
                                  ? 'आज आपने क्या\n'
                                  : 'आज तुम्ही काय\n',
                          style: const TextStyle(color: AppTheme.primaryDark),
                        ),
                        TextSpan(
                          text: AppLocalizations.of(context).language == AppLanguage.en
                              ? 'collect today?'
                              : AppLocalizations.of(context).language == AppLanguage.hi
                                  ? 'इकट्ठा किया?'
                                  : 'गोळा केले?',
                          style: const TextStyle(color: AppTheme.primaryMedium),
                        ),
                      ],
                    ),
                  ),
                            const SizedBox(height: 12),
                  Padding(
                      padding: EdgeInsets.only(right: screenWidth * 0.42),
                      child: Text(
                    AppLocalizations.of(context).t('home_take_photo'),
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 15,
                      height: 1.4,
                      fontWeight: FontWeight.w500,
                    ),
                    ),
                  ),
                  const SizedBox(height: 36),
                  // Add E-Waste Card (Bluish Indigo shade)
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF3B52E1), Color(0xFF4F46E5)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x333B52E1),
                          blurRadius: 16,
                          offset: Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(24),
                        onTap: () {
                          Navigator.pushNamed(context, '/add-batch', arguments: {'autoOpenAI': true});
                        },
                        child: Stack(
                          children: [
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                              child: Row(
                                children: [
                                  Container(
                                    width: 72,
                                    height: 72,
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: const Icon(
                                      Icons.camera_alt_outlined,
                                      color: Colors.white,
                                      size: 38,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.only(right: 80),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(
                                            AppLocalizations.of(context).t('home_add_ewaste'),
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 22,
                                              fontWeight: FontWeight.w800,
                                              letterSpacing: 0.2,
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            AppLocalizations.of(context).t('home_button_subtext'),
                                            style: TextStyle(
                                              color: Colors.white.withValues(alpha: 0.85),
                                              fontSize: 13,
                                              height: 1.3,
                                              fontWeight: FontWeight.w400,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Positioned(
                              right: 16,
                              bottom: 16,
                              child: Container(
                                width: 36,
                                height: 36,
                                decoration: const BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Color(0x1A000000),
                                      blurRadius: 6,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.arrow_forward_rounded,
                                  color: Color(0xFF3B52E1),
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),

            ],
          ),
          // Market Prices Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                AppLocalizations.of(context).t('home_market_prices'),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/prices'),
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.purpleMedium,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      AppLocalizations.of(context).t('home_view_all'),
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_forward_ios, size: 12),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Horizontal Prices List
          SizedBox(
            height: 180,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              clipBehavior: Clip.none,
              itemCount: mockPrices.take(4).length,
              separatorBuilder: (context, index) => const SizedBox(width: 16),
              itemBuilder: (context, index) {
                final item = mockPrices[index];
                final isUp = item.trend == 'up';
                final isDown = item.trend == 'down';
                final trendColor = isUp ? AppColors.green : (isDown ? AppColors.red : AppColors.textSecondary);
                final trendIcon = isUp ? Icons.trending_up : (isDown ? Icons.trending_down : Icons.trending_flat);
                
                return Container(
                  width: 150,
                  clipBehavior: Clip.antiAlias,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderLight),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x08000000),
                        blurRadius: 8,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top Image Section
                      Expanded(
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                              Image.asset(
                                item.imageUrl,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => Container(
                                  color: AppColors.purpleBg,
                                  child: const Center(
                                    child: Icon(Icons.image_not_supported, size: 32, color: AppColors.purpleDark),
                                  ),
                                ),
                              ),
                            // Trend Badge Overlaid on Image
                            Positioned(
                              top: 8,
                              right: 8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.95),
                                  borderRadius: BorderRadius.circular(8),
                                  boxShadow: const [
                                    BoxShadow(
                                      color: Colors.black12,
                                      blurRadius: 4,
                                      offset: Offset(0, 2),
                                    )
                                  ],
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(trendIcon, size: 16, color: trendColor),
                                    const SizedBox(width: 2),
                                    Text(
                                      '${item.trendPercent}%',
                                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: trendColor),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Bottom Text Section
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AppLocalizations.of(context).translateMaterial(item.category),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textDark,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '₹${item.displayPrice}${AppLocalizations.of(context).t('unit_per_kg')}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppColors.purpleMedium,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24),
          // Demo Mode Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.purpleDark.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.purpleDark.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.purpleDark.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.info_outline, color: AppColors.purpleDark, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppLocalizations.of(context).t('home_demo_mode'),
                        style: const TextStyle(
                          color: AppColors.purpleDark,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        AppLocalizations.of(context).t('home_demo_desc'),
                        style: TextStyle(
                          color: AppColors.purpleDark.withValues(alpha: 0.8),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}


