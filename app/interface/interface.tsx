export default interface Task {
  id: number; // Unique identifier for the task
  title: string; // Title of the task
  description: string; // Description of the task
  date: string; // Date of the task in YYYY-MM-DD format
  time: string; // Time of the task in HH:mm format
}