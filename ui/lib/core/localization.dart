import 'package:flutter/material.dart';

enum AppLanguage { en, hi, mr }

class AppTranslations {
  static final Map<String, Map<AppLanguage, String>> _strings = {
    // Nav Bar
    'nav_home': {
      AppLanguage.en: 'Home',
      AppLanguage.hi: 'होम',
      AppLanguage.mr: 'मुख्यपृष्ठ'
    },
    'nav_my_lots': {
      AppLanguage.en: 'My Lots',
      AppLanguage.hi: 'मेरे लॉट',
      AppLanguage.mr: 'माझे लॉट्स'
    },
    'nav_earnings': {
      AppLanguage.en: 'Earnings',
      AppLanguage.hi: 'कमाई',
      AppLanguage.mr: 'कमाई'
    },
    'nav_recyclers': {
      AppLanguage.en: 'Recyclers',
      AppLanguage.hi: 'रीसायकलर्स',
      AppLanguage.mr: 'रीसायकलर्स'
    },
    'nav_profile': {
      AppLanguage.en: 'Profile',
      AppLanguage.hi: 'प्रोफ़ाइल',
      AppLanguage.mr: 'प्रोफाईल'
    },

    // Global
    'no_internet': {
      AppLanguage.en: 'No Internet Connection',
      AppLanguage.hi: 'कोई इंटरनेट कनेक्शन नहीं',
      AppLanguage.mr: 'इंटरनेट कनेक्शन नाही'
    },
    
    // Home Screen
    'home_hello_ramesh': {
      AppLanguage.en: 'Hello, Ramesh!',
      AppLanguage.hi: 'नमस्ते, रमेश!',
      AppLanguage.mr: 'नमस्कार, रमेश!'
    },
    'home_collect_today': {
      AppLanguage.en: 'What did you\ncollect today?',
      AppLanguage.hi: 'आज आपने क्या\nइकट्ठा किया?',
      AppLanguage.mr: 'आज तुम्ही काय\nगोळा केले?'
    },
    'home_add_ewaste': {
      AppLanguage.en: 'Add E-Waste',
      AppLanguage.hi: 'ई-कचरा जोड़ें',
      AppLanguage.mr: 'ई-कचरा जोडा'
    },
    'home_take_photo': {
      AppLanguage.en: "Know what it's worth, then choose who to sell to.",
      AppLanguage.hi: 'जानें इसकी कीमत क्या है, फिर चुनें कि किसे बेचना है।',
      AppLanguage.mr: 'त्याची किंमत काय आहे ते जाणून घ्या, मग कोणाला विकायचे ते ठरवा.',
    },
    'home_button_subtext': {
      AppLanguage.en: 'Take a photo to identify material and check prices',
      AppLanguage.hi: 'सामग्री पहचानने और कीमतें जांचने के लिए फोटो लें',
      AppLanguage.mr: 'सामग्री ओळखण्यासाठी आणि किमती तपासण्यासाठी फोटो घ्या',
    },
    'home_market_prices': {
      AppLanguage.en: 'Today\'s Market Prices',
      AppLanguage.hi: 'आज के बाज़ार भाव',
      AppLanguage.mr: 'आजचे बाजारभाव'
    },
    'home_view_all': {
      AppLanguage.en: 'View All',
      AppLanguage.hi: 'सभी देखें',
      AppLanguage.mr: 'सर्व पहा'
    },
    'home_demo_mode': {
      AppLanguage.en: 'App Demo Mode',
      AppLanguage.hi: 'ऐप डेमो मोड',
      AppLanguage.mr: 'ॲप डेमो मोड'
    },
    'home_demo_desc': {
      AppLanguage.en: 'This is a prototype. All recyclers and values shown are for demonstration purposes.',
      AppLanguage.hi: 'यह एक प्रोटोटाइप है। दिखाए गए सभी रिसाइकलर्स और मूल्य केवल प्रदर्शन के लिए हैं।',
      AppLanguage.mr: 'हा एक नमुना आहे. दर्शविलेले सर्व रिसायकलर्स आणि मूल्ये केवळ प्रदर्शनासाठी आहेत.'
    },

    // Add Batch Screen
    'add_capture': {
      AppLanguage.en: 'Capture',
      AppLanguage.hi: 'कैप्चर',
      AppLanguage.mr: 'कॅप्चर'
    },
    'add_verify': {
      AppLanguage.en: 'Verify',
      AppLanguage.hi: 'सत्यापित करें',
      AppLanguage.mr: 'सत्यापित करा'
    },
    'add_weight': {
      AppLanguage.en: 'Weight',
      AppLanguage.hi: 'वजन',
      AppLanguage.mr: 'वजन'
    },
    'add_receipt': {
      AppLanguage.en: 'Receipt',
      AppLanguage.hi: 'रसीद',
      AppLanguage.mr: 'पावती'
    },
    'add_capture_ewaste': {
      AppLanguage.en: 'Capture E-Waste',
      AppLanguage.hi: 'ई-कचरा कैप्चर करें',
      AppLanguage.mr: 'ई-कचरा कॅप्चर करा'
    },
    'add_take_photo': {
      AppLanguage.en: 'Take a Photo',
      AppLanguage.hi: 'फोटो लें',
      AppLanguage.mr: 'फोटो काढा'
    },
    'add_choose_gallery': {
      AppLanguage.en: 'Choose from Gallery',
      AppLanguage.hi: 'गैलरी से चुनें',
      AppLanguage.mr: 'गॅलरीतून निवडा'
    },
    'add_verify_material': {
      AppLanguage.en: 'Verify Material',
      AppLanguage.hi: 'सामग्री सत्यापित करें',
      AppLanguage.mr: 'सामग्री सत्यापित करा'
    },
    'add_material_condition': {
      AppLanguage.en: 'Material Condition',
      AppLanguage.hi: 'सामग्री की स्थिति',
      AppLanguage.mr: 'सामग्रीची स्थिती'
    },
    'add_enter_weight': {
      AppLanguage.en: 'Enter approximate weight',
      AppLanguage.hi: 'अनुमानित वजन दर्ज करें',
      AppLanguage.mr: 'अंदाजे वजन प्रविष्ट करा'
    },
    'add_lot_summary': {
      AppLanguage.en: 'Lot Summary',
      AppLanguage.hi: 'लॉट सारांश',
      AppLanguage.mr: 'लॉट सारांश'
    },
    'add_edit': {
      AppLanguage.en: 'Edit',
      AppLanguage.hi: 'संपादित करें',
      AppLanguage.mr: 'संपादित करा'
    },
    'add_tap_photo': {
      AppLanguage.en: 'Tap to attach a photo',
      AppLanguage.hi: 'फोटो जोड़ने के लिए टैप करें',
      AppLanguage.mr: 'फोटो जोडण्यासाठी टॅप करा'
    },
    'add_est_total': {
      AppLanguage.en: 'Estimated Total',
      AppLanguage.hi: 'अनुमानित कुल',
      AppLanguage.mr: 'अंदाजे एकूण'
    },
    'add_cancel': {
      AppLanguage.en: 'Cancel',
      AppLanguage.hi: 'रद्द करें',
      AppLanguage.mr: 'रद्द करा'
    },
    'add_confirm_qr': {
      AppLanguage.en: 'Confirm & Generate QR',
      AppLanguage.hi: 'पुष्टि करें और QR बनाएं',
      AppLanguage.mr: 'पुष्टी करा आणि QR तयार करा'
    },
    'add_sell_ewaste': {
      AppLanguage.en: 'Sell E-Waste',
      AppLanguage.hi: 'ई-कचरा बेचें',
      AppLanguage.mr: 'ई-कचरा विका'
    },
    'add_skip': {
      AppLanguage.en: 'Skip',
      AppLanguage.hi: 'छोड़ें',
      AppLanguage.mr: 'वगळा'
    },
    'add_ai_analyzing': {
      AppLanguage.en: 'AI Analyzing Item...',
      AppLanguage.hi: 'AI आइटम का विश्लेषण कर रहा है...',
      AppLanguage.mr: 'AI आयटमचे विश्लेषण करत आहे...'
    },
    'add_back': {
      AppLanguage.en: 'Back',
      AppLanguage.hi: 'वापस',
      AppLanguage.mr: 'मागे'
    },
    'add_continue': {
      AppLanguage.en: 'Continue',
      AppLanguage.hi: 'जारी रखें',
      AppLanguage.mr: 'पुढे सुरू ठेवा'
    },
    'add_reviewing': {
      AppLanguage.en: 'Reviewing Lot...',
      AppLanguage.hi: 'लॉट की समीक्षा हो रही है...',
      AppLanguage.mr: 'लॉटचे पुनरावलोकन करत आहे...'
    },
    'add_err_material': {
      AppLanguage.en: 'Please select a material.',
      AppLanguage.hi: 'कृपया एक सामग्री चुनें।',
      AppLanguage.mr: 'कृपया एक सामग्री निवडा.'
    },
    'add_err_weight': {
      AppLanguage.en: 'Weight must be greater than 0.',
      AppLanguage.hi: 'वजन 0 से अधिक होना चाहिए।',
      AppLanguage.mr: 'वजन 0 पेक्षा जास्त असणे आवश्यक आहे.'
    },
    'add_view_lots': {
      AppLanguage.en: 'View Lot',
      AppLanguage.hi: 'लॉट देखें',
      AppLanguage.mr: 'लॉट पहा'
    },
    'add_confirming': {
      AppLanguage.en: 'Confirming...',
      AppLanguage.hi: 'पुष्टि हो रही है...',
      AppLanguage.mr: 'पुष्टी करत आहे...'
    },
    'rd_address': {
      AppLanguage.en: 'Address',
      AppLanguage.hi: 'पता',
      AppLanguage.mr: 'पत्ता'
    },
    'rd_operating_hours': {
      AppLanguage.en: 'Operating Hours',
      AppLanguage.hi: 'काम के घंटे',
      AppLanguage.mr: 'कामाचे तास'
    },
    'rd_hours_desc': {
      AppLanguage.en: 'Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed',
      AppLanguage.hi: 'सोम - शनि: सुबह 9:00 - शाम 6:00\nरविवार: बंद',
      AppLanguage.mr: 'सोम - शनी: सकाळी 9:00 - संध्याकाळी 6:00\nरविवार: बंद'
    },
    'offline_banner_title': {
      AppLanguage.en: 'No Internet Connection',
      AppLanguage.hi: 'इंटरनेट कनेक्शन नहीं है',
      AppLanguage.mr: 'इंटरनेट कनेक्शन नाही'
    },
    'offline_banner_desc': {
      AppLanguage.en: 'Don\'t worry, your data is safely saved and will sync automatically when you\'re back online!',
      AppLanguage.hi: 'चिंता न करें, आपका डेटा सुरक्षित है और ऑनलाइन होने पर अपने आप सिंक हो जाएगा!',
      AppLanguage.mr: 'काळजी करू नका, तुमचा डेटा सुरक्षित आहे आणि ऑनलाइन झाल्यावर आपोआप सिंक होईल!'
    },
    'safe_batt_tip': {
      AppLanguage.en: 'Never puncture or crack open batteries!',
      AppLanguage.hi: 'बैटरियों को कभी भी पंचर न करें या न खोलें!',
      AppLanguage.mr: 'बॅटरी कधीही पंचर करू नका किंवा फोडू नका!'
    },
    'safe_batt_risk': {
      AppLanguage.en: 'Damaged batteries can leak acid or catch fire.',
      AppLanguage.hi: 'क्षतिग्रस्त बैटरियों से एसिड रिस सकता है या आग लग सकती है।',
      AppLanguage.mr: 'खराब झालेल्या बॅटरींमधून ऍसिड गळू शकते किंवा आग लागू शकते.'
    },
    'safe_batt_benefit': {
      AppLanguage.en: 'Intact batteries are safer to handle and easier to weigh accurately.',
      AppLanguage.hi: 'साबुत बैटरियों को संभालना सुरक्षित है और सटीक वजन करना आसान है।',
      AppLanguage.mr: 'अखंड बॅटरी हाताळण्यास सुरक्षित असतात आणि अचूक वजन करणे सोपे असते.'
    },
    'safe_crt_tip': {
      AppLanguage.en: 'Handle CRT glass carefully to avoid shattering!',
      AppLanguage.hi: 'टूटे-फूटे से बचने के लिए सीआरटी ग्लास को सावधानी से संभालें!',
      AppLanguage.mr: 'तुकडे होऊ नये म्हणून सीआरटी ग्लास काळजीपूर्वक हाताळा!'
    },
    'safe_crt_risk': {
      AppLanguage.en: 'Broken CRT glass can release toxic dust.',
      AppLanguage.hi: 'टूटा हुआ सीआरटी ग्लास जहरीली धूल छोड़ सकता है।',
      AppLanguage.mr: 'तुटलेला सीआरटी ग्लास विषारी धूळ सोडू शकतो.'
    },
    'safe_crt_benefit': {
      AppLanguage.en: 'Keeping it whole helps avoid breakage and preserves its value.',
      AppLanguage.hi: 'इसे साबुत रखने से टूटने से बचा जा सकता है और इसका मूल्य बना रहता है।',
      AppLanguage.mr: 'ते अखंड ठेवल्याने तुटणे टाळण्यास मदत होते आणि त्याचे मूल्य टिकून राहते.'
    },
    'safe_cable_tip': {
      AppLanguage.en: 'Never burn cables to extract copper!',
      AppLanguage.hi: 'तांबा निकालने के लिए केबल को कभी न जलाएं!',
      AppLanguage.mr: 'तांबे काढण्यासाठी केबल्स कधीही जाळू नका!'
    },
    'safe_cable_benefit': {
      AppLanguage.en: 'Unburnt cables retain their material value and avoid the harmful smoke burning creates.',
      AppLanguage.hi: 'बिना जले हुए केबल अपना मूल्य बनाए रखते हैं और हानिकारक धुएं से बचते हैं।',
      AppLanguage.mr: 'न जळलेल्या केबल्स त्यांचे मूल्य टिकवून ठेवतात आणि हानिकारक धूर टाळतात.'
    },
    'safe_pcb_tip': {
      AppLanguage.en: 'Do not break or snap circuit boards!',
      AppLanguage.hi: 'सर्किट बोर्ड को न तोड़ें!',
      AppLanguage.mr: 'सर्किट बोर्ड तोडू नका!'
    },
    'safe_pcb_benefit': {
      AppLanguage.en: 'Keeping boards intact helps preserve the microchips and precious metals recyclers can recover.',
      AppLanguage.hi: 'बोर्ड को साबुत रखने से माइक्रोचिप और कीमती धातुओं को बचाया जा सकता है।',
      AppLanguage.mr: 'बोर्ड अखंड ठेवल्याने मायक्रोचिप आणि मौल्यवान धातू जतन करण्यात मदत होते.'
    },
    'safe_lcd_tip': {
      AppLanguage.en: 'Handle screens gently to avoid cracking!',
      AppLanguage.hi: 'टूटे-फूटे से बचने के लिए स्क्रीन को धीरे से संभालें!',
      AppLanguage.mr: 'क्रॅक होऊ नये म्हणून स्क्रीन काळजीपूर्वक हाताळा!'
    },
    'safe_lcd_benefit': {
      AppLanguage.en: 'Uncracked panels may be refurbished or reused, which helps preserve their value.',
      AppLanguage.hi: 'बिना टूटे पैनल को फिर से इस्तेमाल किया जा सकता है, जिससे उनका मूल्य बना रहता है।',
      AppLanguage.mr: 'क्रॅक नसलेले पॅनेल पुन्हा वापरले जाऊ शकतात, ज्यामुळे त्यांचे मूल्य टिकून राहते.'
    },
    'add_find_recyclers': {
      AppLanguage.en: 'Find Recyclers',
      AppLanguage.hi: 'रीसायकलर्स खोजें',
      AppLanguage.mr: 'रीसायकलर्स शोधा'
    },
    'cond_clean': {
      AppLanguage.en: 'Clean',
      AppLanguage.hi: 'साफ',
      AppLanguage.mr: 'स्वच्छ'
    },
    'cond_broken': {
      AppLanguage.en: 'Broken',
      AppLanguage.hi: 'टूटा हुआ',
      AppLanguage.mr: 'तुटलेले'
    },
    'cond_burnt': {
      AppLanguage.en: 'Burnt',
      AppLanguage.hi: 'जला हुआ',
      AppLanguage.mr: 'जळलेले'
    },
    'cond_rusted': {
      AppLanguage.en: 'Rusted/Wet',
      AppLanguage.hi: 'जंग लगा/गीला',
      AppLanguage.mr: 'गंजलेले/ओले'
    },
    'cond_working': {
      AppLanguage.en: 'Working',
      AppLanguage.hi: 'चालू',
      AppLanguage.mr: 'चालू'
    },
    'cond_not_working': {
      AppLanguage.en: 'Not Working',
      AppLanguage.hi: 'बंद/खराब',
      AppLanguage.mr: 'बंद/खराब'
    },

    // My Lots Screen
    'mylots_title': {
      AppLanguage.en: 'My Lots',
      AppLanguage.hi: 'मेरे लॉट',
      AppLanguage.mr: 'माझे लॉट्स'
    },
    'mylots_subtitle': {
      AppLanguage.en: 'Items you have collected',
      AppLanguage.hi: 'आपके द्वारा एकत्र किए गए आइटम',
      AppLanguage.mr: 'तुम्ही गोळा केलेले आयटम'
    },
    'mylots_new_batch': {
      AppLanguage.en: 'Add New Lot',
      AppLanguage.hi: 'नया लॉट जोड़ें',
      AppLanguage.mr: 'नवीन लॉट जोडा'
    },
    'mylots_tab_all': {
      AppLanguage.en: 'All',
      AppLanguage.hi: 'सभी',
      AppLanguage.mr: 'सर्व'
    },
    'mylots_tab_progress': {
      AppLanguage.en: 'In Progress',
      AppLanguage.hi: 'प्रगति पर',
      AppLanguage.mr: 'प्रगतीपथावर'
    },
    'mylots_tab_completed': {
      AppLanguage.en: 'Completed',
      AppLanguage.hi: 'पूरा हुआ',
      AppLanguage.mr: 'पूर्ण झाले'
    },
    'mylots_tab_disputed': {
      AppLanguage.en: 'Disputed',
      AppLanguage.hi: 'विवादित',
      AppLanguage.mr: 'विवादित'
    },
    'mylots_delete_title': {
      AppLanguage.en: 'Delete Lot?',
      AppLanguage.hi: 'लॉट हटाएं?',
      AppLanguage.mr: 'लॉट हटवायचा?'
    },
    'mylots_delete_desc': {
      AppLanguage.en: 'Are you sure you want to delete this lot? This action cannot be undone.',
      AppLanguage.hi: 'क्या आप वाकई इस लॉट को हटाना चाहते हैं? इसे वापस नहीं लाया जा सकता।',
      AppLanguage.mr: 'तुम्हाला खात्री आहे की तुम्ही हा लॉट हटवू इच्छिता? ही कृती पूर्ववत केली जाऊ शकत नाही.'
    },
    'mylots_deleted_msg': {
      AppLanguage.en: 'Lot deleted successfully',
      AppLanguage.hi: 'लॉट सफलतापूर्वक हटा दिया गया',
      AppLanguage.mr: 'लॉट यशस्वीरित्या हटवला'
    },
    'mylots_delete_btn': {
      AppLanguage.en: 'Delete',
      AppLanguage.hi: 'हटाएं',
      AppLanguage.mr: 'हटवा'
    },
    'mylots_empty_title': {
      AppLanguage.en: 'No lots here',
      AppLanguage.hi: 'यहां कोई लॉट नहीं है',
      AppLanguage.mr: 'येथे कोणतेही लॉट्स नाहीत'
    },
    'mylots_empty_desc': {
      AppLanguage.en: 'Tap "Add E-Waste" above to add your first lot.',
      AppLanguage.hi: 'अपना पहला लॉट जोड़ने के लिए ऊपर "ई-कचरा जोड़ें" पर टैप करें।',
      AppLanguage.mr: 'तुमचा पहिला लॉट जोडण्यासाठी वर "ई-कचरा जोडा" टॅप करा.'
    },

    // Earnings Screen
    'earn_title': {
      AppLanguage.en: 'My Earnings',
      AppLanguage.hi: 'मेरी कमाई',
      AppLanguage.mr: 'माझी कमाई'
    },
    'earn_total': {
      AppLanguage.en: 'Total Earned (All Time)',
      AppLanguage.hi: 'कुल कमाई (अब तक)',
      AppLanguage.mr: 'एकूण कमाई (आत्तापर्यंत)'
    },
    'earn_pending': {
      AppLanguage.en: 'Pending Amount',
      AppLanguage.hi: 'लंबित राशि',
      AppLanguage.mr: 'प्रलंबित रक्कम'
    },
    'earn_dispute': {
      AppLanguage.en: '1 Payment Dispute Active',
      AppLanguage.hi: '1 भुगतान विवाद सक्रिय',
      AppLanguage.mr: '1 पेमेंट विवाद सक्रिय'
    },
    'earn_savings_banner1': {
      AppLanguage.en: 'You\'ve earned ',
      AppLanguage.hi: 'आपने ',
      AppLanguage.mr: 'तुम्ही '
    },
    'earn_savings_banner2': {
      AppLanguage.en: ' more than your usual dealer would have paid, so far!',
      AppLanguage.hi: ' अधिक कमाया है, जितना आपका सामान्य डीलर देता, अब तक!',
      AppLanguage.mr: ' अधिक कमावले आहे, जे तुमचा नेहमीचा डीलर देईल त्यापेक्षा, आत्तापर्यंत!'
    },
    'earn_transactions': {
      AppLanguage.en: 'Transactions',
      AppLanguage.hi: 'लेन-देन',
      AppLanguage.mr: 'व्यवहार'
    },
    'earn_disputed': {
      AppLanguage.en: 'Disputed',
      AppLanguage.hi: 'विवादित',
      AppLanguage.mr: 'विवादित'
    },
    'earn_pending_pill': {
      AppLanguage.en: 'Pending',
      AppLanguage.hi: 'लंबित',
      AppLanguage.mr: 'प्रलंबित'
    },
    'earn_paid': {
      AppLanguage.en: 'Paid',
      AppLanguage.hi: 'भुगतान किया',
      AppLanguage.mr: 'पेड'
    },

    // Profile Screen
    'profile_collector': {
      AppLanguage.en: 'Collector • ',
      AppLanguage.hi: 'कलेक्टर • ',
      AppLanguage.mr: 'कलेक्टर • '
    },
    'profile_total_lots': {
      AppLanguage.en: 'Total lots',
      AppLanguage.hi: 'कुल लॉट',
      AppLanguage.mr: 'एकूण लॉट्स'
    },
    'profile_total_earnings': {
      AppLanguage.en: 'Total earnings',
      AppLanguage.hi: 'कुल कमाई',
      AppLanguage.mr: 'एकूण कमाई'
    },
    'profile_completed': {
      AppLanguage.en: 'Completed',
      AppLanguage.hi: 'पूरा हुआ',
      AppLanguage.mr: 'पूर्ण'
    },
    'profile_settings': {
      AppLanguage.en: 'Settings',
      AppLanguage.hi: 'सेटिंग्स',
      AppLanguage.mr: 'सेटिंग्ज'
    },
    'profile_lang': {
      AppLanguage.en: 'Language',
      AppLanguage.hi: 'भाषा',
      AppLanguage.mr: 'भाषा'
    },
    'profile_lang_desc': {
      AppLanguage.en: 'Change the language of the app',
      AppLanguage.hi: 'ऐप की भाषा बदलें',
      AppLanguage.mr: 'ॲपची भाषा बदला'
    },
    'profile_voice_mode': {
      AppLanguage.en: 'Voice Guidance',
      AppLanguage.hi: 'वॉइस गाइडेंस',
      AppLanguage.mr: 'आवाज मार्गदर्शन'
    },
    'profile_voice_mode_desc': {
      AppLanguage.en: 'Enable audio instructions',
      AppLanguage.hi: 'ऑडियो निर्देश चालू करें',
      AppLanguage.mr: 'ऑडिओ सूचना चालू करा'
    },
    'profile_privacy': {
      AppLanguage.en: 'Privacy Policy',
      AppLanguage.hi: 'गोपनीयता नीति',
      AppLanguage.mr: 'गोपनीयता धोरण'
    },

    'profile_sync': {
      AppLanguage.en: 'Internet sync',
      AppLanguage.hi: 'इंटरनेट सिंक',
      AppLanguage.mr: 'इंटरनेट सिंक'
    },
    'profile_sync_desc': {
      AppLanguage.en: 'Saves data automatically',
      AppLanguage.hi: 'डेटा स्वचालित रूप से सहेजता है',
      AppLanguage.mr: 'डेटा स्वयंचलितपणे सेव्ह करते'
    },
    'profile_notif': {
      AppLanguage.en: 'Notifications',
      AppLanguage.hi: 'सूचनाएं',
      AppLanguage.mr: 'सूचना'
    },
    'profile_notif_desc': {
      AppLanguage.en: 'Get updates on your lots',
      AppLanguage.hi: 'अपने लॉट पर अपडेट प्राप्त करें',
      AppLanguage.mr: 'तुमच्या लॉट्सवर अपडेट्स मिळवा'
    },
    'profile_safety': {
      AppLanguage.en: 'Safety Tips',
      AppLanguage.hi: 'सुरक्षा सुझाव',
      AppLanguage.mr: 'सुरक्षा टिप्स'
    },
    'profile_safety_desc': {
      AppLanguage.en: 'How to handle scrap safely',
      AppLanguage.hi: 'कबाड़ को सुरक्षित रूप से कैसे संभालें',
      AppLanguage.mr: 'स्क्रॅप सुरक्षितपणे कसे हाताळावे'
    },
    'profile_help': {
      AppLanguage.en: 'Help & Support',
      AppLanguage.hi: 'मदद और समर्थन',
      AppLanguage.mr: 'मदत आणि समर्थन'
    },
    'profile_help_desc': {
      AppLanguage.en: 'Call us for any help',
      AppLanguage.hi: 'किसी भी मदद के लिए हमें कॉल करें',
      AppLanguage.mr: 'कोणत्याही मदतीसाठी आम्हाला कॉल करा'
    },
    'profile_logout': {
      AppLanguage.en: 'Log out',
      AppLanguage.hi: 'लॉग आउट',
      AppLanguage.mr: 'लॉग आउट'
    },

    // Edit Profile Screen
    'ep_title': {
      AppLanguage.en: 'Edit Profile',
      AppLanguage.hi: 'प्रोफ़ाइल संपादित करें',
      AppLanguage.mr: 'प्रोफाइल संपादित करा'
    },
    'ep_verify_phone': {
      AppLanguage.en: 'Verify Phone Number',
      AppLanguage.hi: 'फोन नंबर सत्यापित करें',
      AppLanguage.mr: 'फोन नंबर सत्यापित करा'
    },
    'ep_enter_otp': {
      AppLanguage.en: 'Enter the 4-digit OTP sent to ',
      AppLanguage.hi: 'भेजा गया 4-अंकीय OTP दर्ज करें ',
      AppLanguage.mr: 'पाठवलेला 4-अंकी OTP प्रविष्ट करा '
    },
    'ep_success': {
      AppLanguage.en: 'Profile updated successfully',
      AppLanguage.hi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई',
      AppLanguage.mr: 'प्रोफाइल यशस्वीरित्या अपडेट केली'
    },
    'ep_verify_save': {
      AppLanguage.en: 'Verify & Save',
      AppLanguage.hi: 'सत्यापित करें और सहेजें',
      AppLanguage.mr: 'सत्यापित करा आणि जतन करा'
    },
    'ep_invalid_otp': {
      AppLanguage.en: 'Please enter a valid 4-digit OTP',
      AppLanguage.hi: 'कृपया एक मान्य 4-अंकीय OTP दर्ज करें',
      AppLanguage.mr: 'कृपया वैध 4-अंकी OTP प्रविष्ट करा'
    },
    'ep_photo_soon': {
      AppLanguage.en: 'Photo upload coming soon',
      AppLanguage.hi: 'फोटो अपलोड जल्द ही आ रहा है',
      AppLanguage.mr: 'फोटो अपलोड लवकरच येत आहे'
    },
    'ep_name': {
      AppLanguage.en: 'Name',
      AppLanguage.hi: 'नाम',
      AppLanguage.mr: 'नाव'
    },
    'ep_name_hint': {
      AppLanguage.en: 'Enter your full name',
      AppLanguage.hi: 'अपना पूरा नाम दर्ज करें',
      AppLanguage.mr: 'तुमचे पूर्ण नाव प्रविष्ट करा'
    },
    'ep_name_req': {
      AppLanguage.en: 'Name is required',
      AppLanguage.hi: 'नाम आवश्यक है',
      AppLanguage.mr: 'नाव आवश्यक आहे'
    },
    'ep_phone': {
      AppLanguage.en: 'Phone Number',
      AppLanguage.hi: 'फ़ोन नंबर',
      AppLanguage.mr: 'फोन नंबर'
    },
    'ep_phone_hint': {
      AppLanguage.en: 'Enter phone number',
      AppLanguage.hi: 'फ़ोन नंबर दर्ज करें',
      AppLanguage.mr: 'फोन नंबर प्रविष्ट करा'
    },
    'ep_phone_helper': {
      AppLanguage.en: 'Changing this will require OTP verification.',
      AppLanguage.hi: 'इसे बदलने के लिए OTP सत्यापन की आवश्यकता होगी।',
      AppLanguage.mr: 'हे बदलण्यासाठी OTP पडताळणी आवश्यक असेल.'
    },
    'ep_phone_req': {
      AppLanguage.en: 'Phone is required',
      AppLanguage.hi: 'फ़ोन आवश्यक है',
      AppLanguage.mr: 'फोन आवश्यक आहे'
    },
    'ep_lang': {
      AppLanguage.en: 'Preferred Language',
      AppLanguage.hi: 'पसंदीदा भाषा',
      AppLanguage.mr: 'प्राधान्यकृत भाषा'
    },
    'ep_lang_hint': {
      AppLanguage.en: 'Select language',
      AppLanguage.hi: 'भाषा चुनें',
      AppLanguage.mr: 'भाषा निवडा'
    },
    'ep_loc': {
      AppLanguage.en: 'Operating Location',
      AppLanguage.hi: 'परिचालन स्थान',
      AppLanguage.mr: 'ऑपरेटिंग स्थान'
    },
    'ep_loc_hint': {
      AppLanguage.en: 'General area (e.g., Panvel, Andheri)',
      AppLanguage.hi: 'सामान्य क्षेत्र (उदा., पनवेल, अंधेरी)',
      AppLanguage.mr: 'सामान्य क्षेत्र (उदा., पनवेल, अंधेरी)'
    },
    'ep_loc_req': {
      AppLanguage.en: 'Location is required',
      AppLanguage.hi: 'स्थान आवश्यक है',
      AppLanguage.mr: 'स्थान आवश्यक आहे'
    },
    'ep_save': {
      AppLanguage.en: 'Save Changes',
      AppLanguage.hi: 'परिवर्तन सहेजें',
      AppLanguage.mr: 'बदल जतन करा'
    },

    // Payments Screen
    'pay_title': {
      AppLanguage.en: 'My Payments',
      AppLanguage.hi: 'मेरे भुगतान',
      AppLanguage.mr: 'माझे पेमेंट्स'
    },
    'pay_received_title': {
      AppLanguage.en: 'Total money received',
      AppLanguage.hi: 'प्राप्त कुल राशि',
      AppLanguage.mr: 'एकूण प्राप्त रक्कम'
    },
    'pay_pending_title': {
      AppLanguage.en: 'Payment pending',
      AppLanguage.hi: 'भुगतान लंबित',
      AppLanguage.mr: 'पेमेंट प्रलंबित'
    },
    'pay_recent': {
      AppLanguage.en: 'Recent Payments',
      AppLanguage.hi: 'हाल के भुगतान',
      AppLanguage.mr: 'अलीकडील पेमेंट्स'
    },
    'pay_received': {
      AppLanguage.en: 'Money received',
      AppLanguage.hi: 'पैसे प्राप्त हुए',
      AppLanguage.mr: 'पैसे मिळाले'
    },
    'pay_help': {
      AppLanguage.en: 'Need help with a payment?',
      AppLanguage.hi: 'भुगतान के लिए मदद चाहिए?',
      AppLanguage.mr: 'पेमेंटसाठी मदत हवी आहे?'
    },
    'pay_help_desc': {
      AppLanguage.en: 'Call us and we will help you',
      AppLanguage.hi: 'हमें कॉल करें और हम आपकी मदद करेंगे',
      AppLanguage.mr: 'आम्हाला कॉल करा आणि आम्ही तुम्हाला मदत करू'
    },

    // Prices Screen
    'price_title': {
      AppLanguage.en: 'Market Prices',
      AppLanguage.hi: 'बाजार भाव',
      AppLanguage.mr: 'बाजार भाव'
    },
    'price_today_title': {
      AppLanguage.en: 'Today\'s market prices',
      AppLanguage.hi: 'आज के बाजार भाव',
      AppLanguage.mr: 'आजचे बाजार भाव'
    },
    'price_today_desc': {
      AppLanguage.en: 'Check the latest rates in your area',
      AppLanguage.hi: 'अपने क्षेत्र में नवीनतम दरें देखें',
      AppLanguage.mr: 'तुमच्या भागातील नवीनतम दर तपासा'
    },
    'price_today': {
      AppLanguage.en: 'Today',
      AppLanguage.hi: 'आज',
      AppLanguage.mr: 'आज'
    },
    'price_30_days': {
      AppLanguage.en: 'Last 30 Days',
      AppLanguage.hi: 'पिछले 30 दिन',
      AppLanguage.mr: 'मागील ३० दिवस'
    },
    'price_time_filter_soon': {
      AppLanguage.en: 'Time filter options coming soon!',
      AppLanguage.hi: 'समय फ़िल्टर विकल्प जल्द आ रहे हैं!',
      AppLanguage.mr: 'वेळ फिल्टर पर्याय लवकरच येत आहेत!'
    },
    'price_inc': {
      AppLanguage.en: 'Increased',
      AppLanguage.hi: 'बढ़ गया',
      AppLanguage.mr: 'वाढले'
    },
    'price_dec': {
      AppLanguage.en: 'Decreased',
      AppLanguage.hi: 'कम हो गया',
      AppLanguage.mr: 'कमी झाले'
    },
    'price_no_change': {
      AppLanguage.en: 'No change',
      AppLanguage.hi: 'कोई बदलाव नहीं',
      AppLanguage.mr: 'बदल नाही'
    },

    // Recyclers Screen
    'rec_matched': {
      AppLanguage.en: 'Matched Recyclers',
      AppLanguage.hi: 'मेल खाने वाले रिसाइकलर',
      AppLanguage.mr: 'जुळलेले रिसायकलर्स'
    },
    'rec_near': {
      AppLanguage.en: 'Recyclers near you',
      AppLanguage.hi: 'आपके पास रिसाइकलर',
      AppLanguage.mr: 'तुमच्या जवळील रिसायकलर्स'
    },
    'rec_near_desc': {
      AppLanguage.en: 'Find verified recyclers who accept your e-waste',
      AppLanguage.hi: 'सत्यापित रिसाइकलर खोजें जो आपका ई-कचरा स्वीकार करते हैं',
      AppLanguage.mr: 'सत्यापित रिसायकलर्स शोधा जे तुमचा ई-कचरा स्वीकारतात'
    },
    'rec_search_name': {
      AppLanguage.en: 'Search by area or name',
      AppLanguage.hi: 'क्षेत्र या नाम से खोजें',
      AppLanguage.mr: 'क्षेत्र किंवा नावाने शोधा'
    },
    'rec_search_mat': {
      AppLanguage.en: 'Search by area or material',
      AppLanguage.hi: 'क्षेत्र या सामग्री से खोजें',
      AppLanguage.mr: 'क्षेत्र किंवा सामग्रीनुसार शोधा'
    },
    'rec_filter_best': {
      AppLanguage.en: 'All',
      AppLanguage.hi: 'सभी',
      AppLanguage.mr: 'सर्व'
    },
    'rec_filter_near': {
      AppLanguage.en: 'Nearest',
      AppLanguage.hi: 'निकटतम',
      AppLanguage.mr: 'जवळचे'
    },
    'rec_filter_high': {
      AppLanguage.en: 'High Rating',
      AppLanguage.hi: 'उच्च रेटिंग',
      AppLanguage.mr: 'उच्च रेटिंग'
    },
    'rec_rec_best': {
      AppLanguage.en: 'RECOMMENDED • BEST PRICE',
      AppLanguage.hi: 'अनुशंसित • सर्वोत्तम मूल्य',
      AppLanguage.mr: 'शिफारस केलेले • सर्वोत्तम किंमत'
    },
    'rec_rec_near': {
      AppLanguage.en: 'RECOMMENDED • NEAREST',
      AppLanguage.hi: 'अनुशंसित • निकटतम',
      AppLanguage.mr: 'शिफारस केलेले • सर्वात जवळ'
    },
    'rec_verified': {
      AppLanguage.en: 'Verified',
      AppLanguage.hi: 'सत्यापित',
      AppLanguage.mr: 'सत्यापित'
    },
    'rec_mat_est': {
      AppLanguage.en: 'Material & Est. Price',
      AppLanguage.hi: 'सामग्री और अनुमानित मूल्य',
      AppLanguage.mr: 'सामग्री आणि अंदाजे किंमत'
    },
    'rec_accepts': {
      AppLanguage.en: 'Accepts:',
      AppLanguage.hi: 'स्वीकार करता है:',
      AppLanguage.mr: 'स्वीकारतो:'
    },
    'rec_pickup': {
      AppLanguage.en: 'Pickup Available',
      AppLanguage.hi: 'पिकअप उपलब्ध',
      AppLanguage.mr: 'पिकअप उपलब्ध'
    },
    'rec_dropoff': {
      AppLanguage.en: 'Drop-off Only',
      AppLanguage.hi: 'केवल ड्रॉप-ऑफ़',
      AppLanguage.mr: 'फक्त ड्रॉप-ऑफ'
    },
    'rec_view_details': {
      AppLanguage.en: 'View Details',
      AppLanguage.hi: 'विवरण देखें',
      AppLanguage.mr: 'तपशील पहा'
    },

    // Login Screen
    'login_otp_error': {
      AppLanguage.en: 'Please enter the 4-digit OTP',
      AppLanguage.hi: 'कृपया 4 अंकों का ओटीपी दर्ज करें',
      AppLanguage.mr: 'कृपया ४-अंकी OTP प्रविष्ट करा'
    },
    'login_welcome': {
      AppLanguage.en: 'Welcome to EcoSetu',
      AppLanguage.hi: 'इकोसेतु में आपका स्वागत है',
      AppLanguage.mr: 'इकोसेतू मध्ये आपले स्वागत आहे'
    },
    'login_desc': {
      AppLanguage.en: 'Sign in to manage your e-waste lots',
      AppLanguage.hi: 'अपने ई-कचरे के लॉट प्रबंधित करने के लिए साइन इन करें',
      AppLanguage.mr: 'तुमचे ई-कचरा लॉट व्यवस्थापित करण्यासाठी साइन इन करा'
    },
    'login_phone': {
      AppLanguage.en: 'Phone Number',
      AppLanguage.hi: 'फ़ोन नंबर',
      AppLanguage.mr: 'फोन नंबर'
    },
    'login_phone_hint': {
      AppLanguage.en: 'Enter 10-digit number',
      AppLanguage.hi: '10 अंकों का नंबर दर्ज करें',
      AppLanguage.mr: '१०-अंकी नंबर प्रविष्ट करा'
    },
    'login_otp': {
      AppLanguage.en: 'OTP',
      AppLanguage.hi: 'ओटीपी',
      AppLanguage.mr: 'ओटीपी'
    },
    'login_otp_hint': {
      AppLanguage.en: 'Enter 4-digit code',
      AppLanguage.hi: '4 अंकों का कोड दर्ज करें',
      AppLanguage.mr: '४-अंकी कोड प्रविष्ट करा'
    },
    'login_continue': {
      AppLanguage.en: 'Continue',
      AppLanguage.hi: 'जारी रखें',
      AppLanguage.mr: 'पुढे सुरू ठेवा'
    },
    'login_no_acc': {
      AppLanguage.en: 'Don\'t have an account?',
      AppLanguage.hi: 'क्या आपके पास खाता नहीं है?',
      AppLanguage.mr: 'खाते नाही?'
    },
    'login_signup': {
      AppLanguage.en: 'Sign up',
      AppLanguage.hi: 'साइन अप करें',
      AppLanguage.mr: 'साइन अप करा'
    },

    // Register Screen
    'reg_title': {
      AppLanguage.en: 'Create Account',
      AppLanguage.hi: 'खाता बनाएं',
      AppLanguage.mr: 'खाते तयार करा'
    },
    'reg_desc': {
      AppLanguage.en: 'Join EcoSetu to start managing e-waste',
      AppLanguage.hi: 'ई-कचरा प्रबंधन शुरू करने के लिए इकोसेतु से जुड़ें',
      AppLanguage.mr: 'ई-कचरा व्यवस्थापन सुरू करण्यासाठी इकोसेतूमध्ये सामील व्हा'
    },
    'reg_name': {
      AppLanguage.en: 'Full Name',
      AppLanguage.hi: 'पूरा नाम',
      AppLanguage.mr: 'पूर्ण नाव'
    },
    'reg_name_hint': {
      AppLanguage.en: 'Enter your full name',
      AppLanguage.hi: 'अपना पूरा नाम दर्ज करें',
      AppLanguage.mr: 'तुमचे पूर्ण नाव प्रविष्ट करा'
    },
    'reg_city': {
      AppLanguage.en: 'City',
      AppLanguage.hi: 'शहर',
      AppLanguage.mr: 'शहर'
    },
    'reg_city_hint': {
      AppLanguage.en: 'e.g. Mumbai, Delhi',
      AppLanguage.hi: 'उदा. मुंबई, दिल्ली',
      AppLanguage.mr: 'उदा. मुंबई, दिल्ली'
    },
    'reg_enter_otp': {
      AppLanguage.en: 'Enter OTP',
      AppLanguage.hi: 'ओटीपी दर्ज करें',
      AppLanguage.mr: 'OTP प्रविष्ट करा'
    },
    'reg_otp_hint': {
      AppLanguage.en: '4-digit code',
      AppLanguage.hi: '4 अंकों का कोड',
      AppLanguage.mr: '४-अंकी कोड'
    },
    'reg_have_acc': {
      AppLanguage.en: 'Already have an account?',
      AppLanguage.hi: 'क्या आपके पास पहले से खाता है?',
      AppLanguage.mr: 'आधीच खाते आहे?'
    },
    'reg_login': {
      AppLanguage.en: 'Log in',
      AppLanguage.hi: 'लॉग इन करें',
      AppLanguage.mr: 'लॉग इन करा'
    },

    // Lot Details Screen
    'lot_det_title': {
      AppLanguage.en: 'Lot Details',
      AppLanguage.hi: 'लॉट विवरण',
      AppLanguage.mr: 'लॉट तपशील'
    },
    'lot_det_bill': {
      AppLanguage.en: 'LOT BILL',
      AppLanguage.hi: 'लॉट बिल',
      AppLanguage.mr: 'लॉट बिल'
    },
    'lot_det_handed_over': {
      AppLanguage.en: 'Handed Over',
      AppLanguage.hi: 'सौंप दिया',
      AppLanguage.mr: 'सुपूर्द केले'
    },
    'lot_det_in_progress': {
      AppLanguage.en: 'In Progress',
      AppLanguage.hi: 'प्रगति पर',
      AppLanguage.mr: 'प्रगतीपथावर'
    },
    'lot_det_final': {
      AppLanguage.en: 'FINAL',
      AppLanguage.hi: 'अंतिम',
      AppLanguage.mr: 'अंतिम'
    },
    'lot_det_est': {
      AppLanguage.en: 'EST.',
      AppLanguage.hi: 'अनुमानित',
      AppLanguage.mr: 'अंदाजे'
    },
    'lot_det_material': {
      AppLanguage.en: 'Material',
      AppLanguage.hi: 'सामग्री',
      AppLanguage.mr: 'सामग्री'
    },
    'lot_det_weight': {
      AppLanguage.en: 'Weight',
      AppLanguage.hi: 'वजन',
      AppLanguage.mr: 'वजन'
    },
    'lot_det_condition': {
      AppLanguage.en: 'Condition',
      AppLanguage.hi: 'स्थिति',
      AppLanguage.mr: 'स्थिती'
    },
    'lot_det_rate': {
      AppLanguage.en: 'Rate',
      AppLanguage.hi: 'दर',
      AppLanguage.mr: 'दर'
    },
    'lot_det_total_price': {
      AppLanguage.en: 'Total Price',
      AppLanguage.hi: 'कुल मूल्य',
      AppLanguage.mr: 'एकूण किंमत'
    },
    'lot_det_declined_title': {
      AppLanguage.en: 'Request Declined',
      AppLanguage.hi: 'अनुरोध अस्वीकृत',
      AppLanguage.mr: 'विनंती नाकारली'
    },
    'lot_det_declined_desc': {
      AppLanguage.en: 'The recycler could not accept this lot. Tap to find another buyer.',
      AppLanguage.hi: 'रिसाइकलर इस लॉट को स्वीकार नहीं कर सका। अन्य खरीदार खोजने के लिए टैप करें।',
      AppLanguage.mr: 'रिसायकलर हा लॉट स्वीकारू शकला नाही. दुसरा खरेदीदार शोधण्यासाठी टॅप करा.'
    },
    'lot_det_matched_recycler': {
      AppLanguage.en: 'Matched Recycler',
      AppLanguage.hi: 'मेल खाने वाला रिसाइकलर',
      AppLanguage.mr: 'जुळलेला रिसायकलर'
    },
    'lot_det_no_recycler': {
      AppLanguage.en: 'No Recycler Matched',
      AppLanguage.hi: 'कोई रिसाइकलर मेल नहीं खाया',
      AppLanguage.mr: 'कोणताही रिसायकलर जुळला नाही'
    },
    'lot_det_find_verified': {
      AppLanguage.en: 'Find a verified recycler.',
      AppLanguage.hi: 'एक सत्यापित रिसाइकलर खोजें।',
      AppLanguage.mr: 'सत्यापित रिसायकलर शोधा.'
    },
    'lot_det_find_match': {
      AppLanguage.en: 'Find Match',
      AppLanguage.hi: 'मैच खोजें',
      AppLanguage.mr: 'सामना शोधा'
    },
    'lot_det_status': {
      AppLanguage.en: 'Lot Status',
      AppLanguage.hi: 'लॉट स्थिति',
      AppLanguage.mr: 'लॉट स्थिती'
    },
    'lot_det_created': {
      AppLanguage.en: 'Created',
      AppLanguage.hi: 'बनाया गया',
      AppLanguage.mr: 'तयार केले'
    },
    'lot_det_created_desc': {
      AppLanguage.en: 'Lot created and details logged',
      AppLanguage.hi: 'लॉट बनाया गया और विवरण लॉग किया गया',
      AppLanguage.mr: 'लॉट तयार केला आणि तपशील लॉग केले'
    },
    'lot_det_matched': {
      AppLanguage.en: 'Matched',
      AppLanguage.hi: 'मेल खाया',
      AppLanguage.mr: 'जुळले'
    },
    'lot_det_matched_desc': {
      AppLanguage.en: 'Recycler matched',
      AppLanguage.hi: 'रिसाइकलर मेल खाया',
      AppLanguage.mr: 'रिसायकलर जुळला'
    },
    'lot_det_pickup': {
      AppLanguage.en: 'Pickup',
      AppLanguage.hi: 'पिकअप',
      AppLanguage.mr: 'पिकअप'
    },
    'lot_det_pickup_desc': {
      AppLanguage.en: 'Accepted & scheduled for pickup',
      AppLanguage.hi: 'पिकअप के लिए निर्धारित',
      AppLanguage.mr: 'पिकअपसाठी नियोजित'
    },
    'lot_det_confirmed': {
      AppLanguage.en: 'Confirmed',
      AppLanguage.hi: 'पुष्टि की गई',
      AppLanguage.mr: 'पुष्टी केली'
    },
    'lot_det_confirmed_desc': {
      AppLanguage.en: 'Material received & verified',
      AppLanguage.hi: 'सामग्री प्राप्त और सत्यापित',
      AppLanguage.mr: 'सामग्री प्राप्त आणि सत्यापित'
    },
    'lot_det_paid': {
      AppLanguage.en: 'Paid',
      AppLanguage.hi: 'भुगतान किया',
      AppLanguage.mr: 'पैसे दिले'
    },
    'lot_det_paid_desc': {
      AppLanguage.en: 'Payment processed',
      AppLanguage.hi: 'भुगतान संसाधित',
      AppLanguage.mr: 'पेमेंट प्रक्रिया केली'
    },
    'lot_det_show_qr': {
      AppLanguage.en: 'Show Handover QR',
      AppLanguage.hi: 'हैंडओवर QR दिखाएं',
      AppLanguage.mr: 'हँडओव्हर QR दाखवा'
    },
    'lot_det_qr_title': {
      AppLanguage.en: 'Handover QR Code',
      AppLanguage.hi: 'हैंडओवर QR कोड',
      AppLanguage.mr: 'हँडओव्हर QR कोड'
    },
    'lot_det_qr_desc': {
      AppLanguage.en: 'Show this to the recycler for a quick and secure handover.',
      AppLanguage.hi: 'त्वरित और सुरक्षित हैंडओवर के लिए इसे रिसाइकलर को दिखाएं।',
      AppLanguage.mr: 'जलद आणि सुरक्षित हँडओव्हरसाठी हे रिसायकलरला दाखवा.'
    },
    'lot_det_or_ref': {
      AppLanguage.en: 'OR USE REFERENCE CODE',
      AppLanguage.hi: 'या संदर्भ कोड का उपयोग करें',
      AppLanguage.mr: 'किंवा संदर्भ कोड वापरा'
    },
    'lot_det_done': {
      AppLanguage.en: 'Done',
      AppLanguage.hi: 'हो गया',
      AppLanguage.mr: 'पूर्ण झाले'
    },

    // Handover Record Screen
    'hr_title': {
      AppLanguage.en: 'Confirmed',
      AppLanguage.hi: 'पुष्टि की गई',
      AppLanguage.mr: 'पुष्टी केली'
    },
    'hr_booking': {
      AppLanguage.en: 'Booking Confirmed',
      AppLanguage.hi: 'बुकिंग की पुष्टि हो गई',
      AppLanguage.mr: 'बुकिंग निश्चित झाली'
    },
    'hr_pickup_today': {
      AppLanguage.en: 'Pickup by ', 
      AppLanguage.hi: 'द्वारा पिकअप ',
      AppLanguage.mr: 'द्वारे पिकअप '
    },
    'hr_today': {
      AppLanguage.en: ' • Today',
      AppLanguage.hi: ' • आज',
      AppLanguage.mr: ' • आज'
    },
    'hr_show_qr': {
      AppLanguage.en: 'Show this QR to the pickup person',
      AppLanguage.hi: 'यह कोड पिकअप वाले को दिखाएं',
      AppLanguage.mr: 'हा QR पिकअप करणार्‍यास दाखवा'
    },
    'hr_show_qr_sub': {
      AppLanguage.en: 'Show this QR to the pickup person',
      AppLanguage.hi: 'यह कोड पिकअप वाले को दिखाएं',
      AppLanguage.mr: 'हे कोड पिकअप करणाऱ्याला दाखवा'
    },
    'hr_saved': {
      AppLanguage.en: 'Photo, weight & location saved',
      AppLanguage.hi: 'तस्वीर, वजन और स्थान सहेजा गया',
      AppLanguage.mr: 'फोटो, वजन आणि स्थान सेव्ह केले'
    },
    'hr_done': {
      AppLanguage.en: 'Done',
      AppLanguage.hi: 'हो गया',
      AppLanguage.mr: 'पूर्ण'
    },

    // Payment Detail Screen
    'pd_title': {
      AppLanguage.en: 'Payment Details',
      AppLanguage.hi: 'भुगतान विवरण',
      AppLanguage.mr: 'पेमेंट तपशील'
    },
    'pd_received': {
      AppLanguage.en: 'Payment received',
      AppLanguage.hi: 'भुगतान प्राप्त हुआ',
      AppLanguage.mr: 'पेमेंट प्राप्त झाले'
    },
    'pd_pending': {
      AppLanguage.en: 'Payment pending',
      AppLanguage.hi: 'भुगतान लंबित',
      AppLanguage.mr: 'पेमेंट प्रलंबित'
    },
    'pd_you_received': {
      AppLanguage.en: 'You have received',
      AppLanguage.hi: 'आपको प्राप्त हुआ है',
      AppLanguage.mr: 'तुम्हाला प्राप्त झाले आहे'
    },
    'pd_awaiting': {
      AppLanguage.en: 'Awaiting transfer',
      AppLanguage.hi: 'स्थानांतरण की प्रतीक्षा है',
      AppLanguage.mr: 'हस्तांतरणाची प्रतीक्षा आहे'
    },
    'pd_from': {
      AppLanguage.en: 'From',
      AppLanguage.hi: 'से',
      AppLanguage.mr: 'कडून'
    },
    'pd_date': {
      AppLanguage.en: 'Date',
      AppLanguage.hi: 'दिनांक',
      AppLanguage.mr: 'तारीख'
    },
    'pd_ewaste_coll': {
      AppLanguage.en: 'E-waste collected',
      AppLanguage.hi: 'ई-कचरा एकत्र किया गया',
      AppLanguage.mr: 'ई-कचरा गोळा केला'
    },
    'pd_material': {
      AppLanguage.en: 'Material',
      AppLanguage.hi: 'सामग्री',
      AppLanguage.mr: 'सामग्री'
    },
    'pd_ref_id': {
      AppLanguage.en: 'Reference ID',
      AppLanguage.hi: 'संदर्भ आईडी',
      AppLanguage.mr: 'संदर्भ आयडी'
    },
    'pd_transferred_msg': {
      AppLanguage.en: 'The money has been transferred to your bank account.',
      AppLanguage.hi: 'पैसे आपके बैंक खाते में स्थानांतरित कर दिए गए हैं।',
      AppLanguage.mr: 'पैसे तुमच्या बँक खात्यात हस्तांतरित केले गेले आहेत.'
    },
    'pd_calling_support': {
      AppLanguage.en: 'Calling support...',
      AppLanguage.hi: 'समर्थन को कॉल कर रहा है...',
      AppLanguage.mr: 'सपोर्टला कॉल करत आहे...'
    },
    'pd_call_support': {
      AppLanguage.en: 'Call Support',
      AppLanguage.hi: 'कॉल सपोर्ट',
      AppLanguage.mr: 'कॉल सपोर्ट'
    },
    'pd_talk_team': {
      AppLanguage.en: 'Talk to our team if you have any issues',
      AppLanguage.hi: 'यदि आपको कोई समस्या है तो हमारी टीम से बात करें',
      AppLanguage.mr: 'तुम्हाला काही समस्या असल्यास आमच्या टीमशी बोला'
    },
    'pd_view_all': {
      AppLanguage.en: 'View all payments',
      AppLanguage.hi: 'सभी भुगतान देखें',
      AppLanguage.mr: 'सर्व पेमेंट्स पहा'
    },

    // Recycler Details Screen
    'rd_title': {
      AppLanguage.en: 'Recycler Profile',
      AppLanguage.hi: 'रिसाइकलर प्रोफ़ाइल',
      AppLanguage.mr: 'रिसायकलर प्रोफाईल'
    },
    'rd_pickup_req_succ': {
      AppLanguage.en: 'Pickup Requested Successfully!',
      AppLanguage.hi: 'पिकअप का अनुरोध सफलतापूर्वक किया गया!',
      AppLanguage.mr: 'पिकअपची विनंती यशस्वीरित्या केली!'
    },
    'rd_req_pickup': {
      AppLanguage.en: 'Request Pickup',
      AppLanguage.hi: 'पिकअप का अनुरोध करें',
      AppLanguage.mr: 'पिकअपची विनंती करा'
    },
    'rd_verified': {
      AppLanguage.en: 'Verified Recycler',
      AppLanguage.hi: 'सत्यापित रिसाइकलर',
      AppLanguage.mr: 'सत्यापित रिसायकलर'
    },
    'rd_active': {
      AppLanguage.en: 'Active',
      AppLanguage.hi: 'सक्रिय',
      AppLanguage.mr: 'सक्रिय'
    },
    'rd_reg_no': {
      AppLanguage.en: 'Reg No: ',
      AppLanguage.hi: 'पंजीकरण संख्या: ',
      AppLanguage.mr: 'नोंदणी क्रमांक: '
    },
    'rd_auth_by': {
      AppLanguage.en: 'Authorized by Pollution Control Board',
      AppLanguage.hi: 'प्रदूषण नियंत्रण बोर्ड द्वारा अधिकृत',
      AppLanguage.mr: 'प्रदूषण नियंत्रण मंडळाद्वारे अधिकृत'
    },
    'rd_calling': {
      AppLanguage.en: 'Calling +91 98XXX XXXXX...',
      AppLanguage.hi: '+91 98XXX XXXXX को कॉल कर रहा है...',
      AppLanguage.mr: '+91 98XXX XXXXX ला कॉल करत आहे...'
    },
    'rd_phone': {
      AppLanguage.en: '+91 98XXX XXXXX',
      AppLanguage.hi: '+91 98XXX XXXXX',
      AppLanguage.mr: '+91 98XXX XXXXX'
    },
    'rd_opening_maps': {
      AppLanguage.en: 'Opening Maps...',
      AppLanguage.hi: 'नक्शे खोल रहा है...',
      AppLanguage.mr: 'नकाशे उघडत आहे...'
    },
    'rd_directions': {
      AppLanguage.en: 'Directions',
      AppLanguage.hi: 'दिशा-निर्देश',
      AppLanguage.mr: 'दिशा'
    },
    'rd_comes_area': {
      AppLanguage.en: 'Comes to your area ✅',
      AppLanguage.hi: 'आपके क्षेत्र में आता है ✅',
      AppLanguage.mr: 'तुमच्या भागात येतो ✅'
    },
    'rd_drop_only': {
      AppLanguage.en: 'Drop-off only at facility',
      AppLanguage.hi: 'केवल सुविधा में ड्रॉप-ऑफ़',
      AppLanguage.mr: 'फक्त सुविधेवर ड्रॉप-ऑफ'
    },
    'rd_acc_mat': {
      AppLanguage.en: 'Accepted Materials & Rates',
      AppLanguage.hi: 'स्वीकृत सामग्री और दरें',
      AppLanguage.mr: 'स्वीकृत सामग्री आणि दर'
    },
    'rd_varies': {
      AppLanguage.en: 'Varies',
      AppLanguage.hi: 'बदलता है',
      AppLanguage.mr: 'बदलते'
    },

    // Batch Summary Screen
    'bs_title': {
      AppLanguage.en: 'Available Recyclers',
      AppLanguage.hi: 'उपलब्ध रिसाइकलर्स',
      AppLanguage.mr: 'उपलब्ध रिसायकलर्स'
    },
    'bs_est_value': {
      AppLanguage.en: 'Est. Value',
      AppLanguage.hi: 'अनुमानित मूल्य',
      AppLanguage.mr: 'अंदाजित मूल्य'
    },
    'bs_rec_buyers': {
      AppLanguage.en: 'Recommended Buyers',
      AppLanguage.hi: 'अनुशंसित खरीदार',
      AppLanguage.mr: 'शिफारस केलेले खरेदीदार'
    },
    'bs_best_match': {
      AppLanguage.en: 'Best Match',
      AppLanguage.hi: 'सर्वोत्तम मिलान',
      AppLanguage.mr: 'सर्वोत्तम जुळणी'
    },
    'bs_away': {
      AppLanguage.en: ' away',
      AppLanguage.hi: ' दूर',
      AppLanguage.mr: ' दूर'
    },
    'bs_pays_up_to': {
      AppLanguage.en: 'Pays up to',
      AppLanguage.hi: 'तक भुगतान करता है',
      AppLanguage.mr: 'पर्यंत पैसे देतो'
    },
    'bs_home': {
      AppLanguage.en: 'Home',
      AppLanguage.hi: 'होम',
      AppLanguage.mr: 'होम'
    },
    'bs_check_lot_status': {
      AppLanguage.en: 'View Lot',
      AppLanguage.hi: 'लॉट देखें',
      AppLanguage.mr: 'लॉट पहा'
    },
    'bs_lot_added': {
      AppLanguage.en: 'Lot successfully added! Redirecting to status...',
      AppLanguage.hi: 'लॉट सफलतापूर्वक जोड़ा गया! स्थिति पर रीडायरेक्ट कर रहा है...',
      AppLanguage.mr: 'लॉट यशस्वीरित्या जोडला! स्थितीकडे पुनर्निर्देशित करत आहे...'
    },

    // Add Lot Screen
    'al_title': {
      AppLanguage.en: 'Add E-Waste',
      AppLanguage.hi: 'ई-कचरा जोड़ें',
      AppLanguage.mr: 'ई-कचरा जोडा'
    },
    'al_tap_photo': {
      AppLanguage.en: 'Tap to take a photo',
      AppLanguage.hi: 'तस्वीर लेने के लिए टैप करें',
      AppLanguage.mr: 'फोटो काढण्यासाठी टॅप करा'
    },
    'al_photo_added': {
      AppLanguage.en: 'Photo added ✓',
      AppLanguage.hi: 'तस्वीर जोड़ी गई ✓',
      AppLanguage.mr: 'फोटो जोडला ✓'
    },
    'al_what_material': {
      AppLanguage.en: 'What type of material?',
      AppLanguage.hi: 'सामग्री का प्रकार क्या है?',
      AppLanguage.mr: 'सामग्रीचा प्रकार काय आहे?'
    },
    'al_approx_weight': {
      AppLanguage.en: 'Approximate weight (kg)',
      AppLanguage.hi: 'अनुमानित वजन (किलो)',
      AppLanguage.mr: 'अंदाजे वजन (किलो)'
    },
    'al_est_value': {
      AppLanguage.en: 'Estimated value',
      AppLanguage.hi: 'अनुमानित मूल्य',
      AppLanguage.mr: 'अंदाजित मूल्य'
    },
    'al_based_rates': {
      AppLanguage.en: 'Based on current rates',
      AppLanguage.hi: 'वर्तमान दरों के आधार पर',
      AppLanguage.mr: 'सध्याच्या दरांवर आधारित'
    },
    'al_find_recyclers': {
      AppLanguage.en: 'Find Recyclers',
      AppLanguage.hi: 'रिसाइकलर्स खोजें',
      AppLanguage.mr: 'रिसायकलर्स शोधा'
    },
    'al_select_buyer': {
      AppLanguage.en: 'Select Buyer',
      AppLanguage.hi: 'खरीदार चुनें',
      AppLanguage.mr: 'खरेदीदार निवडा'
    },
    'cat_pcb': {
      AppLanguage.en: 'PCB',
      AppLanguage.hi: 'पीसीबी',
      AppLanguage.mr: 'पीसीबी'
    },
    'cat_cable': {
      AppLanguage.en: 'Cable',
      AppLanguage.hi: 'केबल',
      AppLanguage.mr: 'केबल'
    },
    'cat_battery': {
      AppLanguage.en: 'Battery',
      AppLanguage.hi: 'बैटरी',
      AppLanguage.mr: 'बॅटरी'
    },
    'cat_lcd': {
      AppLanguage.en: 'LCD Panel',
      AppLanguage.hi: 'एलसीडी पैनल',
      AppLanguage.mr: 'एलसीडी पॅनेल'
    },
    'cat_motor': {
      AppLanguage.en: 'Motor',
      AppLanguage.hi: 'मोटर',
      AppLanguage.mr: 'मोटर'
    },
    'cat_magnet': {
      AppLanguage.en: 'Magnet-Bearing Assembly',
      AppLanguage.hi: 'चुंबक-असर विधानसभा',
      AppLanguage.mr: 'चुंबक-असर असेंब्ली'
    },
    'cat_mixed_plastics': {
      AppLanguage.en: 'Mixed Plastics',
      AppLanguage.hi: 'मिश्रित प्लास्टिक',
      AppLanguage.mr: 'मिश्रित प्लास्टिक'
    },
    'cat_crt_glass': {
      AppLanguage.en: 'CRT Glass',
      AppLanguage.hi: 'सीआरटी ग्लास',
      AppLanguage.mr: 'सीआरटी ग्लास'
    },
    'cat_copper_cable': {
      AppLanguage.en: 'Copper Cable',
      AppLanguage.hi: 'तांबे का तार',
      AppLanguage.mr: 'तांब्याची तार'
    },
    'cat_scrap_battery': {
      AppLanguage.en: 'Scrap Battery',
      AppLanguage.hi: 'कबाड़ बैटरी',
      AppLanguage.mr: 'भंगार बॅटरी'
    },
    'desc_pcb': {
      AppLanguage.en: 'Electronic circuit board',
      AppLanguage.hi: 'इलेक्ट्रॉनिक सर्किट बोर्ड',
      AppLanguage.mr: 'इलेक्ट्रॉनिक सर्किट बोर्ड'
    },
    'desc_cable': {
      AppLanguage.en: 'Aluminum or Copper wires',
      AppLanguage.hi: 'एल्युमिनियम या तांबे के तार',
      AppLanguage.mr: 'ॲल्युमिनियम किंवा तांब्याच्या तारा'
    },
    'desc_magnet': {
      AppLanguage.en: 'Neodymium & magnet parts',
      AppLanguage.hi: 'नियोडिमियम और चुंबक के हिस्से',
      AppLanguage.mr: 'निओडीमियम आणि चुंबकाचे भाग'
    },
    'desc_battery': {
      AppLanguage.en: 'Lithium or Lead-Acid',
      AppLanguage.hi: 'लिथियम या लेड-एसिड',
      AppLanguage.mr: 'लिथियम किंवा लीड-अ‍ॅसिड'
    },
    'desc_lcd': {
      AppLanguage.en: 'TV or monitor screen',
      AppLanguage.hi: 'टीवी या मॉनिटर स्क्रीन',
      AppLanguage.mr: 'टीव्ही किंवा मॉनिटर स्क्रीन'
    },
    'desc_motor': {
      AppLanguage.en: 'Electric motors & parts',
      AppLanguage.hi: 'इलेक्ट्रिक मोटर और हिस्से',
      AppLanguage.mr: 'इलेक्ट्रिक मोटर्स आणि भाग'
    },
    'desc_mixed_plastics': {
      AppLanguage.en: 'Plastic casings & covers',
      AppLanguage.hi: 'प्लास्टिक केसिंग और कवर',
      AppLanguage.mr: 'प्लास्टिकचे केसिंग आणि कव्हर'
    },
    'desc_crt_glass': {
      AppLanguage.en: 'Cathode ray tube glass',
      AppLanguage.hi: 'कैथोड रे ट्यूब ग्लास',
      AppLanguage.mr: 'कॅथोड रे ट्यूब ग्लास'
    },
    'unit_kg': {
      AppLanguage.en: 'kg',
      AppLanguage.hi: 'किलो',
      AppLanguage.mr: 'किलो'
    },
    'unit_per_kg': {
      AppLanguage.en: '/kg',
      AppLanguage.hi: '/किलो',
      AppLanguage.mr: '/किलो'
    },
    'unit_per_kg_long': {
      AppLanguage.en: 'per kg',
      AppLanguage.hi: 'प्रति किलो',
      AppLanguage.mr: 'प्रति किलो'
    },
    'trend_up': {
      AppLanguage.en: 'Increased',
      AppLanguage.hi: 'बढ़ा',
      AppLanguage.mr: 'वाढले'
    },
    'trend_down': {
      AppLanguage.en: 'Decreased',
      AppLanguage.hi: 'घटा',
      AppLanguage.mr: 'कमी झाले'
    },
    'trend_stable': {
      AppLanguage.en: 'No change',
      AppLanguage.hi: 'कोई बदलाव नहीं',
      AppLanguage.mr: 'कोणताही बदल नाही'
    },
    'add_lighting_info': {
      AppLanguage.en: 'Ensure good lighting and keep the item centered to help AI identify it accurately.',
      AppLanguage.hi: 'सुनिश्चित करें कि प्रकाश अच्छा हो और एआई को इसे सटीक रूप से पहचानने में मदद करने के लिए आइटम को बीच में रखें।',
      AppLanguage.mr: 'चांगला प्रकाश सुनिश्चित करा आणि AI ला अचूक ओळखण्यात मदत करण्यासाठी आयटम मध्यभागी ठेवा.'
    },
    'add_ai_detected': {
      AppLanguage.en: 'AI Detected',
      AppLanguage.hi: 'एआई ने पता लगाया',
      AppLanguage.mr: 'AI ने शोधले'
    },

    'add_health_risk': {
      AppLanguage.en: 'Health Risk: ',
      AppLanguage.hi: 'स्वास्थ्य जोखिम: ',
      AppLanguage.mr: 'आरोग्य धोका: '
    },
    'add_why_matters': {
      AppLanguage.en: 'WHY THIS MATTERS:',
      AppLanguage.hi: 'यह क्यों मायने रखता है:',
      AppLanguage.mr: 'हे का महत्त्वाचे आहे:'
    },
    'add_lot_created_success': {
      AppLanguage.en: 'Lot Created Successfully!',
      AppLanguage.hi: 'लॉट सफलतापूर्वक बनाया गया!',
      AppLanguage.mr: 'लॉट यशस्वीरित्या तयार केला!'
    },
    'add_lot_added_mylots': {
      AppLanguage.en: 'Your e-waste lot has been added to My Lots.',
      AppLanguage.hi: 'आपका ई-कचरा लॉट माई लॉट्स में जोड़ दिया गया है।',
      AppLanguage.mr: 'तुमचा ई-कचरा लॉट माय लॉट्समध्ये जोडला गेला आहे.'
    },
    'add_confirm_handover': {
      AppLanguage.en: 'Confirm Handover',
      AppLanguage.hi: 'हैंडओवर की पुष्टि करें',
      AppLanguage.mr: 'हँडओव्हरची पुष्टी करा'
    },
    'add_next_step': {
      AppLanguage.en: 'Next Step',
      AppLanguage.hi: 'अगला कदम',
      AppLanguage.mr: 'पुढील पायरी'
    },
    'add_review_lot': {
      AppLanguage.en: 'Review Lot',
      AppLanguage.hi: 'लॉट की समीक्षा करें',
      AppLanguage.mr: 'लॉटचे पुनरावलोकन करा'
    },
    'add_confirm_lot': {
      AppLanguage.en: 'Confirm Lot',
      AppLanguage.hi: 'लॉट की पुष्टि करें',
      AppLanguage.mr: 'लॉटची पुष्टी करा'
    },
    'add_material': {
      AppLanguage.en: 'Material',
      AppLanguage.hi: 'सामग्री',
      AppLanguage.mr: 'सामग्री'
    },
    'add_est_payout': {
      AppLanguage.en: 'Est. Payout',
      AppLanguage.hi: 'अनुमानित भुगतान',
      AppLanguage.mr: 'अंदाजित पेआउट'
    },
    'add_recycler': {
      AppLanguage.en: 'Recycler',
      AppLanguage.hi: 'रिसाइकलर',
      AppLanguage.mr: 'रिसायकलर'
    },
    'add_lot_id': {
      AppLanguage.en: 'Lot ID',
      AppLanguage.hi: 'लॉट आईडी',
      AppLanguage.mr: 'लॉट आयडी'
    },
    'add_receipt_weight': {
      AppLanguage.en: 'Weight',
      AppLanguage.hi: 'वजन',
      AppLanguage.mr: 'वजन'
    },
    'add_condition': {
      AppLanguage.en: 'Condition',
      AppLanguage.hi: 'स्थिति',
      AppLanguage.mr: 'स्थिती'
    },
    'add_rate': {
      AppLanguage.en: 'Rate',
      AppLanguage.hi: 'दर',
      AppLanguage.mr: 'दर'
    },
    'add_photos': {
      AppLanguage.en: 'Photos',
      AppLanguage.hi: 'फ़ोटो',
      AppLanguage.mr: 'फोटो'
    },

    // Splash Screen
    'splash_tagline': {
      AppLanguage.en: 'Empowering E-Waste Collectors',
      AppLanguage.hi: 'ई-कचरा संग्राहकों को सशक्त बनाना',
      AppLanguage.mr: 'ई-कचरा संकलकांचे सक्षमीकरण'
    },

    // Safety Tips Screen
    'safe_title': {
      AppLanguage.en: 'Safety Tips',
      AppLanguage.hi: 'सुरक्षा सुझाव',
      AppLanguage.mr: 'सुरक्षा टिप्स'
    },
    'safe_desc': {
      AppLanguage.en: 'Handling E-Waste Safely',
      AppLanguage.hi: 'ई-कचरे को सुरक्षित रूप से संभालना',
      AppLanguage.mr: 'ई-कचरा सुरक्षितपणे हाताळणे'
    },
    'safe_sub': {
      AppLanguage.en: 'Follow these guidelines to protect yourself and the environment while collecting scrap.',
      AppLanguage.hi: 'कबाड़ इकट्ठा करते समय अपनी और पर्यावरण की रक्षा के लिए इन दिशा-निर्देशों का पालन करें।',
      AppLanguage.mr: 'भंगार गोळा करताना स्वतःचे आणि पर्यावरणाचे रक्षण करण्यासाठी या मार्गदर्शक तत्त्वांचे पालन करा.'
    },
    'safe_danger': {
      AppLanguage.en: 'DANGER',
      AppLanguage.hi: 'खतरा',
      AppLanguage.mr: 'धोका'
    },
    'safe_burn': {
      AppLanguage.en: 'Do NOT Burn Cables',
      AppLanguage.hi: 'केबल न जलाएं',
      AppLanguage.mr: 'केबल्स जाळू नका'
    },
    'safe_burn_desc': {
      AppLanguage.en: 'Burning wires releases toxic fumes and harms your lungs. Stripping is safer and yields better quality copper.',
      AppLanguage.hi: 'तार जलाने से जहरीला धुआं निकलता है और फेफड़ों को नुकसान पहुंचता है। छीलना सुरक्षित है और इससे बेहतर गुणवत्ता वाला तांबा मिलता है।',
      AppLanguage.mr: 'वायर्स जाळल्याने विषारी धूर बाहेर पडतो आणि फुफ्फुसांना हानी पोहोचते. सोलणे सुरक्षित आहे आणि चांगल्या दर्जाचे तांबे मिळते.'
    },
    'safe_batt': {
      AppLanguage.en: 'Don\'t Crack Batteries',
      AppLanguage.hi: 'बैटरी न तोड़ें',
      AppLanguage.mr: 'बॅटरी फोडू नका'
    },
    'safe_batt_desc': {
      AppLanguage.en: 'Lithium-ion and lead-acid batteries contain dangerous chemicals that can explode or cause severe burns. Keep them intact.',
      AppLanguage.hi: 'लिथियम-आयन और लेड-एसिड बैटरी में खतरनाक रसायन होते हैं जो फट सकते हैं या गंभीर जलन पैदा कर सकते हैं। उन्हें सुरक्षित रखें।',
      AppLanguage.mr: 'लिथियम-आयन आणि लीड-अ‍ॅसिड बॅटरीमध्ये घातक रसायने असतात जी स्फोट होऊ शकतात किंवा गंभीर भाजण्याची शक्यता असते. त्यांना सुरक्षित ठेवा.'
    },
    'safe_crt': {
      AppLanguage.en: 'Handle CRTs Carefully',
      AppLanguage.hi: 'सीआरटी को सावधानी से संभालें',
      AppLanguage.mr: 'सीआरटीएस काळजीपूर्वक हाताळा'
    },
    'safe_crt_desc': {
      AppLanguage.en: 'Old TV/Monitor glass (CRT) contains lead and phosphors. Broken glass is dangerous. Transport them whole.',
      AppLanguage.hi: 'पुराने टीवी/मॉनिटर ग्लास (सीआरटी) में लेड और फॉस्फोर होता है। टूटा हुआ कांच खतरनाक है। उन्हें साबुत ले जाएं।',
      AppLanguage.mr: 'जुन्या टीव्ही/मॉनिटर ग्लास (CRT) मध्ये लीड आणि फॉस्फरस असते. फुटलेली काच धोकादायक असते. ते अखंड वाहतूक करा.'
    },
    'safe_gear': {
      AppLanguage.en: 'Wear Gloves & Masks',
      AppLanguage.hi: 'दस्ताने और मास्क पहनें',
      AppLanguage.mr: 'हातमोजे आणि मास्क घाला'
    },
    'safe_gear_desc': {
      AppLanguage.en: 'Always wear basic protective gear when handling sharp metals, dusty electronics, or unknown components.',
      AppLanguage.hi: 'तेज धातु, धूल भरे इलेक्ट्रॉनिक्स या अज्ञात घटकों को संभालते समय हमेशा बुनियादी सुरक्षा गियर पहनें।',
      AppLanguage.mr: 'तीक्ष्ण धातू, धूळ भरलेले इलेक्ट्रॉनिक्स किंवा अज्ञात घटक हाताळताना नेहमी मूलभूत संरक्षणात्मक गियर घाला.'
    },

    // --- NEW KEYS ADDED FROM AUDIT ---
    'status_received': {
      AppLanguage.en: 'Received',
      AppLanguage.hi: 'प्राप्त हुआ',
      AppLanguage.mr: 'प्राप्त झाले'
    },
    'status_pending': {
      AppLanguage.en: 'Pending',
      AppLanguage.hi: 'लंबित',
      AppLanguage.mr: 'प्रलंबित'
    },
    'status_handed_over': {
      AppLanguage.en: 'Handed Over',
      AppLanguage.hi: 'सौंप दिया गया',
      AppLanguage.mr: 'सोपवले'
    },
    'status_pickup_pending': {
      AppLanguage.en: 'Pickup Pending',
      AppLanguage.hi: 'पिकअप लंबित',
      AppLanguage.mr: 'पिकअप प्रलंबित'
    },
    'status_not_assigned': {
      AppLanguage.en: 'Not Assigned',
      AppLanguage.hi: 'असाइन नहीं किया गया',
      AppLanguage.mr: 'नियुक्त केलेले नाही'
    },
    'status_disputed': {
      AppLanguage.en: 'Disputed',
      AppLanguage.hi: 'विवादित',
      AppLanguage.mr: 'वादग्रस्त'
    },
    'status_active': {
      AppLanguage.en: 'Active',
      AppLanguage.hi: 'सक्रिय',
      AppLanguage.mr: 'सक्रिय'
    },
    'status_sold': {
      AppLanguage.en: 'Sold',
      AppLanguage.hi: 'बेचा गया',
      AppLanguage.mr: 'विकले'
    },
    'status_declined': {
      AppLanguage.en: 'Declined',
      AppLanguage.hi: 'अस्वीकृत',
      AppLanguage.mr: 'नाकारले'
    },
    'status_completed': {
      AppLanguage.en: 'Completed',
      AppLanguage.hi: 'पूरा हुआ',
      AppLanguage.mr: 'पूर्ण झाले'
    },
    'status_in_progress': {
      AppLanguage.en: 'In Progress',
      AppLanguage.hi: 'प्रगति पर',
      AppLanguage.mr: 'प्रगतीवर आहे'
    },



    'empty_recyclers_title': {
      AppLanguage.en: 'No Recyclers Found',
      AppLanguage.hi: 'कोई रीसायकलर नहीं मिला',
      AppLanguage.mr: 'कोणतेही रीसायकलर्स आढळले नाहीत'
    },
    'empty_recyclers_desc': {
      AppLanguage.en: 'Try searching for something else or clearing the filters.',
      AppLanguage.hi: 'कुछ और खोजने का प्रयास करें या फ़िल्टर साफ़ करें।',
      AppLanguage.mr: 'काहीतरी वेगळे शोधण्याचा प्रयत्न करा किंवा फिल्टर साफ करा.'
    },
    'empty_earnings_title': {
      AppLanguage.en: 'No Transactions Yet',
      AppLanguage.hi: 'अभी तक कोई लेनदेन नहीं',
      AppLanguage.mr: 'अद्याप कोणतेही व्यवहार नाहीत'
    },
    'empty_earnings_desc': {
      AppLanguage.en: 'Complete your first handover to see earnings here.',
      AppLanguage.hi: 'यहां कमाई देखने के लिए अपना पहला हैंडओवर पूरा करें।',
      AppLanguage.mr: 'येथे कमाई पाहण्यासाठी तुमचा पहिला हँडओव्हर पूर्ण करा.'
    },

    'toast_location_soon': {
      AppLanguage.en: 'Location filter options coming soon!',
      AppLanguage.hi: 'स्थान फ़िल्टर विकल्प जल्द आ रहे हैं!',
      AppLanguage.mr: 'स्थान फिल्टर पर्याय लवकरच येत आहेत!'
    },
    'toast_time_soon': {
      AppLanguage.en: 'Time filter options coming soon!',
      AppLanguage.hi: 'समय फ़िल्टर विकल्प जल्द आ रहे हैं!',
      AppLanguage.mr: 'वेळ फिल्टर पर्याय लवकरच येत आहेत!'
    },
    'toast_help_soon': {
      AppLanguage.en: 'Help & Support coming soon!',
      AppLanguage.hi: 'सहायता और समर्थन जल्द आ रहा है!',
      AppLanguage.mr: 'मदत आणि समर्थन लवकरच येत आहे!'
    },
    'toast_lot_not_found': {
      AppLanguage.en: 'Error: Lot details not found',
      AppLanguage.hi: 'त्रुटि: लॉट विवरण नहीं मिला',
      AppLanguage.mr: 'त्रुटी: लॉट तपशील आढळले नाहीत'
    },
    'toast_update_failed': {
      AppLanguage.en: 'Failed to update lot batch.',
      AppLanguage.hi: 'लॉट बैच अपडेट करने में विफल।',
      AppLanguage.mr: 'लॉट बॅच अपडेट करण्यात अयशस्वी.'
    },
    'toast_no_unassigned_lot': {
      AppLanguage.en: 'No unassigned lot found for this material.',
      AppLanguage.hi: 'इस सामग्री के लिए कोई असाइन नहीं किया गया लॉट नहीं मिला।',
      AppLanguage.mr: 'या सामग्रीसाठी कोणताही नियुक्त न केलेला लॉट आढळला नाही.'
    },

    'filter_all': {
      AppLanguage.en: 'All',
      AppLanguage.hi: 'सभी',
      AppLanguage.mr: 'सर्व'
    },
    'filter_in_progress': {
      AppLanguage.en: 'In Progress',
      AppLanguage.hi: 'प्रगति पर',
      AppLanguage.mr: 'प्रगतीवर आहे'
    },
    'filter_completed': {
      AppLanguage.en: 'Completed',
      AppLanguage.hi: 'पूरा हुआ',
      AppLanguage.mr: 'पूर्ण झाले'
    },
    'filter_disputed': {
      AppLanguage.en: 'Disputed',
      AppLanguage.hi: 'विवादित',
      AppLanguage.mr: 'वादग्रस्त'
    },
    'filter_all_categories': {
      AppLanguage.en: 'All Categories',
      AppLanguage.hi: 'सभी श्रेणियां',
      AppLanguage.mr: 'सर्व श्रेणी'
    },
    'filter_best_match': {
      AppLanguage.en: 'Best match',
      AppLanguage.hi: 'सर्वश्रेष्ठ मिलान',
      AppLanguage.mr: 'सर्वोत्तम जुळणी'
    },
    'label_select_language': {
      AppLanguage.en: 'Select Language',
      AppLanguage.hi: 'भाषा चुनें',
      AppLanguage.mr: 'भाषा निवडा'
    },

    'safety_motor_warn': {
      AppLanguage.en: 'Do not smash the outer casing to get the coils!',
      AppLanguage.hi: 'कॉइल निकालने के लिए बाहरी आवरण को न तोड़ें!',
      AppLanguage.mr: 'कॉइल काढण्यासाठी बाहेरील आवरण फोडू नका!'
    },
    'safety_motor_tip': {
      AppLanguage.en: 'Whole, clean motors are easier and faster to weigh and process.',
      AppLanguage.hi: 'पूरे, साफ़ मोटरों का वजन और प्रक्रिया करना आसान और तेज़ होता है।',
      AppLanguage.mr: 'संपूर्ण, स्वच्छ मोटर्सचे वजन आणि प्रक्रिया करणे सोपे आणि जलद असते.'
    },
    'safety_magnet_warn': {
      AppLanguage.en: 'Keep powerful magnets separated from other electronics!',
      AppLanguage.hi: 'शक्तिशाली चुम्बकों को अन्य इलेक्ट्रॉनिक्स से अलग रखें!',
      AppLanguage.mr: 'शक्तिशाली चुंबक इतर इलेक्ट्रॉनिक्सपासून वेगळे ठेवा!'
    },
    'safety_magnet_tip': {
      AppLanguage.en: 'Prevents accidental damage to other items in your lot, helping preserve their value too.',
      AppLanguage.hi: 'आपके लॉट में अन्य वस्तुओं को आकस्मिक क्षति से बचाता है, जिससे उनका मूल्य भी संरक्षित रहता है।',
      AppLanguage.mr: 'तुमच्या लॉटमधील इतर वस्तूंचे अपघाती नुकसान टाळते, त्यांचे मूल्य देखील टिकवून ठेवण्यास मदत करते.'
    },
    'safety_plastic_warn': {
      AppLanguage.en: 'Keep plastics dry and free of oil or chemicals!',
      AppLanguage.hi: 'प्लास्टिक को सूखा और तेल या रसायनों से मुक्त रखें!',
      AppLanguage.mr: 'प्लास्टिक कोरडे आणि तेल किंवा रसायनांपासून मुक्त ठेवा!'
    },
    'safety_plastic_tip': {
      AppLanguage.en: 'Clean, dry plastics are easier to sort and less likely to be rejected.',
      AppLanguage.hi: 'साफ़, सूखे प्लास्टिक को छांटना आसान होता है और अस्वीकार किए जाने की संभावना कम होती है।',
      AppLanguage.mr: 'स्वच्छ, कोरडे प्लास्टिक वेगळे करणे सोपे असते आणि नाकारले जाण्याची शक्यता कमी असते.'
    },

    'label_lot_id': {
      AppLanguage.en: 'Lot ID',
      AppLanguage.hi: 'लॉट आईडी',
      AppLanguage.mr: 'लॉट आयडी'
    },
    'label_na': {
      AppLanguage.en: 'N/A',
      AppLanguage.hi: 'लागू नहीं',
      AppLanguage.mr: 'लागू नाही'
    },
    'label_attached': {
      AppLanguage.en: 'attached',
      AppLanguage.hi: 'संलग्न',
      AppLanguage.mr: 'जोडलेले'
    },
    'label_today': {
      AppLanguage.en: 'Today',
      AppLanguage.hi: 'आज',
      AppLanguage.mr: 'आज'
    },
    'label_unknown': {
      AppLanguage.en: 'Unknown',
      AppLanguage.hi: 'अज्ञात',
      AppLanguage.mr: 'अज्ञात'
    },
  };

