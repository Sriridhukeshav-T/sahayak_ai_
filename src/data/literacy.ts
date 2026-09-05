import { QuizQuestion } from '../types/common';

export interface LiteracyArticle {
  id: string;
  title: string;
  category: 'Borrowing Basics' | 'Interest & EMI' | 'Business Planning' | 'Government Schemes';
  readTime: string;
  summary: string;
  keyTakeaway: string;
  content: string[];
  iconName: string;
}

export const LITERACY_ARTICLES: LiteracyArticle[] = [
  {
    id: 'art-01',
    title: 'What is an EMI & How is it Calculated?',
    category: 'Interest & EMI',
    readTime: '3 min read',
    summary: 'Equated Monthly Installment (EMI) consists of both principal repayment and interest. Understand reducing-balance calculations.',
    keyTakeaway: 'Always verify if your loan uses "reducing balance" or "flat rate". Government concessional loans always use reducing balance, which costs you far less.',
    iconName: 'Calculator',
    content: [
      'An Equated Monthly Installment (EMI) is a fixed monthly payment made by a borrower to a lender on a specified date each month.',
      'Each EMI comprises two components: Principal (the money you actually borrowed) and Interest (the cost charged by the lender for using the money).',
      'In the early months of the loan, a larger portion of your EMI goes toward paying interest. Over time, as your outstanding loan reduces, a larger portion goes toward paying off the principal.',
      'In reducing-balance loans, interest is charged only on the remaining balance, not on the original loan amount. This saves significant money compared to informal moneylenders.'
    ]
  },
  {
    id: 'art-02',
    title: 'Understanding Moratorium: Grace Period for Entrepreneurs',
    category: 'Borrowing Basics',
    readTime: '4 min read',
    summary: 'A moratorium allows your business to generate revenue before you begin repaying your loan.',
    keyTakeaway: 'A moratorium is NOT a loan waiver; interest may accrue, but you get essential breathing room during setup.',
    iconName: 'Clock',
    content: [
      'A moratorium period (often called a repayment holiday or grace period) is a specific duration during which the borrower is not required to make EMI payments.',
      'For entrepreneurs, this period is vital: you can buy machines, set up premises, hire staff, and make initial sales before loan repayments start.',
      'For student education loans, the moratorium usually covers the entire course duration plus 6 months to 1 year after graduation.',
      'Important note: In some schemes, interest may accrue during the moratorium, whereas in heavily subsidized government schemes for marginalized categories, 100% of the moratorium interest is subventioned by the state.'
    ]
  },
  {
    id: 'art-03',
    title: 'What is Collateral & Why Do Concessional Loans Waive It?',
    category: 'Government Schemes',
    readTime: '4 min read',
    summary: 'Learn how Credit Guarantee Funds enable marginalized entrepreneurs to secure institutional loans without pledging land or gold.',
    keyTakeaway: 'Institutional schemes like Mudra and State Corporation loans are collateral-free up to prescribed statutory limits.',
    iconName: 'ShieldCheck',
    content: [
      'Collateral refers to an asset (such as house deeds, agricultural land, or gold) that a borrower pledges to a bank to secure a loan.',
      'Historically, marginalized citizens could not access formal banking credit because they lacked registered land or high-value physical assets.',
      'Government concessional credit schemes solve this through Credit Guarantee Funds (such as CGTMSE). The government stands as guarantor for the entrepreneur.',
      'Because of these guarantees, authorized channel partners cannot legally demand collateral for micro loans up to ₹10 Lakh.'
    ]
  },
  {
    id: 'art-04',
    title: 'How Much Should You Borrow? The 30% Safety Rule',
    category: 'Business Planning',
    readTime: '5 min read',
    summary: 'Avoid over-borrowing and protect your family from debt stress with the Debt-to-Income safety ratio.',
    keyTakeaway: 'Ensure your total monthly loan installments never exceed 30% to 40% of your net household income plus reliable business surplus.',
    iconName: 'TrendingUp',
    content: [
      'A common pitfall for first-time business owners is taking more loan than their immediate business cashflow can service.',
      'Remember that unexpected costs always arise: seasonal dips in sales, machinery repair, or family emergencies.',
      'The Debt-to-Income (DTI) ratio compares your total monthly debt payments against your monthly gross income.',
      'Rule of Thumb: If your projected EMI is less than 25% of your surplus, you are in the Comfort Zone. Between 25% and 40%, it is Manageable. If it exceeds 40%, you are in High Risk territory.'
    ]
  },
  {
    id: 'art-05',
    title: 'Credit Score & Institutional Trust: Your Passport to Low Interest',
    category: 'Borrowing Basics',
    readTime: '3 min read',
    summary: 'Why paying even a ₹500 loan on time transforms your ability to scale up in the future.',
    keyTakeaway: 'A clean repayment record on a ₹50,000 micro-loan qualifies you for ₹5 Lakh in your second cycle.',
    iconName: 'Award',
    content: [
      'Credit bureaus (such as CIBIL, Experian, Equifax, CRIF High Mark) maintain a digital history of every institutional loan you take.',
      'Paying your EMIs on or before the due date builds a strong credit score (700+ is considered good).',
      'A high credit score ensures faster loan sanctions, lower interest rates, and higher sanction limits in future expansion cycles.',
      'Never borrow from unverified mobile apps that charge predatory interest rates and damage your institutional credit history.'
    ]
  }
];

