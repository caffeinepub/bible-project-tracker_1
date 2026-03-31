import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskInput {
    bookName: string;
    projectType: BookSection;
    type: TaskType;
    chapter: bigint;
}
export interface TaskAssignment {
    task: Task;
    notes: Array<ProgressNote>;
}
export type Time = bigint;
export interface ProgressNote {
    content: string;
    author: Principal;
    taskId: bigint;
    timestamp: Time;
}
export interface Task {
    status: TaskStatus;
    book: Book;
    type: TaskType;
    chapter: bigint;
}
export interface Book {
    name: string;
    section: BookSection;
    chapters: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BookSection {
    newTestament = "newTestament",
    psalmsAndProphets = "psalmsAndProphets",
    oldTestament = "oldTestament"
}
export enum TaskStatus {
    videoReadyToRelease = "videoReadyToRelease",
    readyToRelease = "readyToRelease",
    inProcessAudio = "inProcessAudio",
    pendingToRelease = "pendingToRelease",
    inProcessVideo = "inProcessVideo",
    audioReadyToRelease = "audioReadyToRelease"
}
export enum TaskType {
    editing = "editing",
    audio = "audio",
    video = "video"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProgressNote(taskId: bigint, content: string): Promise<ProgressNote>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTaskToUser(user: Principal, input: TaskInput): Promise<void>;
    createTask(input: TaskInput): Promise<Task>;
    getAllBooks(): Promise<Array<Book>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllTasksByStatus(): Promise<Array<[TaskStatus, Array<Task>]>>;
    getAllTasksByType(taskType: TaskType): Promise<Array<Task>>;
    getAllTrackerTasksBySection(): Promise<Array<TaskAssignment>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getBook(name: string): Promise<Book | null>;
    getBooksBySection(section: BookSection): Promise<Array<Book>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyTasks(): Promise<Array<TaskAssignment>>;
    getTaskProgressNotes(taskId: bigint): Promise<Array<ProgressNote>>;
    getTasksByBook(book: string): Promise<Array<Task>>;
    getTasksByStatus(taskStatus: TaskStatus): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTask(bookName: string, update: TaskInput): Promise<void>;
    updateTaskStatus(id: bigint, status: TaskStatus): Promise<void>;
}
