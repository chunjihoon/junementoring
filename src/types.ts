export type ConsultationType = 'free' | 'paid';

export interface ConsultationPayload {
  submissionId: string;
  type: ConsultationType;
  name: string;
  email: string;
  contact: string;
  direction: 'web' | 'ios' | 'unsure';
  experience: string;
  idea: string;
  blocker: string;
  availability: string;
  website?: string;
}

export type ReviewCourse = 'diagnosis' | 'web' | 'ios' | 'other';

export interface ReviewPayload {
  submissionId: string;
  displayName: string;
  course: ReviewCourse;
  before: string;
  helpful: string;
  change: string;
  recommend: string;
  website?: string;
}

export interface PublishedReview extends Omit<ReviewPayload, 'website'> {
  id: string;
  published: true;
  createdAt?: Date;
}