export const FINANCIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the primary difference between a reducing-balance loan and a flat-rate loan?',
    options: [
      { text: 'In reducing-balance, interest is calculated only on remaining unpaid principal, saving you money.', correct: true, explanation: 'Correct! Reducing-balance interest drops with every installment as your principal decreases.' },
      { text: 'In flat-rate loans, interest reduces each month automatically.', correct: false, explanation: 'Incorrect. Flat-rate loans calculate interest on the entire original amount throughout the tenure, making them much more expensive.' },
      { text: 'There is no difference between them in bank calculations.', correct: false, explanation: 'Incorrect. There is a huge financial difference in total interest paid.' },
      { text: 'Reducing-balance loans can only be taken by large corporations.', correct: false, explanation: 'Incorrect. Concessional government schemes for marginalized citizens use reducing-balance.' }
    ]
  },
  {
    id: 2,
    question: 'What happens during a loan moratorium period?',
    options: [
      { text: 'The entire loan is permanently forgiven and you never have to repay.', correct: false, explanation: 'Incorrect. A moratorium is a grace period, not a loan waiver.' },
      { text: 'You are excused from paying EMIs so your business can get established and generate revenue.', correct: true, explanation: 'Spot on! It gives you operational breathing space to set up equipment and build cash flow.' },
      { text: 'The bank seizes your machines until you start paying.', correct: false, explanation: 'Incorrect. The bank provides the moratorium specifically to support project setup.' },
      { text: 'Your interest rate doubles automatically.', correct: false, explanation: 'Incorrect. The interest rate remains as agreed in the scheme sanction.' }
    ]
  },
  {
    id: 3,
    question: 'What is the recommended safe limit for your total monthly loan EMIs relative to your monthly income?',
    options: [
      { text: 'Up to 90% of your income', correct: false, explanation: 'Incorrect. 90% would leave almost nothing for food, family expenses, or emergencies.' },
      { text: 'Under 35% - 40% of your net monthly income', correct: true, explanation: 'Correct! Keeping EMIs below 35-40% ensures you have a comfortable buffer for business shocks.' },
      { text: 'Exactly 75% of your income', correct: false, explanation: 'Incorrect. 75% is considered high-risk debt distress.' },
      { text: 'It does not matter as long as the bank approves the loan', correct: false, explanation: 'Incorrect. Responsible borrowing requires ensuring personal cashflow safety.' }
    ]
  },
  {
    id: 4,
    question: 'Under government micro-credit schemes like Mudra and State SC/ST/OBC Corporations, can a bank demand collateral for micro loans up to ₹10 Lakh?',
    options: [
      { text: 'No, these institutional loans are covered under Credit Guarantee mechanisms and are collateral-free.', correct: true, explanation: 'Correct! Statutory guidelines mandate that no collateral security shall be taken for loans up to ₹10 Lakh under credit guarantee.' },
      { text: 'Yes, you must always submit gold or house deeds.', correct: false, explanation: 'Incorrect. That is false for concessional government micro schemes.' },
      { text: 'Yes, collateral is mandatory for all Indian citizens without exception.', correct: false, explanation: 'Incorrect. Priority sector and micro-credit guidelines protect borrowers.' },
      { text: 'Only if the applicant is from an urban city.', correct: false, explanation: 'Incorrect. Rural and urban micro entrepreneurs are both protected.' }
    ]
  },
  {
    id: 5,
    question: 'Why should you keep your business bank transactions in your bank account rather than dealing only in cash?',
    options: [
      { text: 'It creates a verifiable digital banking track record that qualifies you for larger expansion loans.', correct: true, explanation: 'Correct! Documented turnover is the #1 proof channel partners use to approve higher credit limits.' },
      { text: 'The bank takes 50% of any cash deposited.', correct: false, explanation: 'Incorrect. Bank deposits belong entirely to the account holder.' },
      { text: 'Cash transactions are illegal for all small businesses.', correct: false, explanation: 'Incorrect. Cash is legal, but banking transactions build your creditworthiness.' },
      { text: 'It makes no difference to credit assessment.', correct: false, explanation: 'Incorrect. Cashflow visibility is fundamental to credit appraisals.' }
    ]
  },
  {
    id: 6,
    question: 'What is "Margin Money" or "Own Contribution" in a project loan?',
    options: [
      { text: 'A bribe paid to bank agents', correct: false, explanation: 'Incorrect. Never pay bribes; official schemes have zero facilitation fees.' },
      { text: 'The percentage of the total project cost that the entrepreneur pays from their own savings or subsidy.', correct: true, explanation: 'Correct! For example, in a ₹1,00,000 project, ₹10,000 might be own contribution and ₹90,000 is financed.' },
      { text: 'The penalty charged when an EMI is delayed', correct: false, explanation: 'Incorrect. That is called penal interest or late fee.' },
      { text: 'The profit earned after one year of business', correct: false, explanation: 'Incorrect. Margin money is upfront project equity.' }
    ]
  },
  {
    id: 7,
    question: 'If your nearest channel partner branch currently has a 95% backlog and high processing delay, what should an intelligent routing system do?',
    options: [
      { text: 'Keep your application stuck in the queue for months', correct: false, explanation: 'Incorrect. That leads to delayed livelihoods and frustration.' },
      { text: 'Route your application to the next-best partner with verified capacity, supported scheme match, and fast processing.', correct: true, explanation: 'Correct! This is dynamic channel partner routing, a core innovation of Sahayak AI.' },
      { text: 'Cancel your scheme eligibility immediately', correct: false, explanation: 'Incorrect. The applicant remains eligible; only the partner routing changes.' },
      { text: 'Ask you to pay double interest to jump the queue', correct: false, explanation: 'Incorrect. Interest rates are regulated by government policy.' }
    ]
  },
  {
    id: 8,
    question: 'What is the purpose of Udyam Registration for micro and small enterprises?',
    options: [
      { text: 'It is a free government digital registration that unlocks priority lending, subsidies, and tender protections.', correct: true, explanation: 'Correct! Udyam registration gives legal MSME status and guarantees access to concessional lending.' },
      { text: 'It is a high-cost tax audit required only for multinational companies.', correct: false, explanation: 'Incorrect. Udyam is completely free, paperless, and meant for micro businesses.' },
      { text: 'It prevents you from applying for bank loans.', correct: false, explanation: 'Incorrect. It actively accelerates bank loan approvals.' },
      { text: 'It is only for software businesses.', correct: false, explanation: 'Incorrect. Any manufacturing or service trade qualifies.' }
    ]
  }
];
