import { CompanyPolicy, LeaveType, TemplateItem, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  title: 'Senior Product Specialist',
  department: 'Product & Operations',
  managerName: 'Sarah Jenkins',
  managerTitle: 'Director of Product',
  managerEmail: 'sarah.jenkins@company.com',
  backupColleague: 'David Chen',
  backupEmail: 'david.chen@company.com',
  emergencyPhone: '+1 (555) 234-5678',
};

export const LEAVE_CATEGORIES: { type: LeaveType; label: string; icon: string; typicalNotice: string; docRequired: string; color: string }[] = [
  {
    type: 'Annual Vacation',
    label: 'Annual / Vacation Leave',
    icon: 'Palmtree',
    typicalNotice: '14 days notice for >3 days',
    docRequired: 'None',
    color: 'emerald',
  },
  {
    type: 'Sick & Medical',
    label: 'Sick & Medical Leave',
    icon: 'Stethoscope',
    typicalNotice: 'Same day (before 9:00 AM)',
    docRequired: 'Doctor note required for 3+ days',
    color: 'rose',
  },
  {
    type: 'Casual & Personal',
    label: 'Casual / Personal Day',
    icon: 'Calendar',
    typicalNotice: '2-3 days notice',
    docRequired: 'None',
    color: 'blue',
  },
  {
    type: 'Mental Health Day',
    label: 'Mental Health & Well-being',
    icon: 'HeartPulse',
    typicalNotice: 'Same day or 24 hours prior',
    docRequired: 'Usually none',
    color: 'purple',
  },
  {
    type: 'Maternity / Paternity',
    label: 'Parental / Maternity / Paternity',
    icon: 'Baby',
    typicalNotice: '30 to 60 days advance notice',
    docRequired: 'Medical certificate / birth proof',
    color: 'pink',
  },
  {
    type: 'Bereavement / Compassionate',
    label: 'Bereavement / Compassionate',
    icon: 'Flower2',
    typicalNotice: 'Immediate notification',
    docRequired: 'Obituary notice / documentation upon return',
    color: 'slate',
  },
  {
    type: 'Compensatory Off',
    label: 'Compensatory Off (Comp-Off)',
    icon: 'Clock',
    typicalNotice: '3-5 days advance notice',
    docRequired: 'Approval from overtime manager',
    color: 'amber',
  },
  {
    type: 'Study & Exam',
    label: 'Study & Professional Exam',
    icon: 'GraduationCap',
    typicalNotice: '2-3 weeks notice',
    docRequired: 'Exam schedule / admission ticket',
    color: 'indigo',
  },
  {
    type: 'Unpaid Leave / Sabbatical',
    label: 'Unpaid Leave / Sabbatical',
    icon: 'PlaneTakeoff',
    typicalNotice: '30-90 days advance notice',
    docRequired: 'Formal HR committee review',
    color: 'orange',
  },
  {
    type: 'Emergency & Caregiver',
    label: 'Emergency & Caregiver Leave',
    icon: 'ShieldAlert',
    typicalNotice: 'Immediate as soon as feasible',
    docRequired: 'Family medical care documentation if prolonged',
    color: 'red',
  },
];