  static String t(AppLanguage lang, String key) {
    if (!_strings.containsKey(key)) {
      return key; // Fallback to key
    }
    return _strings[key]![lang] ?? _strings[key]![AppLanguage.en] ?? key;
  }
}

class AppLocalizations extends InheritedWidget {
  final AppLanguage language;
  final bool isVoiceModeEnabled;
  final Function(AppLanguage) changeLanguage;
  final VoidCallback toggleVoiceMode;

  const AppLocalizations({
    super.key,
    required this.language,
    required this.isVoiceModeEnabled,
    required this.changeLanguage,
    required this.toggleVoiceMode,
    required super.child,
  });

  static AppLocalizations of(BuildContext context) {
    final AppLocalizations? result =
        context.dependOnInheritedWidgetOfExactType<AppLocalizations>();
    assert(result != null, 'No AppLocalizations found in context');
    return result!;
  }

  String t(String key) => AppTranslations.t(language, key);

  String translateMaterial(String materialName) {
    switch (materialName.toLowerCase()) {
      case 'pcb': return t('cat_pcb');
      case 'cable': return t('cat_cable');
      case 'battery': return t('cat_battery');
      case 'lcd panel': return t('cat_lcd');
      case 'motor': return t('cat_motor');
      case 'magnet': return t('cat_magnet');
      case 'magnet-bearing': return t('cat_magnet');
      case 'magnet bearing': return t('cat_magnet');
      case 'magnet-bearing assembly': return t('cat_magnet');
      case 'mixed plastics': return t('cat_mixed_plastics');
      case 'copper cable': return t('cat_copper_cable');
      case 'crt glass': return t('cat_crt_glass');
      case 'scrap battery': return t('cat_scrap_battery');
      case 'all categories': return t('filter_all_categories');
      default: return materialName;
    }
  }

