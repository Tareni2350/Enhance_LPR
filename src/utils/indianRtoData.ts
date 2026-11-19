export interface StateInfo {
  code: string;
  name: string;
  type: 'State' | 'Union Territory';
  capital: string;
}

export const INDIAN_STATES_AND_UTS: Record<string, StateInfo> = {
  AN: { code: 'AN', name: 'Andaman & Nicobar Islands', type: 'Union Territory', capital: 'Port Blair' },
  AP: { code: 'AP', name: 'Andhra Pradesh', type: 'State', capital: 'Amaravati' },
  AR: { code: 'AR', name: 'Arunachal Pradesh', type: 'State', capital: 'Itanagar' },
  AS: { code: 'AS', name: 'Assam', type: 'State', capital: 'Dispur' },
  BR: { code: 'BR', name: 'Bihar', type: 'State', capital: 'Patna' },
  CH: { code: 'CH', name: 'Chandigarh', type: 'Union Territory', capital: 'Chandigarh' },
  CG: { code: 'CG', name: 'Chhattisgarh', type: 'State', capital: 'Raipur' },
  CT: { code: 'CT', name: 'Chhattisgarh', type: 'State', capital: 'Raipur' },
  DD: { code: 'DD', name: 'Dadra & Nagar Haveli and Daman & Diu', type: 'Union Territory', capital: 'Daman' },
  DN: { code: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', type: 'Union Territory', capital: 'Daman' },
  DL: { code: 'DL', name: 'Delhi (NCT)', type: 'Union Territory', capital: 'New Delhi' },
  GA: { code: 'GA', name: 'Goa', type: 'State', capital: 'Panaji' },
  GJ: { code: 'GJ', name: 'Gujarat', type: 'State', capital: 'Gandhinagar' },
  HR: { code: 'HR', name: 'Haryana', type: 'State', capital: 'Chandigarh' },
  HP: { code: 'HP', name: 'Himachal Pradesh', type: 'State', capital: 'Shimla' },
  JH: { code: 'JH', name: 'Jharkhand', type: 'State', capital: 'Ranchi' },
  JK: { code: 'JK', name: 'Jammu & Kashmir', type: 'Union Territory', capital: 'Srinagar / Jammu' },
  KA: { code: 'KA', name: 'Karnataka', type: 'State', capital: 'Bengaluru' },
  KL: { code: 'KL', name: 'Kerala', type: 'State', capital: 'Thiruvananthapuram' },
  LA: { code: 'LA', name: 'Ladakh', type: 'Union Territory', capital: 'Leh' },
  LD: { code: 'LD', name: 'Lakshadweep', type: 'Union Territory', capital: 'Kavaratti' },
  MP: { code: 'MP', name: 'Madhya Pradesh', type: 'State', capital: 'Bhopal' },
  MH: { code: 'MH', name: 'Maharashtra', type: 'State', capital: 'Mumbai' },
  MN: { code: 'MN', name: 'Manipur', type: 'State', capital: 'Imphal' },
  ML: { code: 'ML', name: 'Meghalaya', type: 'State', capital: 'Shillong' },
  MZ: { code: 'MZ', name: 'Mizoram', type: 'State', capital: 'Aizawl' },
  NL: { code: 'NL', name: 'Nagaland', type: 'State', capital: 'Kohima' },
  OD: { code: 'OD', name: 'Odisha', type: 'State', capital: 'Bhubaneswar' },
  OR: { code: 'OR', name: 'Odisha (Legacy)', type: 'State', capital: 'Bhubaneswar' },
  PB: { code: 'PB', name: 'Punjab', type: 'State', capital: 'Chandigarh' },
  PY: { code: 'PY', name: 'Puducherry', type: 'Union Territory', capital: 'Puducherry' },
  RJ: { code: 'RJ', name: 'Rajasthan', type: 'State', capital: 'Jaipur' },
  SK: { code: 'SK', name: 'Sikkim', type: 'State', capital: 'Gangtok' },
  TN: { code: 'TN', name: 'Tamil Nadu', type: 'State', capital: 'Chennai' },
  TS: { code: 'TS', name: 'Telangana', type: 'State', capital: 'Hyderabad' },
  TR: { code: 'TR', name: 'Tripura', type: 'State', capital: 'Agartala' },
  UP: { code: 'UP', name: 'Uttar Pradesh', type: 'State', capital: 'Lucknow' },
  UK: { code: 'UK', name: 'Uttarakhand', type: 'State', capital: 'Dehradun' },
  UA: { code: 'UA', name: 'Uttarakhand (Legacy)', type: 'State', capital: 'Dehradun' },
  WB: { code: 'WB', name: 'West Bengal', type: 'State', capital: 'Kolkata' },
};

export const COMMON_RTO_NAMES: Record<string, string> = {
  // Delhi
  'DL-01': 'Mall Road (North Delhi)',
  'DL-02': 'IP Estate (Central Delhi)',
  'DL-03': 'Sheikh Sarai (South Delhi)',
  'DL-04': 'Janakpuri (West Delhi)',
  'DL-05': 'Loni Road (North East Delhi)',
  'DL-06': 'Sarai Kale Khan (Central South)',
  'DL-07': 'Mayur Vihar (East Delhi)',
  'DL-08': 'Wazirpur (North West Delhi)',
  'DL-09': 'Palam / Janakpuri (South West Delhi)',
  'DL-10': 'Raja Garden (West Delhi)',
  'DL-11': 'Rohini (North West Delhi)',
  'DL-12': 'Vasant Vihar (South West Delhi)',
  'DL-13': 'Surajmal Vihar (East Delhi)',
  'DL-14': 'Sonipat Border / Commercial',

  // Maharashtra
  'MH-01': 'Mumbai South (Tardeo)',
  'MH-02': 'Mumbai West (Andheri)',
  'MH-03': 'Mumbai East (Wadala)',
  'MH-04': 'Thane City',
  'MH-05': 'Kalyan / Dombivli',
  'MH-06': 'Raigad (Pen)',
  'MH-07': 'Sindhudurg (Oros)',
  'MH-08': 'Ratnagiri',
  'MH-09': 'Kolhapur',
  'MH-10': 'Sangli',
  'MH-11': 'Satara',
  'MH-12': 'Pune City',
  'MH-13': 'Solapur',
  'MH-14': 'Pimpri-Chinchwad (PCMC)',
  'MH-15': 'Nashik',
  'MH-17': 'Shrirampur (Ahmednagar)',
  'MH-20': 'Chhatrapati Sambhajinagar (Aurangabad)',
  'MH-31': 'Nagpur West',
  'MH-43': 'Navi Mumbai (Vashi)',
  'MH-46': 'Navi Mumbai (Panvel)',
  'MH-47': 'Mumbai North (Borivali)',
  'MH-48': 'Vasai-Virar (Palghar)',

  // Karnataka
  'KA-01': 'Bengaluru Central (Koramangala)',
  'KA-02': 'Bengaluru West (Rajajinagar)',
  'KA-03': 'Bengaluru East (Indiranagar)',
  'KA-04': 'Bengaluru North (Yeshwanthpur)',
  'KA-05': 'Bengaluru South (Jayanagar)',
  'KA-09': 'Mysuru City',
  'KA-19': 'Mangaluru',
  'KA-20': 'Udupi',
  'KA-22': 'Belagavi',
  'KA-25': 'Dharwad',
  'KA-50': 'Bengaluru (Yelahanka)',
  'KA-51': 'Bengaluru (Electronic City)',
  'KA-53': 'Bengaluru (K.R. Puram)',

  // Tamil Nadu
  'TN-01': 'Chennai Central (Ayanavaram)',
  'TN-02': 'Chennai North West (Anna Nagar)',
  'TN-03': 'Chennai North East (Tondiarpet)',
  'TN-04': 'Chennai East (Royapuram)',
  'TN-05': 'Chennai North (Kolathur)',
  'TN-06': 'Chennai South East (Mandaveli)',
  'TN-07': 'Chennai South (Thiruvanmiyur)',
  'TN-09': 'Chennai West (KK Nagar)',
  'TN-10': 'Chennai South West (Virugambakkam)',
  'TN-14': 'Chennai South (Sholinganallur)',
  'TN-37': 'Coimbatore South',
  'TN-38': 'Coimbatore North',
  'TN-58': 'Madurai South',

  // Uttar Pradesh
  'UP-14': 'Ghaziabad',
  'UP-16': 'Gautam Buddha Nagar (Noida)',
  'UP-32': 'Lucknow',
  'UP-70': 'Prayagraj (Allahabad)',
  'UP-78': 'Kanpur Nagar',
  'UP-80': 'Agra',
  'UP-65': 'Varanasi',

  // Gujarat
  'GJ-01': 'Ahmedabad City',
  'GJ-02': 'Mehsana',
  'GJ-03': 'Rajkot',
  'GJ-05': 'Surat City',
  'GJ-06': 'Vadodara',
  'GJ-27': 'Ahmedabad East (Vastral)',

  // Telangana
  'TS-07': 'Ranga Reddy (Attapur)',
  'TS-08': 'Medchal-Malkajgiri',
  'TS-09': 'Hyderabad Central (Khairatabad)',
  'TS-10': 'Hyderabad North (Secunderabad)',
  'TS-11': 'Hyderabad East (Malakpet)',
  'TS-12': 'Hyderabad South (Kishanbagh)',
  'TS-13': 'Hyderabad West (Tolichowki)',

  // Kerala
  'KL-01': 'Thiruvananthapuram',
  'KL-07': 'Ernakulam (Kochi)',
  'KL-11': 'Kozhikode',
  'KL-08': 'Thrissur',
};

export interface LocalValidationResult {
  isValid: boolean;
  formatCategory: string;
  stateCode?: string;
  stateName?: string;
  rtoCode?: string;
  districtRTO?: string;
  series?: string;
  uniqueDigits?: string;
  validationExplanation: string;
  ruleCompliant: boolean;
  complianceIssues: string[];
}

/**
 * Validates and parses an Indian license plate text string
 */
export function validateIndianPlate(input: string): LocalValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      formatCategory: 'Empty',
      validationExplanation: 'No characters detected on plate.',
      ruleCompliant: false,
      complianceIssues: ['Image contains no readable license plate text.'],
    };
  }

  // Clean string: uppercase, remove special chars except spaces and arrow
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9\s↑^]/g, '').trim();
  const collapsed = cleaned.replace(/\s+/g, ' ');
  const squished = cleaned.replace(/\s+/g, '');

  const issues: string[] = [];

  // 1. Check Bharat Series: e.g. "22 BH 5432 AA" or "21BH1234A"
  // Format: [YY 2-digits] BH [4 digits 0001-9999] [1-2 letters AA-ZZ]
  const bhMatch = squished.match(/^([0-9]{2})BH([0-9]{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    const year = bhMatch[1];
    const serial = bhMatch[2];
    const alpha = bhMatch[3];
    return {
      isValid: true,
      formatCategory: 'Bharat Series (BH)',
      stateCode: 'BH',
      stateName: 'Pan-India (BH Bharat Series)',
      districtRTO: 'Nationwide Non-Localized Registration',
      series: alpha,
      uniqueDigits: serial,
      validationExplanation: `Valid MoRTH Bharat (BH) Series registered in year 20${year}. Unique serial: ${serial}, Series: ${alpha}. Seamless inter-state transfer permitted under Rule 51B CMVR.`,
      ruleCompliant: true,
      complianceIssues: [],
    };
  }

  // 2. Check Standard State Format: e.g. "MH 12 DE 1433", "DL 01 C 9081", "KA 05 MN 9999"
  // Format: [2-letter State] [1-2 digit RTO] [0-3 letter series] [4 digit number]
  const stdMatch = squished.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,4})$/);
  if (stdMatch) {
    const stCode = stdMatch[1];
    const rtoNum = stdMatch[2].padStart(2, '0');
    const seriesLetters = stdMatch[3] || '';
    const regDigits = stdMatch[4].padStart(4, '0');

    const state = INDIAN_STATES_AND_UTS[stCode];
    if (!state) {
      issues.push(`State code "${stCode}" is not recognized among the 36 Indian States/UTs.`);
      return {
        isValid: false,
        formatCategory: 'Invalid State Code',
        stateCode: stCode,
        validationExplanation: `The prefix "${stCode}" is not a valid Indian State or Union Territory motor vehicle code.`,
        ruleCompliant: false,
        complianceIssues: issues,
      };
    }

    const rtoKey = `${stCode}-${rtoNum}`;
    const rtoName = COMMON_RTO_NAMES[rtoKey] || `RTO Unit ${rtoNum}, ${state.name}`;

    if (parseInt(regDigits, 10) === 0) {
      issues.push('Registration number cannot be "0000".');
    }

    const isRuleCompliant = issues.length === 0 && regDigits.length === 4;

    return {
      isValid: true,
      formatCategory: 'Standard MoRTH State Series',
      stateCode: stCode,
      stateName: state.name,
      rtoCode: rtoNum,
      districtRTO: rtoName,
      series: seriesLetters || 'None (Base Series)',
      uniqueDigits: regDigits,
      validationExplanation: `Valid Indian standard plate for ${state.name} (${rtoName}). Series: ${seriesLetters || 'Base'}, Registration number: ${regDigits}. Conforms to MoRTH Section 41 MV Act.`,
      ruleCompliant: isRuleCompliant,
      complianceIssues: issues,
    };
  }

  // 3. Check Diplomatic / Consular: e.g. "21 CD 1234", "77 CC 101"
  const dipMatch = squished.match(/^([0-9]{1,3})(CD|CC|UN)([0-9]{1,4})$/);
  if (dipMatch) {
    const embassyId = dipMatch[1];
    const corpType = dipMatch[2];
    const regNum = dipMatch[3];
    return {
      isValid: true,
      formatCategory: 'Diplomatic / Consular (Blue Plate)',
      series: corpType,
      uniqueDigits: regNum,
      validationExplanation: `Valid Diplomatic Corps registration (${corpType}) representing Mission/Country code ${embassyId}. Exempt from domestic state RTO zoning.`,
      ruleCompliant: true,
      complianceIssues: [],
    };
  }

  // 4. Check Military Vehicle (Arrow up format): e.g. "19D012345A" or "↑123456"
  if (cleaned.includes('↑') || cleaned.includes('^') || /^[0-9]{2}[A-Z][0-9]{5,6}/.test(squished)) {
    return {
      isValid: true,
      formatCategory: 'Indian Armed Forces (Military)',
      validationExplanation: 'Recognized Indian Defence Services military vehicle registration with broad arrow insignia. Governed by Ministry of Defence.',
      ruleCompliant: true,
      complianceIssues: [],
    };
  }

  // 5. Check Vintage / Pre-1989 legacy: e.g. "BLA 1234" or "MUM 9999"
  const legacyMatch = squished.match(/^([A-Z]{1,3})([0-9]{1,4})$/);
  if (legacyMatch) {
    return {
      isValid: true,
      formatCategory: 'Vintage / Pre-1989 Legacy',
      series: legacyMatch[1],
      uniqueDigits: legacyMatch[2],
      validationExplanation: `Legacy Indian numbering format used prior to the 1989 Motor Vehicles Act standard reform (${legacyMatch[1]} ${legacyMatch[2]}).`,
      ruleCompliant: false,
      complianceIssues: ['Pre-1989 format: Requires HSRP re-registration in most states.'],
    };
  }

  return {
    isValid: false,
    formatCategory: 'Non-Standard / Unrecognized Format',
    validationExplanation: `Extracted string "${collapsed}" does not conform to the Indian MoRTH Motor Vehicle Act format (e.g. State-RTO-Series-Digits like "MH 12 AB 1234" or "22 BH 1234 AA").`,
    ruleCompliant: false,
    complianceIssues: [
      'Failed regex pattern match for standard Indian states and Bharat (BH) series.',
      'Check if some characters were obscured by dust, frame bolts, or glare.',
    ],
  };
}

/**
 * Format string neatly into "XX 00 XX 0000"
 */
export function formatPlateDisplay(raw: string): string {
  if (!raw) return '';
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Check BH series: 2 digits, BH, 4 digits, 1-2 letters
  const bhMatch = s.match(/^([0-9]{2})(BH)([0-9]{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    return `${bhMatch[1]} ${bhMatch[2]} ${bhMatch[3]} ${bhMatch[4]}`;
  }

  // Check Standard: 2 letters, 1-2 digits, 0-3 letters, 1-4 digits
  const stdMatch = s.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,4})$/);
  if (stdMatch) {
    const parts = [stdMatch[1], stdMatch[2]];
    if (stdMatch[3]) parts.push(stdMatch[3]);
    if (stdMatch[4]) parts.push(stdMatch[4]);
    return parts.join(' ');
  }

  // Fallback: keep original with space collapsing
  return raw.trim().toUpperCase().replace(/\s+/g, ' ');
}
