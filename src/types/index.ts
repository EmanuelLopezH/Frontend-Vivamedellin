export interface Comment {
  id: string;
  user: string;
  message: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  comments: Comment[];
}