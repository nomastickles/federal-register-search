export enum Step {
  OPEN_TOPIC = "OPEN_TOPIC",
  EDIT_TOPIC = "EDIT_TOPIC",
  SHOW_INFO = "SHOW_INFO",
}

export interface SetStep {
  step: Step;
  value?: number;
  clearStep?: boolean;
}

export interface State {
  stepMap: Partial<Record<Step, number>>;
  topics: TopicInfo[];
}

export interface TopicInfo {
  id: number;
  backgroundColor: string;
  headerColor: string;
  topicSections: string[];
  searchWords: string[];
  presidential?: boolean;
}

export type Doc = {
  title: string;
  document_number: string;
  html_url: string;
  publication_date?: string;
  type: string;
  abstract: string;
  excerpts: string;
};

export type TopicOpenInfo = {
  description: string;
  count: number;
  total_pages: number;
  next_page_url: string;
  results: Doc[];
};

export type FormData = {
  searchWords: string;
  presidential: boolean;
};
