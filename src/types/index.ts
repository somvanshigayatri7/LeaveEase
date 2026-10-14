export type LeaveType =
  | 'Annual Vacation'
  | 'Sick & Medical'
  | 'Casual & Personal'
  | 'Maternity / Paternity'
  | 'Bereavement / Compassionate'
  | 'Study & Exam'
  | 'Compensatory Off'
  | 'Unpaid Leave / Sabbatical'
  | 'Mental Health Day'
  | 'Emergency & Caregiver';

export type Tone = 'formal' | 'cordial' | 'concise' | 'urgent';

export interface UserProfile {
  name: string;
  title: string;
  department: string;
  managerName: string;
  managerTitle: string;
  managerEmail: string;
  backupColleague: string;
  backupEmail: string;
  emergencyPhone: string;
}

export interface LeaveBalance {
  annualTotal: number;
  annualUsed: number;
  sickTotal: number;
  sickUsed: number;
  casualTotal: number;
  casualUsed: number;
  compOffTotal: number;
  compOffUsed: number;
}

export interface LeaveDraft {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  returnDate: string;
  totalDays: number;
  isHalfDay: boolean;
  halfDayPeriod?: 'first_half' | 'second_half';
  reason: string;
  coverageColleague: string;
  handoverDetails: string;
  emergencyContact: string;
  tone: Tone;
  additionalNotes: string;
}

export interface GeneratedLeavePackage {
  subjectOptions: string[];
  emailSubject: string;
  emailBody: string;
  formalLetter: string;
  slackSummary: string;
  outOfOfficeMessage: string;
  approvalChecklist: string[];
  handoverBullets: string[];
}

export interface AuditResult {
  score: number;
  rating: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  criteriaChecks: {
    name: string;
    status: 'pass' | 'warning' | 'alert';
    note: string;
  }[];
  polishedDraft: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  extractedDraft?: Partial<LeaveDraft>;
}

export interface CompanyPolicy {
  id: string;
  name: string;
  description: string;
  annualDays: number;
  sickDays: number;
  casualDays: number;
  noticeAnnualDays: number;
  noticeSickRequirement: string;
  medicalCertDays: number;
  sandwichRule: boolean;
  probationRule: string;
  handoverPolicy: string;
  fullText: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: LeaveType;
  description: string;
  durationExample: string;
  urgency: 'Low' | 'Medium' | 'High';
  subject: string;
  body: string;
  tips: string[];
}
