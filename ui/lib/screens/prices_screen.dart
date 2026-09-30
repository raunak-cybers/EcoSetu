import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/shared_widgets.dart';
import '../core/localization.dart';

import 'package:shimmer/shimmer.dart';
class PricesScreen extends StatefulWidget {
  const PricesScreen({super.key});

  @override
  State<PricesScreen> createState() => _PricesScreenState();
}

class _PricesScreenState extends State<PricesScreen> {
  bool _isLoading = true;
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.primaryDark,
        foregroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 80),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppLocalizations.of(context).t('price_today_title'),
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: AppTheme.purpleDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            AppLocalizations.of(context).t('price_today_desc'),
            style: const TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 24),
          if (_isLoading)
            ...List.generate(5, (index) => Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: Container(height: 80, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
              ),
            ))
          else
          ...mockPrices.map((price) {
            Color trendColor;
            IconData trendIcon;
            String trendText;

            if (price.trend == 'up') {
              trendColor = AppTheme.accentGreen;
              trendIcon = Icons.trending_up;
              trendText = '${price.trendPercent}% ${AppLocalizations.of(context).t('price_inc')}';
            } else if (price.trend == 'down') {
              trendColor = AppTheme.accentRed;
              trendIcon = Icons.trending_down;
              trendText = '${price.trendPercent}% ${AppLocalizations.of(context).t('price_dec')}';
            } else {
              trendColor = AppTheme.textSecondary;
              trendIcon = Icons.remove;
              trendText = AppLocalizations.of(context).t('price_no_change');
            }

            return AppCard(
              margin: const EdgeInsets.only(bottom: 10),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: AppTheme.purpleBg,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.asset(
                        price.imageUrl,
                        width: 52,
                        height: 52,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          AppLocalizations.of(context).translateMaterial(price.category),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.purpleDark,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          AppLocalizations.of(context).translateMaterialDesc(price.category),
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '₹${price.displayPrice}${AppLocalizations.of(context).t('unit_per_kg')}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.purpleDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(trendIcon, size: 16, color: trendColor),
                          const SizedBox(width: 4),
                          Text(
                            trendText,
                            style: TextStyle(
                              color: trendColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  ListenButton(
                    text: AppLocalizations.of(context).language == AppLanguage.hi
                        ? '${AppLocalizations.of(context).translateMaterial(price.category)} का आज का भाव ${price.displayPrice} रुपये ${AppLocalizations.of(context).t('unit_per_kg_long')} है, जो पिछले हफ्ते से ${price.trendPercent}% ${price.trend == 'up' ? 'बढ़ा' : 'घटा'} है।'
                        : AppLocalizations.of(context).language == AppLanguage.mr
                            ? '${AppLocalizations.of(context).translateMaterial(price.category)} चा आजचा भाव ${price.displayPrice} रुपये ${AppLocalizations.of(context).t('unit_per_kg_long')} आहे, जो गेल्या आठवड्यापेक्षा ${price.trendPercent}% ने ${price.trend == 'up' ? 'वाढला' : 'कमी झाला'} आहे.'
                            : '${AppLocalizations.of(context).translateMaterial(price.category)} is currently ${price.displayPrice} rupees ${AppLocalizations.of(context).t('unit_per_kg_long')}, which has been ${price.trend == 'up' ? 'increased' : 'decreased'} by ${price.trendPercent}%.',
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
      ),
    );
  }
}


