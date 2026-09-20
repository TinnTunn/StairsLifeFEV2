// Tipe entitas backend beserta pembaca tautan hasil kerja.

export type UserRole = "mahasiswa" | "bisnis" | "admin";
export type UserTier = "pemula" | "menengah" | "mahir";
export type ApplicationStatus = "pending" | "shortlisted" | "approved" | "rejected";
export type ContractStatus = "active" | "pending_review" | "completed" | "disputed" | "cancelled";
export type PaymentStatus =
  | "pending"
  | "held"
  | "released"
  | "refunded"
  | "split_settled"
  | "expired"
  | "failed";
export type ProjectStatus = "open" | "inProgress" | "completed" | "disputed" | "cancelled";
export type ProjectTier = UserTier;
export type VerificationStatus = "pending" | "approved" | "rejected";
export type WithdrawalStatus = "pending" | "processing" | "completed" | "rejected" | "failed";
export type DisputeStatus = "open" | "under_review" | "in_review" | "mediation" | "resolved" | "rejected";
export type DisputeOutcome = "favor_business" | "favor_student" | "split" | "no_action";
export type NotificationType =
  | "application"
  | "contract"
  | "payment"
  | "review"
  | "dispute"
  | "verification"
  | "system"
  | "withdrawal";
export type WalletTransactionType =
  | "earn_release"
  | "earn_split"
  | "withdrawal_lock"
  | "withdrawal_done"
  | "withdrawal_refund";

export interface ApiEnvelope<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string | string[];
  code?: string;
  params?: Record<string, string | number>;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  is_verified: boolean;
  is_suspended: boolean;
  suspension_reason: string | null;
  avatar_url: string | null;
  bio: string | null;
  university: string | null;
  major: string | null;
  semester: number | null;
  phone: string | null;
  company_name: string | null;
  business_type: string | null;
  location: string | null;
  skills: string[];
  portfolio_url: string | null;
  rating_avg: string | null;
  total_projects: number;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  is_verified: boolean;
  is_suspended?: boolean;
  suspension_reason?: string | null;
  email_verified: boolean;
  avatar_url?: string | null;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  refresh_token: string;
}

export interface Project {
  id: string;
  business_id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  category: string;
  tier: ProjectTier;
  skills: string[];
  deliverables: string | null;
  status: ProjectStatus;
  applicant_count: number;
  created_at: string;
  updated_at: string;
  users?: Pick<User, "id" | "full_name" | "is_verified">;
}

export interface Application {
  id: string;
  project_id: string;
  student_id: string;
  cover_letter: string;
  estimated_completion: string;
  offered_budget: number | null;
  status: ApplicationStatus;
  created_at: string;
  projects?: Pick<Project, "id" | "title" | "budget_min" | "budget_max" | "category" | "tier" | "status"> & {
    users?: Pick<User, "id" | "full_name">;
  };
  users?: Pick<
    User,
    "id" | "full_name" | "avatar_url" | "tier" | "is_verified" | "rating_avg" | "total_projects" | "skills"
  >;
  contracts?: Array<{ id: string; status: ContractStatus }>;
}

export interface Contract {
  id: string;
  application_id: string;
  project_id: string;
  student_id: string;
  business_id: string;
  agreed_budget: number;
  deadline: string;
  status: ContractStatus;
  progress_pct: number;
  deliverable_url: string | null;
  deliverable_notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  projects?: Pick<Project, "id" | "title" | "category" | "tier">;
  users_contracts_student_idTousers?: Pick<User, "id" | "full_name" | "avatar_url" | "rating_avg"> & {
    email?: string;
  };
  users_contracts_business_idTousers?: Pick<User, "id" | "full_name" | "avatar_url"> & { email?: string };
}

export interface Payment {
  id: string;
  contract_id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  status: PaymentStatus;
  payer_id: string;
  payee_id: string;
  proof_url: string | null;
  held_at: string | null;
  released_at: string | null;
  created_at: string;
  xendit_invoice_url: string | null;
  xendit_invoice_id: string | null;
  payment_method: string | null;
  payment_channel: string | null;
  expires_at: string | null;
  paid_at: string | null;
  contracts?: Pick<Contract, "id" | "agreed_budget" | "status"> & {
    projects?: Pick<Project, "id" | "title">;
  };
}

export interface InvoiceResult {
  payment_id: string;
  invoice_url: string;
  invoice_id: string;
  amount: number;
  expires_at: string;
  status: "pending";
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  type: WalletTransactionType;
  amount: number;
  ref_type: string | null;
  ref_id: string | null;
  description: string | null;
  created_at: string;
}

export interface Wallet {
  amount: number;
  pending_amount: number;
  total_earned: number;
  total_withdrawn: number;
  recent_transactions: WalletTransaction[];
}

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  is_primary: boolean;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  bank_account_id: string;
  amount: number;
  admin_fee: number;
  amount_net: number;
  status: WithdrawalStatus;
  rejection_reason: string | null;
  requested_at: string;
  processed_at: string | null;
  bank_account?: BankAccount;
}

export interface Dispute {
  id: string;
  contract_id: string;
  opened_by: string;
  reason: string;
  evidence_url: string | null;
  status: DisputeStatus;
  outcome: DisputeOutcome | null;
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface DisputeSummary {
  id: string;
  project: string;
  reason: string;
  evidence_url: string | null;
  status: DisputeStatus;
  created_at: string;
  admin_notes: string | null;
  contract_id: string;
}

export interface Review {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  tags: string[];
  created_at: string;
  users_reviews_reviewer_idTousers?: Pick<User, "id" | "full_name" | "avatar_url"> & { role?: UserRole };
  users_reviews_reviewee_idTousers?: Pick<User, "id" | "full_name" | "avatar_url"> & { role?: UserRole };
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  ref_id: string | null;
  action_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Verification {
  id: string;
  user_id: string;
  status: VerificationStatus;
  ktm_image_url: string | null;
  selfie_url: string | null;
  university: string | null;
  student_id_number: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export interface UploadResult {
  url: string;
  file_name: string;
  size: number;
  mime_type: string;
}

export function parseDeliverableUrls(value: string | null): string[] {
  if (!value) return [];
  if (!value.trimStart().startsWith("[")) return [value];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string") : [value];
  } catch {
    return [value];
  }
}