  String translateMaterialDesc(String materialName) {
    switch (materialName.toLowerCase()) {
      case 'pcb': return t('desc_pcb');
      case 'cable': return t('desc_cable');
      case 'battery': return t('desc_battery');
      case 'lcd panel': return t('desc_lcd');
      case 'motor': return t('desc_motor');
      case 'magnet': return t('desc_magnet');
      case 'magnet-bearing': return t('desc_magnet');
      case 'magnet bearing': return t('desc_magnet');
      case 'magnet-bearing assembly': return t('desc_magnet');
      case 'mixed plastics': return t('desc_mixed_plastics');
      case 'crt glass': return t('desc_crt_glass');
      default: return '';
    }
  }

  String translateCondition(String conditionString) {
    if (conditionString == 'Unknown' || conditionString == 'अज्ञात') {
      return language == AppLanguage.en ? 'Unknown' : language == AppLanguage.hi ? 'अज्ञात' : 'अज्ञात';
    }
    
    List<String> conditions = conditionString.split(', ');
    List<String> translated = conditions.map((c) {
      switch (c.trim().toLowerCase()) {
        case 'clean': return t('cond_clean');
        case 'broken': return t('cond_broken');
        case 'burnt': return t('cond_burnt');
        case 'rusted/wet': return t('cond_rusted');
        case 'working': return t('cond_working');
        case 'not working': return t('cond_not_working');
        default: return c;
      }
    }).toList();
    return translated.join(', ');
  }

  @override
  bool updateShouldNotify(AppLocalizations oldWidget) =>
      language != oldWidget.language || isVoiceModeEnabled != oldWidget.isVoiceModeEnabled;
}

