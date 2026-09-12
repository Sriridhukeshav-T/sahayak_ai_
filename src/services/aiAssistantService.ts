import { UserProfile } from '../types/user';
import { Scheme } from '../types/scheme';
import { calculateSchemeMatch } from './schemeMatcherService';
import { calculateAffordability } from './affordabilityService';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'sahayak';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export function generateAssistantResponse(
  userQuery: string,
  user: UserProfile,
  activeScheme: Scheme | null,
  _allSchemes: Scheme[] = [],
  language: string = 'en'
): AssistantMessage {
  const q = userQuery.toLowerCase().trim();

  let text = '';
  const suggestedActions: { label: string; action: string }[] = [];

  // Match queries in English, Hindi, Tamil, and Malayalam
  const isBestScheme =
    q.includes('best scheme') || q.includes('which scheme') || q.includes('recommend') ||
    q.includes('योजना') || q.includes('सर्वश्रेष्ठ') ||
    q.includes('திட்டம்') || q.includes('பரிந்துரை') ||
    q.includes('പദ്ധതി') || q.includes('ഏറ്റവും നല്ല');

  const isAfford =
    q.includes('afford') || q.includes('can i borrow') || q.includes('how much can i borrow') ||
    q.includes('किस्त') || q.includes('वहन') || q.includes('லோன்') ||
    q.includes('திருப்பி') || q.includes('താങ്ങാനാകുമോ') || q.includes('ഇഎംഐ');

  const isDocument =
    q.includes('document') || q.includes('paper') || q.includes('what do i need') ||
    q.includes('दस्तावेज़') || q.includes('कागज़ात') ||
    q.includes('ஆவண') || q.includes('ரേഖകൾ');

  const isEmi =
    q.includes('emi') || q.includes('what is emi') || q.includes('ईएमआई क्या है') ||
    q.includes('இஎம்ஐ என்றால்') || q.includes('ഇ.എം.ഐ എന്നാൽ');

  const isMoratorium =
    q.includes('moratorium') || q.includes('grace period') || q.includes('छूट') ||
    q.includes('மோரட்டோரியம்') || q.includes('മൊറട്ടോറിയം');

  const isPartner =
    q.includes('partner') || q.includes('where should i apply') || q.includes('bank') ||
    q.includes('पार्टनर') || q.includes('बैंक') ||
    q.includes('வங்கி') || q.includes('ബാങ്ക്');

  const isWhy =
    q.includes('why was this scheme') || q.includes('why recommended') || q.includes('why') ||
    q.includes('क्यों') || q.includes('ஏன்') || q.includes('എന്തുകൊണ്ട്');

  if (isBestScheme) {
    if (activeScheme) {
      const match = calculateSchemeMatch(user, activeScheme);
      if (language === 'hi') {
        text = `आपकी प्रोफाइल (${user.projectType || 'उद्यमी'}, ${user.state}, वार्षिक आय ₹${(user.income || 0).toLocaleString('en-IN')}) के अनुसार, **${activeScheme.name}** वर्तमान में **${match.totalScore}%** के स्कोर के साथ आपकी सर्वश्रेष्ठ योजना है।\n\nप्रमुख कारण:\n${match.reasons.slice(0, 3).map(r => `• ${r}`).join('\n')}`;
        suggestedActions.push({ label: 'किस्त क्षमता जांचें', action: 'affordability' });
        suggestedActions.push({ label: 'नजदीकी पार्टनर खोजें', action: 'partners' });
      } else if (language === 'ta') {
        text = `உங்கள் சுயவிவரத்தின்படி (${user.projectType || 'தொழில்முனைவோர்'}, ${user.state}, ஆண்டு வருமானம் ₹${(user.income || 0).toLocaleString('en-IN')}), **${activeScheme.name}** திட்டம் **${match.totalScore}%** பொருத்தத்துடன் உங்களுக்கான சிறந்த தேர்வாகும்.\n\nமுக்கிய காரணங்கள்:\n${match.reasons.slice(0, 3).map(r => `• ${r}`).join('\n')}`;
        suggestedActions.push({ label: 'திருப்பிச் செலுத்தும் திறன்', action: 'affordability' });
        suggestedActions.push({ label: 'அருகிலுள்ள வங்கிக் கூட்டாளர்', action: 'partners' });
      } else if (language === 'ml') {
        text = `നിങ്ങളുടെ പ്രൊഫൈൽ അടിസ്ഥാനമാക്കി (${user.projectType || 'സംരംഭകൻ'}, ${user.state}, വാർഷിക വരുമാനം ₹${(user.income || 0).toLocaleString('en-IN')}), **${activeScheme.name}** പദ്ധതി **${match.totalScore}%** പൊരുത്തത്തോടെ ഏറ്റവും അനുയോജ്യമായതാണ്.\n\nപ്രധാന കാരണങ്ങൾ:\n${match.reasons.slice(0, 3).map(r => `• ${r}`).join('\n')}`;
        suggestedActions.push({ label: 'തിരിച്ചടവ് ശേഷി പരിശോധിക്കുക', action: 'affordability' });
        suggestedActions.push({ label: 'ചാനൽ പങ്കാളിയെ കാണുക', action: 'partners' });
      } else {
        text = `Based on your profile as a ${user.projectType || 'entrepreneur'} in ${user.state} (annual income ₹${(user.income || 0).toLocaleString('en-IN')}), **${activeScheme.name}** is currently your highest match at **${match.totalScore}%**.\n\nKey reasons:\n${match.reasons.slice(0, 3).map(r => `• ${r}`).join('\n')}`;
        suggestedActions.push({ label: 'Check Affordability', action: 'affordability' });
        suggestedActions.push({ label: 'Find Nearest Partner', action: 'partners' });
      }
    } else {
      if (language === 'hi') {
        text = `सर्वोत्तम योजना खोजने के लिए **मेरी योजना खोजें** पृष्ठ पर जाएं या मुझे अपना व्यवसाय, आय और ऋण आवश्यकता बताएं!`;
        suggestedActions.push({ label: 'मेरी योजना खोजें', action: 'find_scheme' });
      } else if (language === 'ta') {
        text = `சிறந்த திட்டத்தைக் கண்டறிய **எனக்கான திட்டத்தைக் கண்டறி** பக்கத்திற்குச் செல்லுங்கள் அல்லது உங்கள் திட்ட விவரங்களைக் கூறுங்கள்!`;
        suggestedActions.push({ label: 'திட்டத்தைக் கண்டறி', action: 'find_scheme' });
      } else if (language === 'ml') {
        text = `ഏറ്റവും അനുയോജ്യമായ പദ്ധതി കണ്ടെത്താൻ **എന്റെ പദ്ധതി കണ്ടെത്തുക** എന്ന പേജിലേക്ക് പോകുക അല്ലെങ്കിൽ നിങ്ങളുടെ വിവരങ്ങൾ പറയുക!`;
        suggestedActions.push({ label: 'പദ്ധതി കണ്ടെത്തുക', action: 'find_scheme' });
      } else {
        text = `To find the best scheme for you, go to **Find My Scheme** or tell me what enterprise goal you want to pursue, your income, and how much funding you need!`;
        suggestedActions.push({ label: 'Open Find My Scheme', action: 'find_scheme' });
      }
    }
  } else if (isWhy && activeScheme) {
    const match = calculateSchemeMatch(user, activeScheme);
    if (language === 'hi') {
      text = `**${activeScheme.name}** का चयन **${match.totalScore}/100** के पारदर्शी स्कोर के आधार पर हुआ:\n\n` +
        `• **आय अनुकूलता**: ${match.incomeScore}/25\n` +
        `• **ऋण अनुकूलता**: ${match.loanScore}/25\n` +
        `• **परियोजना संरेखण**: ${match.categoryScore}/20\n` +
        `• **स्थान एवं पार्टनर उपलब्धता**: ${match.locationScore}/15\n` +
        `• **पात्रता प्रोफ़ाइल**: ${match.profileScore}/15\n\n` +
        (match.improvementTips.length > 0 ? `💡 *सुझाव*: ${match.improvementTips[0]}` : `आप इस कार्यक्रम के लिए पूरी तरह योग्य हैं।`);
      suggestedActions.push({ label: 'योजना तुलना', action: 'compare' });
    } else if (language === 'ta') {
      text = `**${activeScheme.name}** திட்டம் **${match.totalScore}/100** வெளிப்படையான மதிப்பெண்ணுடன் தேர்ந்தெடுக்கப்பட்டது:\n\n` +
        `• **வருமானப் பொருத்தம்**: ${match.incomeScore}/25\n` +
        `• **கடன் அளவுப் பொருத்தம்**: ${match.loanScore}/25\n` +
        `• **தொழில் வகை**: ${match.categoryScore}/20\n` +
        `• **இருப்பிடம் மற்றும் வங்கிகள்**: ${match.locationScore}/15\n` +
        `• **தகுதிச் சான்றுகள்**: ${match.profileScore}/15`;
      suggestedActions.push({ label: 'திட்டங்களை ஒப்பிட', action: 'compare' });
    } else if (language === 'ml') {
      text = `**${activeScheme.name}** പദ്ധതി **${match.totalScore}/100** സ്കോറോടെ ശുപാർശ ചെയ്തു:\n\n` +
        `• **വരുമാന അനുയോജ്യത**: ${match.incomeScore}/25\n` +
        `• **വായ്പാ തുക പൊരുത്തം**: ${match.loanScore}/25\n` +
        `• **പദ്ധതി വിഭാഗം**: ${match.categoryScore}/20\n` +
        `• **ലൊക്കേഷനും പങ്കാളികളും**: ${match.locationScore}/15\n` +
        `• **പ്രൊഫൈൽ യോഗ്യത**: ${match.profileScore}/15`;
      suggestedActions.push({ label: 'താരതമ്യം ചെയ്യുക', action: 'compare' });
    } else {
      text = `**${activeScheme.name}** was matched with an explainable score of **${match.totalScore}/100**:\n\n` +
        `• **Income Compatibility**: ${match.incomeScore}/25\n` +
        `• **Loan Compatibility**: ${match.loanScore}/25\n` +
        `• **Project Alignment**: ${match.categoryScore}/20\n` +
        `• **Location & Partner Access**: ${match.locationScore}/15\n` +
        `• **Profile Eligibility**: ${match.profileScore}/15\n\n` +
        (match.improvementTips.length > 0 ? `💡 *Tip to improve score*: ${match.improvementTips[0]}` : `You have top-tier qualification for this program.`);
      suggestedActions.push({ label: 'View Comparison', action: 'compare' });
    }
  } else if (isAfford) {
    const testLoan = user.loanRequirement || 120000;
    const aff = calculateAffordability({
      loanAmount: testLoan,
      interestRate: activeScheme ? activeScheme.interestRate : 4.5,
      tenureMonths: activeScheme ? activeScheme.tenureMonths : 36,
      annualHouseholdIncome: user.income,
      monthlyExpenses: user.monthlyExpenses,
      existingEMI: user.existingEMI,
      expectedMonthlyBusinessIncome: user.expectedBusinessIncome
    });

    if (language === 'hi') {
      text = `₹${testLoan.toLocaleString('en-IN')} के ऋण के लिए आपकी अनुमानित मासिक किस्त (EMI) **₹${aff.monthlyEmi.toLocaleString('en-IN')}** है।\n\n` +
        `• **स्थिति**: ${aff.headline}\n` +
        `• **ऋण-से-आय अनुपात**: ${aff.emiToIncomeRatio}%\n` +
        `• **मासिक शुद्ध अधिशेष**: ₹${aff.monthlyDisposableSurplus.toLocaleString('en-IN')}\n\n` +
        `${aff.explanation}`;
      suggestedActions.push({ label: 'किस्त कैलकुलेटर खोलें', action: 'affordability' });
    } else if (language === 'ta') {
      text = `₹${testLoan.toLocaleString('en-IN')} கடனுக்கான உத்தேச மாதாந்திர தவணை (EMI) **₹${aff.monthlyEmi.toLocaleString('en-IN')}** ஆகும்.\n\n` +
        `• **நிலை**: ${aff.headline}\n` +
        `• **வருமான விகிதத்தில் தவணை**: ${aff.emiToIncomeRatio}%\n` +
        `• **மாதாந்திர மீதத் தொகை**: ₹${aff.monthlyDisposableSurplus.toLocaleString('en-IN')}\n\n` +
        `${aff.explanation}`;
      suggestedActions.push({ label: 'தவணை கால்குலேட்டர்', action: 'affordability' });
    } else if (language === 'ml') {
      text = `₹${testLoan.toLocaleString('en-IN')} വായ്പയ്ക്ക് നിങ്ങളുടെ പ്രതീക്ഷിക്കുന്ന പ്രതിമാസ ഇ.എം.ഐ **₹${aff.monthlyEmi.toLocaleString('en-IN')}** ആണ്.\n\n` +
        `• **നില**: ${aff.headline}\n` +
        `• **ഇഎംഐ-വരുമാന അനുപാതം**: ${aff.emiToIncomeRatio}%\n` +
        `• **പ്രതിമാസ ബാക്കി തുക**: ₹${aff.monthlyDisposableSurplus.toLocaleString('en-IN')}\n\n` +
        `${aff.explanation}`;
      suggestedActions.push({ label: 'തിരിച്ചടവ് സിമുലേറ്റർ', action: 'affordability' });
    } else {
      text = `For a loan of ₹${testLoan.toLocaleString('en-IN')}, your estimated monthly EMI is **₹${aff.monthlyEmi.toLocaleString('en-IN')}**.\n\n` +
        `• **Status**: ${aff.headline}\n` +
        `• **Debt-to-Income**: ${aff.emiToIncomeRatio}%\n` +
        `• **Projected Net Monthly Surplus**: ₹${aff.monthlyDisposableSurplus.toLocaleString('en-IN')}\n\n` +
        `${aff.explanation}`;
      suggestedActions.push({ label: 'Adjust EMI Sliders', action: 'affordability' });
    }
  } else if (isDocument) {
    const docs = activeScheme ? activeScheme.requiredDocuments : ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Machinery Quotation'];
    if (language === 'hi') {
      text = `सरकारी रियायती ऋण के लिए आवश्यक मुख्य दस्तावेज़ हैं:\n\n` +
        docs.map(d => `✓ **${d}**`).join('\n') +
        `\n\nआप **दस्तावेज़ तैयारी** पृष्ठ पर जाकर डिजिटल जांच कर सकते हैं।`;
      suggestedActions.push({ label: 'दस्तावेज़ जांचें', action: 'documents' });
    } else if (language === 'ta') {
      text = `அரசு மானியக் கடன்களுக்குத் தேவையான முக்கிய ஆவணங்கள்:\n\n` +
        docs.map(d => `✓ **${d}**`).join('\n') +
        `\n\n**ஆவண தயார்நிலை** பக்கத்தில் இவற்றைச் சரிபார்க்கலாம்.`;
      suggestedActions.push({ label: 'ஆவணங்களை சரிபார்க்க', action: 'documents' });
    } else if (language === 'ml') {
      text = `സർക്കാർ വായ്പാ പദ്ധതികൾക്ക് ആവശ്യമായ പ്രധാന രേഖകൾ:\n\n` +
        docs.map(d => `✓ **${d}**`).join('\n') +
        `\n\n**അപേക്ഷാ സന്നദ്ധത** പേജിൽ രേഖകൾ പരിശോധിക്കാം.`;
      suggestedActions.push({ label: 'രേഖകൾ പരിശോധിക്കുക', action: 'documents' });
    } else {
      text = `For ${activeScheme ? activeScheme.name : 'government concessional credit'}, the standard mandatory documents are:\n\n` +
        docs.map(d => `✓ **${d}**`).join('\n') +
        `\n\nYou can upload these in our **Document Readiness** section to verify digital readiness before submitting.`;
      suggestedActions.push({ label: 'Check Document Readiness', action: 'documents' });
    }
  } else if (isEmi) {
    if (language === 'hi') {
      text = `**EMI (मासिक किस्त)** वह निश्चित राशि है जो आप हर महीने बैंक को चुकाते हैं।\n\nइसमें दो घटक होते हैं:\n1. **मूलधन (Principal)**: ली गई ऋण राशि की वापसी।\n2. **ब्याज (Interest)**: बैंक का रियायती सेवा शुल्क।\n\nसरकारी योजनाओं में ब्याज **घटते हुए शेष (Reducing Balance)** पर लगता है!`;
      suggestedActions.push({ label: 'वित्तीय साक्षरता केंद्र', action: 'literacy' });
    } else if (language === 'ta') {
      text = `**EMI (மாதாந்திர தவணை)** என்பது நீங்கள் வங்கிக்கு செலுத்தும் நிலையான தொகையாகும்.\n\nஇதில் இரு கூறுகள் உள்ளன:\n1. **அசல் (Principal)**: நீங்கள் வாங்கிய தொகை.\n2. **வட்டி (Interest)**: வங்கியின் குறைந்தபட்ச கட்டணம்.\n\nஅரசு திட்டங்களில் குறைந்து வரும் அசலின் மீது மட்டுமே வட்டி கணக்கிடப்படும்!`;
      suggestedActions.push({ label: 'நிதி கல்வி மையம்', action: 'literacy' });
    } else if (language === 'ml') {
      text = `**ഇ.എം.ഐ (EMI)** എന്നാൽ എല്ലാ മാസവും ബാങ്കിൽ അടയ്ക്കേണ്ട നിശ്ചിത തുകയാണ്.\n\nഇതിൽ രണ്ടു ഭാഗങ്ങളുണ്ട്:\n1. **മുതൽ (Principal)**: വാങ്ങിയ വായ്പാ തുക.\n2. **പലിശ (Interest)**: ബാങ്ക് ഈടാക്കുന്ന ഇളവുകളോടെയുള്ള നിരക്ക്.\n\nസർക്കാർ പദ്ധതികളിൽ കുറയുന്ന തുകയ്ക്കാണ് പലിശ കണക്കാക്കുന്നത്!`;
      suggestedActions.push({ label: 'സാമ്പത്തിക സാക്ഷരത', action: 'literacy' });
    } else {
      text = `**EMI (Equated Monthly Installment)** is the fixed payment you make to the bank each month.\n\nIt consists of two parts:\n1. **Principal**: repaying the original amount you borrowed.\n2. **Interest**: the bank's concessional service fee.\n\nIn government schemes, interest is calculated on a **reducing balance**, meaning your interest goes down every time you make a payment!`;
      suggestedActions.push({ label: 'Financial Literacy Center', action: 'literacy' });
    }
  } else if (isMoratorium) {
    const months = activeScheme ? activeScheme.moratoriumMonths : 6;
    if (language === 'hi') {
      text = `**मोरेटोरियम (छूट अवधि)** ऋण मिलने के बाद प्रारंभिक छूट का समय है (इस योजना में लगभग **${months} महीने**)।\n\nइस दौरान आपको किस्त नहीं देनी होती ताकि आप मशीनरी खरीदकर व्यवसाय शुरू कर सकें।`;
    } else if (language === 'ta') {
      text = `**மோரட்டோரியம் (சலுகைக் காலம்)** என்பது தொழில் தொடங்கும் ஆரம்ப காலத்தில் தவணை செலுத்த தேவையில்லாத கால அவகாசமாகும் (சுமார் **${months} மாதங்கள்**).`;
    } else if (language === 'ml') {
      text = `**മൊറട്ടോറിയം** എന്നാൽ തുടക്കത്തിൽ തിരിച്ചടവിൽ ലഭിക്കുന്ന ഇളവ് കാലയളവാണ് (ഈ പദ്ധതിയിൽ **${months} മാസം**). ഈ സമയത്ത് ഇഎംഐ അടയ്ക്കേണ്ടതില്ല.`;
    } else {
      text = `A **Moratorium** is a repayment holiday during the initial setup period (typically **${months} months** for this scheme).\n\nDuring this time, you do NOT have to pay EMIs. It gives you time to buy equipment, begin operations, and generate regular income before your first installment is due!`;
    }
  } else if (isPartner) {
    if (language === 'hi') {
      text = `सहायक AI आपको 5 कारकों (दूरी, गति, क्षमता, विशेषज्ञता और बैकलॉग) के आधार पर निकटतम अधिकृत चैनल पार्टनर से जोड़ता है।\n\nमैप पर देखने के लिए **पार्टनर खोजें** पर जाएं।`;
      suggestedActions.push({ label: 'पार्टनर खोजें', action: 'partners' });
    } else if (language === 'ta') {
      text = `சஹாயக் AI உங்கள் இருப்பிடத்திற்கு அருகிலுள்ள சிறந்த வங்கி அல்லது நிதி கூட்டாளரை கண்டறிய உதவுகிறது.\n\nவரைபடத்தில் காண **கூட்டாளரைக் கண்டறி** பக்கத்திற்குச் செல்லவும்.`;
      suggestedActions.push({ label: 'வங்கி கூட்டாளரைக் கண்டறி', action: 'partners' });
    } else if (language === 'ml') {
      text = `ഏറ്റവും അടുത്തുള്ള അംഗീകൃത ബാങ്ക് അല്ലെങ്കിൽ ചാനൽ പങ്കാളിയെ കണ്ടെത്താൻ സഹായക് AI സഹായിക്കുന്നു.\n\nമാപ്പിൽ കാണാൻ **ചാനൽ പങ്കാളിയെ കാണുക** ക്ലിക്ക് ചെയ്യുക.`;
      suggestedActions.push({ label: 'പങ്കാളിയെ കണ്ടെത്തുക', action: 'partners' });
    } else {
      text = `You do not need to visit random bank branches! Sahayak AI evaluates **channel partner suitability** based on 5 factors: scheme support, distance, current backlog load, capacity, and average processing speed.\n\nCheck **Find My Partner** to see your top-ranked nearby branch on an interactive map.`;
      suggestedActions.push({ label: 'Find Channel Partner', action: 'partners' });
    }
  } else {
    // Default greeting
    if (language === 'hi') {
      text = `नमस्ते ${user.name.split(' ')[0]}! मैं **सहायक** हूँ, आपका एआई वित्तीय मार्गदर्शक। मैं सरकारी ऋण योजनाओं, किस्त की वहन क्षमता और नजदीकी बैंकों के बारे में आपकी सहायता कर सकता हूँ।`;
      suggestedActions.push({ label: 'मेरे लिए सर्वश्रेष्ठ योजना कौन सी है?', action: 'best_scheme' });
      suggestedActions.push({ label: 'क्या मैं यह किस्त वहन कर सकता हूँ?', action: 'affordability' });
      suggestedActions.push({ label: 'कौन से दस्तावेज़ चाहिए?', action: 'documents' });
    } else if (language === 'ta') {
      text = `வணக்கம் ${user.name.split(' ')[0]}! நான் **சஹாயக்**, உங்கள் AI நிதி வழிகாட்டி. அரசு மானியக் கடன்கள், தவணை கணக்கீடு மற்றும் அங்கீகரிக்கப்பட்ட வங்கிகள் குறித்து என்னிடம் கேட்கலாம்.`;
      suggestedActions.push({ label: 'எனக்கான சிறந்த திட்டம் எது?', action: 'best_scheme' });
      suggestedActions.push({ label: 'இதை திருப்பிச் செலுத்த முடியுமா?', action: 'affordability' });
      suggestedActions.push({ label: 'என்ன ஆவணங்கள் தேவை?', action: 'documents' });
    } else if (language === 'ml') {
      text = `നമസ്കാരം ${user.name.split(' ')[0]}! ഞാൻ **സഹായക്**, നിങ്ങളുടെ AI സാമ്പത്തിക സഹായി. സർക്കാർ വായ്പകൾ, ഇ.എം.ഐ, ബാങ്കുകൾ എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് ചോദിക്കാം.`;
      suggestedActions.push({ label: 'എനിക്ക് ഏറ്റവും അനുയോജ്യമായ പദ്ധതി ഏതാണ്?', action: 'best_scheme' });
      suggestedActions.push({ label: 'എനിക്ക് ഇത് താങ്ങാനാകുമോ?', action: 'affordability' });
      suggestedActions.push({ label: 'എന്തൊക്കെ രേഖകൾ വേണം?', action: 'documents' });
    } else {
      text = `Hello ${user.name.split(' ')[0]}! I am **Sahayak**, your AI financial inclusion guide. I can help you find suitable concessional schemes, explain your match score, simulate whether an EMI fits your budget, or locate the fastest nearby channel partner.\n\nWhat would you like to explore?`;
      suggestedActions.push({ label: 'Which scheme is best for me?', action: 'best_scheme' });
      suggestedActions.push({ label: 'Can I afford this loan?', action: 'affordability' });
      suggestedActions.push({ label: 'What documents do I need?', action: 'documents' });
    }
  }

  return {
    id: `MSG-${Date.now()}`,
    sender: 'sahayak',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions
  };
}
