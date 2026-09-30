import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../widgets/shared_widgets.dart';
import '../data/mock_data.dart';
import '../data/local_storage.dart';
import '../core/localization.dart';
import '../main.dart';

import 'package:intl/intl.dart';

class EarningsScreen extends StatefulWidget {
  const EarningsScreen({super.key});

  @override
  State<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends State<EarningsScreen> {

  String _formatCurrency(int amount) {
    final format = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    return format.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    final payments = LocalStorageService.getPayments();
    final collector = LocalStorageService.getCollector();

    final pendingPayments = payments.where((p) => p.status == 'pending').toList();
    final receivedPayments = payments.where((p) => p.status == 'received').toList();
    final batches = LocalStorageService.getBatches();
    int disputedCount = 0;
    for (var b in batches) {
      for (var l in b.lots) {
        if (l.paymentStatus == 'disputed' || l.handoverStatus == 'declined' || l.handoverStatus == 'disputed' || b.status == 'disputed') {
          disputedCount++;
        }
      }
    }
    final disputedLotsCount = disputedCount;
    final hasActiveDispute = disputedLotsCount > 0;
    
    // Compute total earnings dynamically
    final totalEarned = receivedPayments.fold(0, (sum, p) => sum + p.amount);
    final realCumulativeSavings = (LocalStorageService.getAllLots().where((l) => l.verifiedWeight != null).fold(0.0, (sum, l) => sum + l.verifiedWeight!) * 2.5).toInt();


    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppLocalizations.of(context).t('earn_title'),
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.primaryDark,
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // HERO SECTION (Unified Card with Dispute Banner)
                  Container(
                    width: double.infinity,
                    clipBehavior: Clip.antiAlias,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.purpleMedium, AppTheme.purpleDark], // Premium Dark Blue gradient
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.purpleMedium.withValues(alpha: 0.3),
                          blurRadius: 24,
                          offset: const Offset(0, 12),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // Decorative background elements
                        Positioned(
                          right: -30,
                          top: -30,
                          child: Container(
                            width: 140,
                            height: 140,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white.withValues(alpha: 0.05),
                            ),
                          ),
                        ),
                        Positioned(
                          right: 60,
                          bottom: -40,
                          child: Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white.withValues(alpha: 0.05),
                            ),
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        width: 36,
                                        height: 36,
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Icon(Icons.account_balance_wallet, color: Colors.white, size: 20),
                                      ),
                                      const SizedBox(width: 12),
                                      Text(
                                        AppLocalizations.of(context).t('earn_total'),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ]
                                  ),
                                  ListenButton(
                                    text: AppLocalizations.of(context).language == AppLanguage.hi
                                        ? 'आपने अब तक कुल $totalEarned रुपये कमाए हैं। आपने औपचारिक रिसाइकिलर्स को बेचकर $realCumulativeSavings रुपये अधिक कमाए हैं!'
                                        : AppLocalizations.of(context).language == AppLanguage.mr
                                            ? 'तुम्ही आतापर्यंत एकूण $totalEarned रुपये कमावले आहेत. अधिकृत रिसायकलर्सना विकून तुम्ही $realCumulativeSavings रुपये अधिक कमावले आहेत!'
                                            : 'You have earned a total of $totalEarned rupees. You have earned $realCumulativeSavings rupees more by selling to formal recyclers!',
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                _formatCurrency(totalEarned),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 42,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1,
                                ),
                              ),

                            ],
                          ),
                        ),
                        
                        // Active Payment Dispute Flag inside the card at the bottom
                        if (hasActiveDispute)
                          Builder(builder: (ctx) {
                            final String disputeText = AppLocalizations.of(context).language == AppLanguage.hi
                                ? '$disputedLotsCount विवादित लॉट सक्रिय हैं'
                                : AppLocalizations.of(context).language == AppLanguage.mr
                                    ? '$disputedLotsCount विवादित लॉट सक्रिय आहेत'
                                    : '$disputedLotsCount Disputed Lot${disputedLotsCount > 1 ? 's' : ''} Active';
                            return GestureDetector(
                              onTap: () {
                                try {
                                  Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(builder: (_) => const MainShell(initialIndex: 1, initialCategory: 'disputed')),
                                  );
                                } catch (e) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(AppLocalizations.of(context).t('toast_lot_not_found'))),
                                  );
                                }
                              },
                              child: Container(
                                width: double.infinity,
                                margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFFF1F2),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFFFECDD3)),
                                ),
                                child: Row(
                                  children: [
                                    const PulsingAlertIcon(),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        disputeText,
                                        style: const TextStyle(
                                          color: Color(0xFFE11D48),
                                          fontWeight: FontWeight.w900,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      width: 32, height: 32,
                                      decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFFFE4E6)),
                                      child: const Icon(Icons.chevron_right, color: Color(0xFFE11D48), size: 20),
                                    )
                                  ],
                                ),
                              ),
                            );
                          }),
                      ],
                    ),
                  ],
                ),
              ),
                  
                  const SizedBox(height: 24),
                  
                  // Cumulative Savings Banner (Formal vs Informal)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    decoration: BoxDecoration(
                      color: AppTheme.accentGreen.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.accentGreen.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.accentGreen,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.trending_up, color: Colors.white, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(text: AppLocalizations.of(context).t('earn_savings_banner1')),
                                    TextSpan(text: _formatCurrency(collector.cumulativeSavings)),
                                    TextSpan(
                                      text: AppLocalizations.of(context).t('earn_savings_banner2'),
                                    ),
                                  ],
                                ),
                                style: const TextStyle(
                                  color: AppTheme.textDark,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Transactions List Header
                  Text(
                    AppLocalizations.of(context).t('earn_transactions'),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textDark,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
          
          // Transactions List
          (pendingPayments.isEmpty && receivedPayments.isEmpty)
          ? SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
                child: Column(
                  children: [
                    Icon(Icons.receipt_long, size: 64, color: AppTheme.textSecondary.withValues(alpha: 0.3)),
                    const SizedBox(height: 16),
                    Text(
                      AppLocalizations.of(context).t('empty_earnings_title'),
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      AppLocalizations.of(context).t('empty_earnings_desc'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              ),
            )
          : SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20).copyWith(bottom: 40),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                  // Show pending first, then received
                  final payment = index < pendingPayments.length 
                      ? pendingPayments[index] 
                      : receivedPayments[index - pendingPayments.length];
                  
                  final isPending = payment.status == 'pending';
                  
                  // Fix thumbnail binding to match correct Lot
                  String thumbnailPath = 'assets/images/materials/pcb.png'; // Fallback
                  Lot? associatedLot;
                  
                  if (payment.lotId != null) {
                    try {
                      associatedLot = LocalStorageService.getAllLots().firstWhere((l) => l.lotId == payment.lotId);
                      thumbnailPath = associatedLot.imageUrl;
                    } catch (e) {
                      // Lot not found
                    }
                  }
                  
                  if (associatedLot == null) {
                    try {
                      final priceItem = mockPrices.firstWhere(
                        (p) => payment.material.toLowerCase().contains(p.category.toLowerCase()) || 
                               p.category.toLowerCase().contains(payment.material.toLowerCase())
                      );
                      thumbnailPath = priceItem.imageUrl;
                    } catch (e) {
                      // Fallback
                    }
                  }

                  return GestureDetector(
                    onTap: () {
                      if (associatedLot != null) {
                        Navigator.pushNamed(context, '/lot-details', arguments: {'lot': associatedLot, 'hideTimelineAndQR': true});
                      }
                    },
                    child: AppCard(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          // Material Image/Icon
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: AppTheme.background,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppTheme.borderLight),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.asset(
                                thumbnailPath,
                                fit: BoxFit.cover,
                                errorBuilder: (ctx, err, stack) => const Icon(
                                  Icons.image_not_supported, 
                                  color: AppTheme.textSecondary
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          // Details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        AppLocalizations.of(context).translateMaterial(payment.material),
                                        style: const TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme.textDark,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    Text(
                                      payment.hasDispute ? _formatCurrency(payment.amount) : '+${_formatCurrency(payment.amount)}',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: payment.hasDispute ? FontWeight.w600 : FontWeight.w900,
                                        color: payment.hasDispute 
                                            ? AppTheme.textSecondary 
                                            : (isPending ? AppTheme.textDark : AppTheme.accentGreen),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Text(
                                      '${payment.weight} ${AppLocalizations.of(context).t('unit_kg')}',
                                      style: const TextStyle(
                                        fontSize: 13,
                                        color: AppTheme.textSecondary,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const Text(' • ', style: TextStyle(color: AppTheme.textSecondary)),
                                    Expanded(
                                      child: Text(
                                        payment.recycler,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          color: AppTheme.textSecondary,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                // Status Pill
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: payment.hasDispute
                                            ? AppTheme.accentRed.withValues(alpha: 0.1)
                                            : (isPending
                                                ? AppTheme.accentOrange.withValues(alpha: 0.1)
                                                : AppTheme.accentGreen.withValues(alpha: 0.1)),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        payment.hasDispute 
                                            ? AppLocalizations.of(context).t('earn_disputed') 
                                            : (isPending ? AppLocalizations.of(context).t('earn_pending_pill') : AppLocalizations.of(context).t('earn_paid')),
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w700,
                                          color: payment.hasDispute
                                              ? AppTheme.accentRed
                                              : (isPending ? AppTheme.accentOrange : AppTheme.accentGreen),
                                        ),
                                      ),
                                    ),
                                    Text(
                                      payment.date,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: AppTheme.textSecondary,
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
                childCount: pendingPayments.length + receivedPayments.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class PulsingAlertIcon extends StatefulWidget {
  const PulsingAlertIcon({super.key});

  @override
  State<PulsingAlertIcon> createState() => _PulsingAlertIconState();
}

class _PulsingAlertIconState extends State<PulsingAlertIcon> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat(reverse: true);
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: Container(
        width: 36, height: 36,
        decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFFFE4E6)),
        child: Center(
          child: Container(
            width: 22, height: 22,
            decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFE11D48)),
            child: const Icon(Icons.priority_high, color: Colors.white, size: 14),
          )
        )
      ),
    );
  }
}
