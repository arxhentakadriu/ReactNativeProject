export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  source?: 'api' | 'user';
};

export type TaskDraft = {
  title: string;
  description: string;
};
