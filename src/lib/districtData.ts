// District and settlement mapping data
export interface Settlement {
  id: string;
  name: string;
  districtId: string;
  type: 'city' | 'town' | 'village' | 'kibbutz' | 'moshav' | 'regional_council';
}

export interface District {
  id: string;
  name: string;
  description: string;
  isLarge: boolean;
}

export const districts: District[] = [
  { id: '1', name: 'מחוז הגליל העליון והגולן', description: 'צפון, כפרי-מעורב', isLarge: false },
  { id: '2', name: 'מחוז הגליל התחתון והעמקים', description: 'צפון, מעורב', isLarge: false },
  { id: '3', name: 'מחוז חיפה והכרמל', description: 'מעורב, חילוני-ליברלי', isLarge: true },
  { id: '4', name: 'מחוז השרון והמרכז הצפוני', description: 'מרכז, חילוני-ליברלי', isLarge: true },
  { id: '5', name: 'מחוז גוש דן והמטרופולין', description: 'מרכז, אורבני', isLarge: true },
  { id: '6', name: 'מחוז בני ברק והסביבה', description: 'מרכז, חרדי', isLarge: false },
  { id: '7', name: 'מחוז ירושלים המערבית', description: 'מרכז, מסורתי-דתי', isLarge: true },
  { id: '8', name: 'מחוז ירושלים החרדית וההתיישבות ביו"ש', description: 'חרדי-דתי-לאומי', isLarge: true },
  { id: '9', name: 'מחוז שפלה ודרום מרכז', description: 'מרכז-דרום, מעורב', isLarge: true },
  { id: '10', name: 'מחוז הנגב הצפוני והמערבי', description: 'דרום, מעורב', isLarge: false },
  { id: '11', name: 'מחוז בקעת הירדן והמדבר', description: 'מזרח, כפרי', isLarge: false },
  { id: '12', name: 'מחוז הנגב הדרומי ואילת', description: 'דרום, תיירותי', isLarge: false }
];

