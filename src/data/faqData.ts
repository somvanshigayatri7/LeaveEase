export interface FAQItem {
  id: string;
  category: 'types' | 'eligibility' | 'deadlines' | 'workflow' | 'documentation' | 'sandwich';
  categoryLabel: string;
  question: string;
  answer: string;
  keyPoints: string[];
  docRequired?: string;
  proTip: string;
  relatedLeaveType?: string;
}

export const COMPREHENSIVE_FAQS: FAQItem[] = [
  // 1. TYPES OF LEAVE
  {
    id: 'faq-types-1',
    category: 'types',
    categoryLabel: 'Types of Leave',
    question: 'What is the fundamental difference between Annual Vacation, Casual, and Sick Leave?',
    answer: `Annual Vacation Leave is meant for extended rest, travel, and personal recreation, usually planned weeks in advance. Casual Leave is designed for short, unexpected personal obligations or administrative errands (1-2 days). Sick Leave is strictly allocated for recovery from bodily illness, injuries, medical procedures, or mental health rest.`,
    keyPoints: [
      'Annual Leave: Planned rest (1-3 weeks), requires advance notice.',
      'Casual Leave: Short unexpected personal tasks (1-2 days).',
      'Sick Leave: Illness, surgeries, doctor visits, or mental health recuperation.',
    ],
    proTip: 'Never use Sick Leave for scheduled vacation travel; HR tracking systems audit adjacent weekend patterns.',
    relatedLeaveType: 'Annual Vacation',
  },
  {
    id: 'faq-types-2',
    category: 'types',
    categoryLabel: 'Types of Leave',
    question: 'Can I take Sick Leave for Mental Health or Burnout without physical symptoms?',
    answer: `Yes. Under modern labor standards and company health policies, mental well-being is recognized as a legitimate medical category. You can take sick leave for acute anxiety, burnout, or emotional distress. You are not legally required to detail private emotional triggers to your line manager; stating "taking a medical well-being recovery day" is standard and sufficient.`,
    keyPoints: [
      'Mental health days fall under sick or personal wellness quotas.',
      'You are not required to disclose sensitive diagnostic details to your manager.',
      'If absent past 3 consecutive days, a note from a licensed therapist or physician may be requested.',
    ],
    proTip: 'Use our "Mental Health Day" template in the Drafter to notify your team with utmost professionalism and boundary respect.',
    relatedLeaveType: 'Mental Health Day',
  },
  {
    id: 'faq-types-3',
    category: 'types',
    categoryLabel: 'Types of Leave',
    question: 'How does Bereavement / Compassionate Leave work and who is considered immediate family?',
    answer: `Bereavement leave provides paid time off (typically 3 to 5 business days) following the death of a family member. Most company policies define "immediate family" as spouses/partners, parents, siblings, children, grandparents, grandchildren, and legal guardians. For extended relatives or close mentors, managers frequently authorize casual days or unpaid leave.`,
    keyPoints: [
      'Standard quota: 3-5 paid days for immediate family members.',
      'Can be extended with accrued annual or casual leave if travel is required.',
      'Notice can be sent immediately by phone or a quick message.',
    ],
    proTip: 'Do not worry about administrative perfection during family grief; notify your team lead briefly and let HR handle paperwork upon your return.',
    relatedLeaveType: 'Bereavement / Compassionate',
  },
  {
    id: 'faq-types-4',
    category: 'types',
    categoryLabel: 'Types of Leave',
    question: 'How do Compensatory Off (Comp-Off) credits work for weekend or holiday work?',
    answer: `If you are an exempt or eligible salaried employee who worked on an official weekend or company holiday (e.g., weekend production deployment, emergency on-call outage, or corporate conference), you earn a Compensatory Day Off in lieu. Most organizations require logging this overtime in the HR portal and utilizing the compensatory day within 30 to 60 calendar days before it expires.`,
    keyPoints: [
      'Earned 1:1 for authorized weekend or holiday duty.',
      'Requires pre-approval or post-incident verification from your manager.',
      'Usually expires within 30 to 90 days if not redeemed.',
    ],
    proTip: 'Always cite the specific weekend deployment date and release ticket in your leave request email.',
    relatedLeaveType: 'Compensatory Off',
  },

  // 2. ELIGIBILITY & ACCRUAL
  {
    id: 'faq-elig-1',
    category: 'eligibility',
    categoryLabel: 'Eligibility & Accrual',
    question: 'Can I take leave during my 90-day or 6-month probation period?',
    answer: `During probation, discretionary annual vacation leave is generally restricted to ensure proper onboarding and performance evaluation. However, statutory sick leave and sudden medical emergencies are always protected by labor law. Some progressive tech firms allow prorated leave after 30 days. If you had pre-booked travel committed prior to accepting the job offer, disclose it during hiring so it is grandfathered in.`,
    keyPoints: [
      'Elective vacation is usually paused until probation clearance.',
      'Emergency medical and bereavement leave are universally permitted.',
      'Pre-planned commitments should be negotiated during the job offer stage.',
    ],
    proTip: 'If urgent personal leave is unavoidable in probation, propose working additional hours or taking unpaid time off.',
  },
  {
    id: 'faq-elig-2',
    category: 'eligibility',
    categoryLabel: 'Eligibility & Accrual',
    question: 'How does leave accrual work? Do I get all 20 days on January 1st?',
    answer: `Companies generally use either "Front-loaded" or "Pro-rata Accrual" systems. Under pro-rata accrual, you earn approximately 1.66 to 1.75 days per completed calendar month of service. Under front-loading, your total annual quota is credited upfront on Jan 1st, but if you resign mid-year after utilizing the full balance, unearned days are deducted from your final paycheck.`,
    keyPoints: [
      'Pro-rata: Earn ~1.66 days per month (20 days / 12 months).',
      'Front-loaded: Available Jan 1st, reconciled on termination.',
      'Check whether negative leave balances are allowed in your HR handbook.',
    ],
    proTip: 'Use our Days & Balance Calculator tab to track your exact accrued balance vs utilized days.',
  },
  {
    id: 'faq-elig-3',
    category: 'eligibility',
    categoryLabel: 'Eligibility & Accrual',
    question: 'Can unused leave days be carried forward into the new year, or encashed?',
    answer: `This varies by policy and local jurisdiction. In most standard corporate handbooks, employees may carry forward up to 5 to 8 unused annual leave days into the first quarter (Q1) of the next calendar year, after which unused excess days lapse (the "use-it-or-lose-it" rule). Statutory sick days rarely encash, but accumulated earned/annual days are often paid out upon formal separation or resignation.`,
    keyPoints: [
      'Carry-over cap: Typically 5 to 8 business days max.',
      'Lapse deadline: Often expires on March 31st or June 30th of the following year.',
      'Encashment: Regulated by employment contract and state labor statutes.',
    ],
    proTip: 'Check your balance in Q3/Q4 and plan your holidays early to avoid forfeiting hard-earned paid time off.',
  },

  // 3. APPLICATION DEADLINES & NOTICE PERIODS
  {
    id: 'faq-deadlines-1',
    category: 'deadlines',
    categoryLabel: 'Deadlines & Notice Periods',
    question: 'What is the required advance notice for taking leave?',
    answer: `General workplace benchmarks:
1. Short Annual Leave (1-2 days): 48 hours to 1 week advance notice.
2. Long Vacation (3+ days): Minimum 14 calendar days (2 full weeks) advance notice.
3. Extended Vacation (>2 weeks): 30 to 45 days advance notice for sprint and project resourcing.
4. Planned Medical Procedures: 2 to 4 weeks notice once surgical date is booked.
5. Sudden Illness / Fever: Same-day notice as early as possible (before 9:00 AM or 1 hour before shift).`,
    keyPoints: [
      '1-2 days off: 48 hours to 1 week.',
      '3-10 days off: 2 weeks notice.',
      '10+ days off: 4-6 weeks notice.',
      'Sudden sickness: Morning notification before office start.',
    ],
    proTip: 'Giving generous notice dramatically increases manager goodwill and approval likelihood.',
  },
  {
    id: 'faq-deadlines-2',
    category: 'deadlines',
    categoryLabel: 'Deadlines & Notice Periods',
    question: 'What should I do if I wake up sick at 6 AM on a workday?',
    answer: `Send an urgent notification immediately—do not wait until mid-day. Send a brief email to your reporting manager and drop a short ping in your team's communication channel (Slack/Teams). You do not need to write a lengthy letter while unwell; simply state that you are feverish/unwell, will rest and seek medical advice, will update later regarding tomorrow, and name a peer who can handle any urgent morning meetings.`,
    keyPoints: [
      'Notify between 6:00 AM and 9:00 AM before business hours begin.',
      'Keep it concise (1-2 short paragraphs).',
      'Name your peer backup for today’s scheduled meetings.',
    ],
    proTip: 'Use our one-click "Sudden Illness" template to dispatch your notification in under 30 seconds.',
    relatedLeaveType: 'Sick & Medical',
  },

  // 4. APPROVAL WORKFLOWS & ESCALATIONS
  {
    id: 'faq-workflow-1',
    category: 'workflow',
    categoryLabel: 'Approval Workflows',
    question: 'Who approves my leave, and what is the typical approval chain?',
    answer: `For standard requests under 5 days, approval is typically granted solely by your direct reporting manager (Line Manager / Team Lead). For leaves exceeding 10 consecutive business days, sabbaticals, or leaves spanning peak client milestones, the workflow often requires a secondary sign-off from the Department Head / Director and HR Operations to ensure compliance and payroll accuracy.`,
    keyPoints: [
      'Standard (1-5 days): Direct Line Manager approval.',
      'Extended (10+ days): Line Manager + Department Director + HR.',
      'Parental / Sabbatical: HR Benefits Committee + Executive sponsor.',
    ],
    proTip: 'Have an informal verbal chat or 1:1 mention with your manager before submitting a 2-week leave formally in the HR system.',
  },
  {
    id: 'faq-workflow-2',
    category: 'workflow',
    categoryLabel: 'Approval Workflows',
    question: 'What should I do if my manager hasn’t responded to my leave request after several days?',
    answer: `Give it 48 to 72 business hours after initial submission. If your intended leave date is approaching, send a polite follow-up reminder. For example: "Hi [Manager Name], gently following up on my leave request for [Dates]. I want to ensure [Colleague Name] has adequate time for task handover and travel bookings can be finalized. Please let me know if you need any further details." If there is still no reply within 48 hours and the date is imminent, message them directly or check with HR.`,
    keyPoints: [
      'Follow up after 2-3 business days with a courteous nudge.',
      'Highlight impending deadlines like flight bookings or client handover windows.',
      'Escalate to HR only if the date is less than 48 hours away and manager is unreachable.',
    ],
    proTip: 'Always maintain a written paper trail so there is documented record of your timely submission.',
  },
  {
    id: 'faq-workflow-3',
    category: 'workflow',
    categoryLabel: 'Approval Workflows',
    question: 'Can a manager legitimately reject or postpone my leave application?',
    answer: `Yes, managers have operational discretion to decline or request rescheduling of elective annual leave based on legitimate business necessity. Legitimate grounds include: critical product releases or audit deadlines, overlapping leaves by too many team members causing severe understaffing, or failure to provide designated coverage. However, managers CANNOT arbitrarily deny protected statutory medical, bereavement, or parental leave.`,
    keyPoints: [
      'Elective vacation can be declined for genuine operational exigencies.',
      'Medical, parental, and bereavement leave cannot be arbitrarily rejected.',
      'Managers must provide constructive reasoning and offer alternative dates.',
    ],
    proTip: 'Avoid rejection by consulting your team sprint calendar and nominating a willing peer backup before applying.',
  },

  // 5. REQUIRED DOCUMENTATION & MEDICAL NOTES
  {
    id: 'faq-documentation-1',
    category: 'documentation',
    categoryLabel: 'Documentation & Notes',
    question: 'When is a formal Medical Certificate / Doctor’s Note required?',
    answer: `In most standard workplace policies, a certified doctor’s note is mandatory whenever an employee is absent for three (3) or more consecutive business days due to sickness. In high-compliance environments (healthcare, shift operations, or customer call centers), a note may be required for two (2) days or any absence directly preceding or following a public holiday or weekend.`,
    keyPoints: [
      'Standard threshold: 3+ consecutive business days.',
      'Healthcare / shift sectors: 2 consecutive shifts.',
      'Sandwich periods: Frequently requested if absent adjacent to long weekends.',
    ],
    proTip: 'Ask your doctor for a simple note stating "under medical care and unfit for work from Date A to Date B". You are not required to disclose your intimate diagnosis.',
    docRequired: 'Medical certificate issued by licensed medical practitioner',
  },
  {
    id: 'faq-documentation-2',
    category: 'documentation',
    categoryLabel: 'Documentation & Notes',
    question: 'What specific details must appear on a valid medical certificate?',
    answer: `A valid certificate should include:
1. Licensed practitioner’s full name, clinic letterhead, medical license/registration number, and contact info.
2. Date of examination.
3. Explicit statement of medical unfitness: "The employee is unfit for work from [Start Date] through [End Date]".
4. Expected return-to-work date.
5. Doctor’s official stamp and signature.
Note: To safeguard patient confidentiality (HIPAA / GDPR), the doctor does NOT need to disclose your specific medical condition or diagnosis unless required for specialized disability benefits.`,
    keyPoints: [
      'Must contain clinic letterhead, doctor registration number, and signature.',
      'Must state exact start and end dates of unfitness.',
      'Specific medical diagnosis is NOT required for basic sick leave.',
    ],
    proTip: 'Take a clear smartphone photo or PDF scan and upload directly to your HR portal or email to your HR partner.',
  },
  {
    id: 'faq-documentation-3',
    category: 'documentation',
    categoryLabel: 'Documentation & Notes',
    question: 'What is a "Fit-to-Work" certificate and when is it required?',
    answer: `A "Fit-to-Work" or "Medical Clearance" certificate is issued by a healthcare provider declaring that an employee has recovered sufficiently and can safely resume their normal workplace duties without posing a health hazard to themselves or colleagues. It is typically required following hospitalizations, major surgeries, infectious illnesses (such as COVID-19 or tuberculosis), or absences exceeding two consecutive weeks.`,
    keyPoints: [
      'Required after prolonged medical absence (>2 weeks), surgery, or communicable illness.',
      'Protects workplace safety and employer liability.',
      'May specify temporary light-duty accommodations (e.g. no heavy lifting, remote work for 1 week).',
    ],
    proTip: 'If you need transitional light-duty or remote accommodations upon return, ask your physician to explicitly state it on the clearance note.',
  },

  // 6. SANDWICH RULES & PUBLIC HOLIDAYS
  {
    id: 'faq-sandwich-1',
    category: 'sandwich',
    categoryLabel: 'Sandwich Rules & Weekends',
    question: 'What is the "Sandwich Leave Rule" and does taking Friday and Monday cost 4 days?',
    answer: `The "Sandwich Rule" is a policy clause present in some traditional corporate, manufacturing, and institutional organizations where, if an employee takes approved leave on the working day immediately before a weekend/holiday (e.g., Friday) AND the working day immediately following it (e.g., Monday), the intervening weekend days (Saturday and Sunday) are also counted and deducted as leave days, turning 2 business days into 4 deducted leave days! 
However, modern tech firms and progressive companies have largely abolished this practice, deducting only the actual working days missed.`,
    keyPoints: [
      'Traditional Rule: Friday + Monday off = 4 leave days deducted.',
      'Modern Tech Rule: Friday + Monday off = Only 2 business days deducted.',
      'Check your active policy matrix in our app to see if your company enforces sandwich rules.',
    ],
    proTip: 'To bypass a sandwich rule, take either Friday OR Monday, but not both in the same request, or consult your HR guidelines.',
  },
  {
    id: 'faq-sandwich-2',
    category: 'sandwich',
    categoryLabel: 'Sandwich Rules & Weekends',
    question: 'If an official Public Holiday falls in the middle of my 2-week vacation, is it deducted?',
    answer: `No. In almost all standard employment policies, official statutory public holidays (such as Christmas Day, New Year’s Day, Memorial Day, Thanksgiving) that fall on a normal Monday-Friday business day are NOT deducted from your annual vacation quota. For example, if you take a 5-day week off that includes a Wednesday Thanksgiving holiday, only 4 days of annual leave will be consumed.`,
    keyPoints: [
      'Official public holidays are paid days and do not consume leave quotas.',
      'Our Days & Balance Calculator automatically detects and excludes federal holidays.',
      'Verify with your corporate calendar for floating or regional holidays.',
    ],
    proTip: 'Strategically booking leaves adjacent to public holidays allows you to enjoy 9-10 day vacations while using only 4 days of leave quota!',
  },
];
