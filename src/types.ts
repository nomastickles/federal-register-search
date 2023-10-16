export enum Step {
  INIT = "INIT",
  SHOW_INFO = "SHOW_INFO",
  TOPIC_EDIT = "TOPIC_EDIT",
  TOPIC_OPEN = "TOPIC_OPEN",
  TOPIC_UPDATE = "TOPIC_UPDATE",
}

export interface SetStep {
  step: Step;
  value?: number;
  clearStep?: boolean;
}

export interface State {
  stepMap: Partial<Record<Step, number>>;
  topics: Topic[];
}

export interface Topic {
  id: number;
  backgroundColor: string;
  illustrationColor: string;
  topicSections: string[];
  searchWords: string[];
  presidential?: boolean;
  illustrationType: string;
}

export type TopicOpen = {
  description: string;
  count: number;
  total_pages: number;
  next_page_url: string;
  results: Doc[];
};

export type Doc = {
  title: string;
  document_number: string;
  html_url: string;
  publication_date?: string;
  type: string;
  abstract: string;
  excerpts: string;
};

export type FormData = {
  searchWords: string;
  presidential: boolean;
};