export const COMPANY_POLICIES: CompanyPolicy[] = [
  {
    id: 'corporate_standard',
    name: 'Standard Corporate Policy (Global 2026)',
    description: 'Structured enterprise policy with standard accrual, sandwich clause, and notice periods.',
    annualDays: 20,
    sickDays: 10,
    casualDays: 5,
    noticeAnnualDays: 14,
    noticeSickRequirement: 'Notify line manager by 9:00 AM on day of absence.',
    medicalCertDays: 3,
    sandwichRule: true,
    probationRule: 'Only emergency sick leave allowed during initial 90 days probation.',
    handoverPolicy: 'Mandatory nominated peer backup and active out-of-office message configured.',
    fullText: `Standard Corporate Leave Policy 2026:
1. Annual Leave: Employees accrue 1.66 days per month (20 days per year). Up to 5 unused days roll over into Q1 of next year.
2. Advance Notice: Minimum 14 calendar days advance submission for requests over 3 consecutive days; minimum 48 hours for 1-2 days.
3. Sick Leave: 10 paid days annually. Absences of 3 or more consecutive business days mandate a certified medical practitioner certificate.
4. Sandwich Rule: If an employee takes leave on Friday and following Monday, intervening weekend days are NOT counted unless combined leave exceeds 10 consecutive days.
5. Handover: Every leave application must name a designated project proxy and verify no critical client milestone clashes.`,
  },
  {
    id: 'tech_startup',
    name: 'Tech Startup / Flexible PTO',
    description: 'Outcome-oriented flexible leave policy prioritizing asynchronous handovers and trust.',
    annualDays: 25,
    sickDays: 12,
    casualDays: 5,
    noticeAnnualDays: 7,
    noticeSickRequirement: 'Drop a message in #team-out channel before daily standup.',
    medicalCertDays: 5,
    sandwichRule: false,
    probationRule: 'Full PTO accessible after first 30 days.',
    handoverPolicy: 'Asynchronous doc in Notion/Loom video link shared with team.',
    fullText: `Flexible Startup PTO Guidelines:
1. Rest is encouraged: We target minimum 20 days off taken per year per teammate.
2. Notice: Give 1 week notice for 3+ days off so team can rebalance sprint planning.
3. Standup Alert: Ping your squad Slack channel at least 30 minutes before standup for unplanned sick or mental health days.
4. Zero Sandwich Penalties: Weekends are yours; you are only charged for standard workdays.
5. Coverage: Ensure active sprint tickets are re-assigned or flagged as paused.`,
  },
  {
    id: 'healthcare_shift',
    name: 'Healthcare & Shift Operations',
    description: 'Rigorous coverage-focused policy requiring certified shift swaps and strict documentation.',
    annualDays: 18,
    sickDays: 12,
    casualDays: 4,
    noticeAnnualDays: 21,
    noticeSickRequirement: 'Call the staffing coordinator at least 2 hours prior to shift commencement.',
    medicalCertDays: 2,
    sandwichRule: true,
    probationRule: 'No elective leave permitted during 6-month clinical onboarding.',
    handoverPolicy: 'Formal signed shift swap agreement registered with head nurse/supervisor.',
    fullText: `Clinical & Healthcare Operations Leave Protocol:
1. Patient Safety Priority: Staffing ratios must be preserved at all times.
2. Advance Notice: Rosters are published 4 weeks in advance. Planned leave requires 3 weeks notice before roster lock.
3. Unplanned Sickness: Must notify dispatch/charge nurse at least 2 hours before scheduled shift.
4. Medical Certification: Required for absences of 2 or more consecutive shifts, or any shift immediately adjacent to a scheduled weekend off.
5. Swaps: Peer swaps must be countersigned by both staff members and supervisor.`,
  },
  {
    id: 'academic_education',
    name: 'Academic & University Faculty',
    description: 'Term-based schedule with designated semester recesses and exam invigilation blackout periods.',
    annualDays: 30,
    sickDays: 15,
    casualDays: 6,
    noticeAnnualDays: 30,
    noticeSickRequirement: 'Notify Department Chair and arrange substitute lecturer.',
    medicalCertDays: 3,
    sandwichRule: false,
    probationRule: 'Teaching commitments cannot be abandoned during active instructional weeks.',
    handoverPolicy: 'Approved substitute faculty for lectures and lab supervision.',
    fullText: `Academic Faculty & Staff Leave Framework:
1. Instructional Weeks: Routine personal leave during teaching weeks is strongly discouraged; emergency substitutions require Dean approval.
2. Recesses: Primary annual leave should be coordinated during semester breaks and reading periods.
3. Exam Blackouts: No discretionary leave permitted during mid-term and final examination weeks.
4. Sabbatical & Research: Sabbaticals follow separate tenure-track sabbatical bylaws (minimum 6 years continuous service).`,
  },
];