export const settlements: Settlement[] = [
  // מחוז הגליל העליון והגולן
  { id: 's1', name: 'קריית שמונה', districtId: '1', type: 'city' },
  { id: 's2', name: 'צפת', districtId: '1', type: 'city' },
  { id: 's3', name: 'חצור הגלילית', districtId: '1', type: 'town' },
  { id: 's4', name: 'ראש פינה', districtId: '1', type: 'town' },
  { id: 's5', name: 'מטולה', districtId: '1', type: 'town' },
  { id: 's6', name: 'קצרין', districtId: '1', type: 'city' },
  { id: 's7', name: 'מעלות-תרשיחא', districtId: '1', type: 'city' },
  { id: 's8', name: 'מג\'דל שמס', districtId: '1', type: 'village' },
  { id: 's9', name: 'בוקעתא', districtId: '1', type: 'village' },
  { id: 's10', name: 'מסעדה', districtId: '1', type: 'village' },

  // מחוז הגליל התחתון והעמקים
  { id: 's11', name: 'נצרת', districtId: '2', type: 'city' },
  { id: 's12', name: 'עפולה', districtId: '2', type: 'city' },
  { id: 's13', name: 'בית שאן', districtId: '2', type: 'city' },
  { id: 's14', name: 'יקנעם עילית', districtId: '2', type: 'city' },
  { id: 's15', name: 'מגדל העמק', districtId: '2', type: 'city' },
  { id: 's16', name: 'טבריה', districtId: '2', type: 'city' },
  { id: 's17', name: 'כפר כנא', districtId: '2', type: 'village' },
  { id: 's18', name: 'שפרעם', districtId: '2', type: 'city' },
  { id: 's19', name: 'טמרה', districtId: '2', type: 'city' },
  { id: 's20', name: 'אום אל-פחם', districtId: '2', type: 'city' },

  // מחוז חיפה והכרמל
  { id: 's21', name: 'חיפה', districtId: '3', type: 'city' },
  { id: 's22', name: 'קריית אתא', districtId: '3', type: 'city' },
  { id: 's23', name: 'קריית ביאליק', districtId: '3', type: 'city' },
  { id: 's24', name: 'קריית מוצקין', districtId: '3', type: 'city' },
  { id: 's25', name: 'קריית ים', districtId: '3', type: 'city' },
  { id: 's26', name: 'נשר', districtId: '3', type: 'city' },
  { id: 's27', name: 'טירת הכרמל', districtId: '3', type: 'city' },
  { id: 's28', name: 'עתלית', districtId: '3', type: 'town' },
  { id: 's29', name: 'עכו', districtId: '3', type: 'city' },
  { id: 's30', name: 'נהריה', districtId: '3', type: 'city' },

  // מחוז השרון והמרכז הצפוני
  { id: 's31', name: 'נתניה', districtId: '4', type: 'city' },
  { id: 's32', name: 'הרצליה', districtId: '4', type: 'city' },
  { id: 's33', name: 'רעננה', districtId: '4', type: 'city' },
  { id: 's34', name: 'כפר סבא', districtId: '4', type: 'city' },
  { id: 's35', name: 'הוד השרון', districtId: '4', type: 'city' },
  { id: 's36', name: 'רמת השרון', districtId: '4', type: 'city' },
  { id: 's37', name: 'כוכב יאיר', districtId: '4', type: 'city' },
  { id: 's38', name: 'טירה', districtId: '4', type: 'city' },
  { id: 's39', name: 'קלנסווה', districtId: '4', type: 'city' },
  { id: 's40', name: 'כפר קאסם', districtId: '4', type: 'city' },

  // מחוז גוש דן והמטרופולין
  { id: 's41', name: 'תל אביב-יפו', districtId: '5', type: 'city' },
  { id: 's42', name: 'רמת גן', districtId: '5', type: 'city' },
  { id: 's43', name: 'גבעתיים', districtId: '5', type: 'city' },
  { id: 's44', name: 'חולון', districtId: '5', type: 'city' },
  { id: 's45', name: 'בת ים', districtId: '5', type: 'city' },
  { id: 's46', name: 'ראשון לציון', districtId: '5', type: 'city' },
  { id: 's47', name: 'נס ציונה', districtId: '5', type: 'city' },
  { id: 's48', name: 'רחובות', districtId: '5', type: 'city' },
  { id: 's49', name: 'לוד', districtId: '5', type: 'city' },
  { id: 's50', name: 'רמלה', districtId: '5', type: 'city' },

  // מחוז בני ברק והסביבה
  { id: 's51', name: 'בני ברק', districtId: '6', type: 'city' },
  { id: 's52', name: 'אלעד', districtId: '6', type: 'city' },
  { id: 's53', name: 'עמנואל', districtId: '6', type: 'city' },

  // מחוז ירושלים המערבית
  { id: 's54', name: 'ירושלים', districtId: '7', type: 'city' },
  { id: 's55', name: 'מבשרת ציון', districtId: '7', type: 'city' },
  { id: 's56', name: 'אבו גוש', districtId: '7', type: 'village' },
  { id: 's57', name: 'בית נקופה', districtId: '7', type: 'village' },
  { id: 's58', name: 'גבעת זאב', districtId: '7', type: 'city' },

  // מחוז ירושלים החרדית וההתיישבות ביו"ש
  { id: 's59', name: 'בית שמש', districtId: '8', type: 'city' },
  { id: 's60', name: 'מודיעין עילית', districtId: '8', type: 'city' },
  { id: 's61', name: 'ביתר עילית', districtId: '8', type: 'city' },
  { id: 's62', name: 'מעלה אדומים', districtId: '8', type: 'city' },
  { id: 's63', name: 'אפרת', districtId: '8', type: 'city' },
  { id: 's64', name: 'אריאל', districtId: '8', type: 'city' },

  // מחוז שפלה ודרום מרכז
  { id: 's65', name: 'אשדוד', districtId: '9', type: 'city' },
  { id: 's66', name: 'אשקלון', districtId: '9', type: 'city' },
  { id: 's67', name: 'קריית גת', districtId: '9', type: 'city' },
  { id: 's68', name: 'קריית מלאכי', districtId: '9', type: 'city' },
  { id: 's69', name: 'יבנה', districtId: '9', type: 'city' },
  { id: 's70', name: 'גדרה', districtId: '9', type: 'city' },

  // מחוז הנגב הצפוני והמערבי
  { id: 's71', name: 'באר שבע', districtId: '10', type: 'city' },
  { id: 's72', name: 'רהט', districtId: '10', type: 'city' },
  { id: 's73', name: 'דימונה', districtId: '10', type: 'city' },
  { id: 's74', name: 'ערד', districtId: '10', type: 'city' },
  { id: 's75', name: 'ירוחם', districtId: '10', type: 'city' },
  { id: 's76', name: 'שדרות', districtId: '10', type: 'city' },
  { id: 's77', name: 'אופקים', districtId: '10', type: 'city' },
  { id: 's78', name: 'נתיבות', districtId: '10', type: 'city' },

  // מחוז בקעת הירדן והמדבר
  { id: 's79', name: 'מעלה אפרים', districtId: '11', type: 'town' },
  { id: 's80', name: 'פצאל', districtId: '11', type: 'moshav' },
  { id: 's81', name: 'בקעות', districtId: '11', type: 'moshav' },

  // מחוז הנגב הדרומי ואילת
  { id: 's82', name: 'אילת', districtId: '12', type: 'city' },
  { id: 's83', name: 'מצפה רמון', districtId: '12', type: 'city' },
  { id: 's84', name: 'יטבתה', districtId: '12', type: 'kibbutz' }
];

export const getDistrictBySettlement = (settlementName: string): District | null => {
  const settlement = settlements.find(s => s.name === settlementName);
  if (!settlement) return null;
  
  return districts.find(d => d.id === settlement.districtId) || null;
};

export const getSettlementsByDistrict = (districtId: string): Settlement[] => {
  return settlements.filter(s => s.districtId === districtId);
};

export const searchSettlements = (query: string): Settlement[] => {
  if (!query.trim()) return settlements;
  
  return settlements.filter(s => 
    s.name.includes(query) || s.name.startsWith(query)
  ).slice(0, 10); // Limit to 10 results
};