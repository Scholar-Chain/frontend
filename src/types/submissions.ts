import { Journal } from './journal';
export interface Submission {
    id: number;
    external_id: number;
    status: string;
    trx_hash: string;
    author_id: number;
    publisher_id: number;
    created_at: string;
    updated_at: string;
    journal: Journal;
}
export interface SubmissionDetailResponse {
    data: Submission;
    links: {
        self: string;
        related: string;
    };
    meta: {
        status_code: number;
        message: string;
    };
}
export interface SubmissionsApiResponse {
  data: Submission[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}