export const SAMPLE_TEMPLATES: TemplateItem[] = [
  {
    id: 'tmpl-vacation-planned',
    title: 'Planned Annual Vacation (1-2 Weeks)',
    category: 'Annual Vacation',
    description: 'Comprehensive, proactive vacation application with designated proxy, completed milestones, and clear offline boundaries.',
    durationExample: 'Mon, Oct 19 - Fri, Oct 30 (10 Business Days)',
    urgency: 'Low',
    subject: 'Leave Application: [Your Name] - Annual Leave ([Start Date] to [End Date])',
    body: `Dear [Manager Name],

I am writing to formally request annual leave for [Number] working days, starting from [Start Date] to [End Date]. I will resume work on [Return Date].

In preparation for my time away, I have taken the following measures to ensure smooth continuity:
- [Colleague Name] has kindly agreed to serve as my primary backup for urgent inquiries and ongoing operational tickets.
- All high-priority deliverables scheduled for this sprint will be completed before my departure on [Last Working Day].
- Detailed handover documentation with access links has been shared with the team.

During this period, I intend to remain fully offline to recharge. However, in the event of an urgent, critical emergency, you can reach me via mobile at [Emergency Contact Number].

Thank you for your consideration and support.

Warm regards,
[Your Name]
[Your Title]`,
    tips: [
      'Submit at least 2-3 weeks ahead so your manager can plan sprint capacity.',
      'Brief your backup colleague verbally before submitting their name.',
      'Schedule an automated Out-of-Office message on your email and Slack before leaving.',
    ],
  },
  {
    id: 'tmpl-sick-fever',
    title: 'Sudden Illness / Fever / Medical Leave',
    category: 'Sick & Medical',
    description: 'Urgent, concise morning sick leave notice for unexpected sickness or severe cold.',
    durationExample: '1 - 2 Days',
    urgency: 'High',
    subject: 'Sick Leave Notice: [Your Name] - [Today Date]',
    body: `Hi [Manager Name],

I am writing to let you know that I have woken up unwell with a high fever and severe flu symptoms, and will be unable to work today, [Today Date]. 

I am resting and consulting a doctor. I will monitor my symptoms and provide you with an update this evening regarding my availability for tomorrow.

[Colleague Name] has been notified and will cover my scheduled morning client sync. Please feel free to reassign any pressing tickets if needed.

Thank you for your understanding.

Best regards,
[Your Name]
[Your Title]`,
    tips: [
      'Send this as early as possible, ideally before your regular working hours begin.',
      'Keep it brief; there is no need to over-explain private medical symptoms.',
      'Check if your company requires a doctor certificate if absent past 2-3 days.',
    ],
  },
  {
    id: 'tmpl-surgery-planned',
    title: 'Planned Medical Procedure / Surgery',
    category: 'Sick & Medical',
    description: 'Professional request for scheduled surgery and recovery period with doctor note notice.',
    durationExample: 'Mon, Nov 2 - Fri, Nov 13 (2 Weeks Recovery)',
    urgency: 'Medium',
    subject: 'Medical Leave Application: [Your Name] - Medical Procedure ([Start Date] to [End Date])',
    body: `Dear [Manager Name],

I am writing to formally apply for medical leave from [Start Date] to [End Date] to undergo a scheduled surgical procedure and follow-up medical recovery. My physician anticipates that I will be cleared to resume normal duties on [Return Date].

I have attached the doctor's formal recommendation letter for HR records. 

Prior to my leave date:
1. I will complete all impending project handoffs and brief [Colleague Name] on all active items.
2. A comprehensive briefing memo will be deposited in the team shared drive.

Given the nature of the recovery, I will have limited access to email, but [Colleague Name] and HR have my emergency family contact details if necessary.

Thank you for your understanding and support during this time.

Sincerely,
[Your Name]
[Your Title]`,
    tips: [
      'Attach official hospital or doctor booking confirmation.',
      'Check if short-term disability or medical insurance paperwork is needed via HR.',
    ],
  },
  {
    id: 'tmpl-mental-health',
    title: 'Mental Health & Well-being Rest Day',
    category: 'Mental Health Day',
    description: 'Thoughtful, boundary-respecting notice for a recharge day without oversharing.',
    durationExample: '1 Day',
    urgency: 'Medium',
    subject: 'Personal Well-being Day: [Your Name] - [Date]',
    body: `Hi [Manager Name],

I would like to request to take a personal well-being / mental health day tomorrow, [Date]. I will return to normal duties on [Return Date].

I have ensured that all my deliverables for today are wrapped up, and [Colleague Name] is aware and can address any urgent incoming items in my absence.

I appreciate your understanding and support for personal wellness.

Warmly,
[Your Name]
[Your Title]`,
    tips: [
      'You are entitled to use sick or personal leave for mental health in modern workplaces.',
      'You do not need to disclose vulnerable personal details; "personal well-being day" is completely standard.',
    ],
  },
  {
    id: 'tmpl-bereavement',
    title: 'Bereavement / Family Loss',
    category: 'Bereavement / Compassionate',
    description: 'Compassionate leave notice following the loss of an immediate or extended family member.',
    durationExample: '3 - 5 Days',
    urgency: 'High',
    subject: 'Urgent: Compassionate / Bereavement Leave - [Your Name]',
    body: `Dear [Manager Name],

I am writing with heavy heart to inform you of the sudden passing of my [Relationship, e.g., grandmother / father / family member]. 

I will need to take bereavement leave starting [Start Date] through [End Date] to be with my family and assist with memorial arrangements. I plan to return to work on [Return Date].

I have briefly connected with [Colleague Name] to cover any critical immediate tasks. I will be mostly offline to focus on family matters during this difficult period.

Thank you for your empathy and understanding.

Sincerely,
[Your Name]
[Your Title]`,
    tips: [
      'HR usually grants 3 to 5 days of compassionate leave for immediate family.',
      'Focus on your family first; managers and teams are universally accommodating for bereavement.',
    ],
  },
  {
    id: 'tmpl-parental-maternity',
    title: 'Maternity / Paternity / Parental Leave',
    category: 'Maternity / Paternity',
    description: 'Structured parental leave request with phased handover, estimated due date, and return roadmap.',
    durationExample: '12 - 16 Weeks',
    urgency: 'Low',
    subject: 'Formal Parental Leave Request: [Your Name] (Anticipated [Month/Year])',
    body: `Dear [Manager Name] and [HR Partner Name],

I am writing to formally submit my request for parental leave in anticipation of the arrival of our child. My estimated due date / adoption date is [Due Date].

I plan to commence my leave on [Start Date] and anticipate returning to work on [Estimated Return Date], taking a total of [Number] weeks in accordance with company policy.

Over the coming weeks, I will execute a thorough transition plan:
- Finalizing critical project milestones before my leave.
- Training [Colleague Name] and our team on ongoing responsibilities.
- Creating a clear protocol document for periodic check-ins if desired.

I have attached the required medical verification form as requested by the HR benefits handbook.

Thank you for your ongoing guidance and support as our family prepares for this milestone.

Warm regards,
[Your Name]
[Your Title]`,
    tips: [
      'Submit at least 1-2 months in advance to comply with statutory and HR guidelines.',
      'Coordinate with HR regarding benefits continuation, paid vs unpaid period, and return-to-work flexibility.',
    ],
  },
  {
    id: 'tmpl-casual-halfday',
    title: 'Half-Day Leave for Medical / Personal Appointment',
    category: 'Casual & Personal',
    description: 'Quick request for a morning or afternoon off for bank, visa, or doctor appointments.',
    durationExample: 'Half Day (Afternoon or Morning)',
    urgency: 'Medium',
    subject: 'Half-Day Leave Request: [Your Name] - [Date] ([Morning/Afternoon])',
    body: `Hi [Manager Name],

I would like to apply for a half-day leave on [Date], taking the [first half / second half (e.g. 1:00 PM onwards)] off for a scheduled medical appointment that could not be set outside office hours.

I will be actively working during the [other half] of the day and will ensure all urgent morning deliverables are addressed before I step away.

[Colleague Name] is aware and can assist with any urgent escalations while I am away.

Thank you,
[Your Name]`,
    tips: [
      'Specify the exact hours you will be offline (e.g., 9:00 AM - 1:00 PM vs 1:00 PM - 5:00 PM).',
      'Confirm you will complete required day-to-day commitments before stepping away.',
    ],
  },
  {
    id: 'tmpl-compoff',
    title: 'Compensatory Off for Weekend Deployment / Event',
    category: 'Compensatory Off',
    description: 'Application to utilize earned comp-off credits for weekend overtime or emergency shift coverage.',
    durationExample: '1 - 2 Days',
    urgency: 'Low',
    subject: 'Compensatory Off Request: [Your Name] - [Date]',
    body: `Dear [Manager Name],

I am writing to request a Compensatory Off day on [Date] in lieu of the weekend support hours I worked on [Date of Weekend Work, e.g. Saturday, Oct 10th for the major production release / customer conference].

The overtime was logged and verified with [Lead / Manager Name]. Taking this day on [Date] will have minimal operational impact, as current sprint commitments are on track and [Colleague Name] will cover our daily channel.

Thank you for your approval.

Best regards,
[Your Name]
[Your Title]`,
    tips: [
      'Reference the exact date and reason for the weekend or overtime work.',
      'Check if comp-off has an expiration window (most companies require using it within 30-60 days).',
    ],
  },
  {
    id: 'tmpl-study-exam',
    title: 'Study & Certification Exam Leave',
    category: 'Study & Exam',
    description: 'Formal application for professional accreditation, university examinations, or bar exams.',
    durationExample: '3 Days',
    urgency: 'Medium',
    subject: 'Study Leave Request: [Your Name] - Professional Certification ([Dates])',
    body: `Dear [Manager Name],

I am writing to formally request [Number] days of study leave from [Start Date] to [End Date] to prepare for and sit for my [Exam / Certification Name, e.g., PMP / AWS Solutions Architect / Professional CPA Exam].

This qualification directly supports my responsibilities within [Department] and will expand our team capabilities.

I have scheduled my study leave around our current release timeline, and [Colleague Name] has access to my active files. I will return to work on [Return Date].

Thank you for encouraging continuous learning and development.

Sincerely,
[Your Name]
[Your Title]`,
    tips: [
      'Highlight how the certification or study benefits your role or department.',
      'Provide exam admission schedule if requested by HR educational support policy.',
    ],
  },
];

export const UPCOMING_HOLIDAYS_2026 = [
  { name: 'New Year Day', date: '2026-01-01' },
  { name: 'Martin Luther King Jr. Day', date: '2026-01-19' },
  { name: 'Presidents Day', date: '2026-02-16' },
  { name: 'Memorial Day', date: '2026-05-25' },
  { name: 'Juneteenth', date: '2026-06-19' },
  { name: 'Independence Day', date: '2026-07-03' },
  { name: 'Labor Day', date: '2026-09-07' },
  { name: 'Thanksgiving Day', date: '2026-11-26' },
  { name: 'Day After Thanksgiving', date: '2026-11-27' },
  { name: 'Christmas Day', date: '2026-12-25' },
];
