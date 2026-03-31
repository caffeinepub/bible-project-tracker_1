import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type BookSection = { #oldTestament; #psalmsAndProphets; #newTestament };
  public type Book = {
    name : Text;
    chapters : Nat;
    section : BookSection;
  };
  public type TaskType = { #audio; #video; #editing };
  public type TaskStatus = {
    #inProcessAudio;
    #inProcessVideo;
    #audioReadyToRelease;
    #videoReadyToRelease;
    #readyToRelease;
    #pendingToRelease;
  };
  public type ProgressNote = {
    author : Principal;
    content : Text;
    taskId : Nat;
    timestamp : Time.Time;
  };
  public type Task = {
    book : Book;
    type_ : TaskType;
    chapter : Nat;
    status : TaskStatus;
  };

  public type TaskWithNotes = {
    task : Task;
    notes : [ProgressNote];
  };

  public type TaskAssignment = {
    task : Task;
    notes : [ProgressNote];
  };
  public type UserProfile = {
    name : Text;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  type TaskInput = {
    type_ : TaskType;
    projectType : BookSection;
    chapter : Nat;
    bookName : Text;
  };

  // Helper Modules
  module BookSection {
    public func toNat(section : BookSection) : Nat {
      switch (section) {
        case (#oldTestament) { 0 };
        case (#psalmsAndProphets) { 1 };
        case (#newTestament) { 2 };
      };
    };
  };

  module Task {
    public func compareByBookSection(task1 : Task, task2 : Task) : Order.Order {
      let section1Order = BookSection.toNat(task1.book.section);
      let section2Order = BookSection.toNat(task2.book.section);

      switch (Nat.compare(section1Order, section2Order)) {
        case (#equal) { Text.compare(task1.book.name, task2.book.name) };
        case (order) { order };
      };
    };

    func getBookSection(task : Task) : BookSection {
      task.book.section;
    };
    public func compareByBook(task1 : Task, task2 : Task) : Order.Order {
      Text.compare(task1.book.name, task2.book.name);
    };

    public func compareByChapter(task1 : Task, task2 : Task) : Order.Order {
      Nat.compare(task1.chapter, task2.chapter);
    };
  };

  module TaskAssignment {
    public func compareByBookSection(assignment1 : TaskAssignment, assignment2 : TaskAssignment) : Order.Order {
      Task.compareByBookSection(assignment1.task, assignment2.task);
    };
    public func compareByBook(assignment1 : TaskAssignment, assignment2 : TaskAssignment) : Order.Order {
      Task.compareByBook(assignment1.task, assignment2.task);
    };
    public func compareByChapter(assignment1 : TaskAssignment, assignment2 : TaskAssignment) : Order.Order {
      Task.compareByChapter(assignment1.task, assignment2.task);
    };
  };

  // Constants & Data Structure
  // Book data
  let books = [
    {
      name = "Genesis";
      chapters = 50;
      section = #oldTestament;
    },
    {
      name = "Exodus";
      chapters = 40;
      section = #oldTestament;
    },
    {
      name = "Leviticus";
      chapters = 27;
      section = #oldTestament;
    },
    {
      name = "Numbers";
      chapters = 36;
      section = #oldTestament;
    },
    {
      name = "Deuteronomy";
      chapters = 34;
      section = #oldTestament;
    },
    {
      name = "Joshua";
      chapters = 24;
      section = #oldTestament;
    },
    {
      name = "Judges";
      chapters = 21;
      section = #oldTestament;
    },
    {
      name = "Ruth";
      chapters = 4;
      section = #oldTestament;
    },
    {
      name = "1 Samuel";
      chapters = 31;
      section = #oldTestament;
    },
    {
      name = "2 Samuel";
      chapters = 24;
      section = #oldTestament;
    },
    {
      name = "1 Kings";
      chapters = 22;
      section = #oldTestament;
    },
    {
      name = "2 Kings";
      chapters = 25;
      section = #oldTestament;
    },
    {
      name = "1 Chronicles";
      chapters = 29;
      section = #oldTestament;
    },
    {
      name = "2 Chronicles";
      chapters = 36;
      section = #oldTestament;
    },
    {
      name = "Ezra";
      chapters = 10;
      section = #oldTestament;
    },
    {
      name = "Nehemiah";
      chapters = 13;
      section = #oldTestament;
    },
    {
      name = "Esther";
      chapters = 10;
      section = #oldTestament;
    },
    {
      name = "Daniel";
      chapters = 12;
      section = #psalmsAndProphets;
    },
    {
      name = "Hosea";
      chapters = 14;
      section = #psalmsAndProphets;
    },
    {
      name = "Joel";
      chapters = 3;
      section = #psalmsAndProphets;
    },
    {
      name = "Amos";
      chapters = 9;
      section = #psalmsAndProphets;
    },
    {
      name = "Obadiah";
      chapters = 1;
      section = #psalmsAndProphets;
    },
    {
      name = "Jonah";
      chapters = 4;
      section = #psalmsAndProphets;
    },
    {
      name = "Micah";
      chapters = 7;
      section = #psalmsAndProphets;
    },
    {
      name = "Nahum";
      chapters = 3;
      section = #psalmsAndProphets;
    },
    {
      name = "Habakkuk";
      chapters = 3;
      section = #psalmsAndProphets;
    },
    {
      name = "Zephaniah";
      chapters = 3;
      section = #psalmsAndProphets;
    },
    {
      name = "Haggai";
      chapters = 2;
      section = #psalmsAndProphets;
    },
    {
      name = "Zechariah";
      chapters = 14;
      section = #psalmsAndProphets;
    },
    {
      name = "Malachi";
      chapters = 4;
      section = #psalmsAndProphets;
    },
    {
      name = "Jonah";
      chapters = 4;
      section = #psalmsAndProphets;
    },
    {
      name = "Genesis";
      chapters = 50;
      section = #oldTestament;
    },
    {
      name = "Isaiah";
      chapters = 66;
      section = #psalmsAndProphets;
    },
    {
      name = "Psalms";
      chapters = 150;
      section = #psalmsAndProphets;
    },
    {
      name = "Job";
      chapters = 42;
      section = #psalmsAndProphets;
    },
    {
      name = "Proverbs";
      chapters = 31;
      section = #psalmsAndProphets;
    },
    {
      name = "Ecclesiastes";
      chapters = 12;
      section = #psalmsAndProphets;
    },
    {
      name = "Song of Solomon";
      chapters = 8;
      section = #psalmsAndProphets;
    },
    {
      name = "Matthew";
      chapters = 28;
      section = #newTestament;
    },
    {
      name = "Mark";
      chapters = 16;
      section = #newTestament;
    },
    {
      name = "Luke";
      chapters = 24;
      section = #newTestament;
    },
    {
      name = "John";
      chapters = 21;
      section = #newTestament;
    },
    {
      name = "Acts";
      chapters = 28;
      section = #newTestament;
    },
    {
      name = "Romans";
      chapters = 16;
      section = #newTestament;
    },
    {
      name = "1 Corinthians";
      chapters = 16;
      section = #newTestament;
    },
    {
      name = "2 Corinthians";
      chapters = 13;
      section = #newTestament;
    },
    {
      name = "Galatians";
      chapters = 6;
      section = #newTestament;
    },
    {
      name = "Ephesians";
      chapters = 6;
      section = #newTestament;
    },
    {
      name = "Philippians";
      chapters = 4;
      section = #newTestament;
    },
    {
      name = "Colossians";
      chapters = 4;
      section = #newTestament;
    },
    {
      name = "1 Thessalonians";
      chapters = 5;
      section = #newTestament;
    },
    {
      name = "2 Thessalonians";
      chapters = 3;
      section = #newTestament;
    },
    {
      name = "1 Timothy";
      chapters = 6;
      section = #newTestament;
    },
    {
      name = "2 Timothy";
      chapters = 4;
      section = #newTestament;
    },
    {
      name = "Titus";
      chapters = 3;
      section = #newTestament;
    },
    {
      name = "Philemon";
      chapters = 1;
      section = #newTestament;
    },
    {
      name = "Hebrews";
      chapters = 13;
      section = #newTestament;
    },
    {
      name = "James";
      chapters = 5;
      section = #newTestament;
    },
    {
      name = "1 Peter";
      chapters = 5;
      section = #newTestament;
    },
    {
      name = "2 Peter";
      chapters = 3;
      section = #newTestament;
    },
    {
      name = "1 John";
      chapters = 5;
      section = #newTestament;
    },
    {
      name = "2 John";
      chapters = 1;
      section = #newTestament;
    },
    {
      name = "3 John";
      chapters = 1;
      section = #newTestament;
    },
    {
      name = "Jude";
      chapters = 1;
      section = #newTestament;
    },
    {
      name = "Revelation";
      chapters = 22;
      section = #newTestament;
    },
  ];
  // Storage
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile storage
  let userProfileStore = Map.empty<Principal, UserProfile>();

  // Tasks assigned per user - user principal -> list of task IDs
  let userTaskAssignments = Map.empty<Principal, List.List<Nat>>();

  // Task ID counter
  var nextTaskId : Nat = 0;

  // Standard task store - task ID -> Task
  let tasks = Map.empty<Nat, Task>();

  // Progress notes - task ID -> list of notes
  let progressNotes = Map.empty<Nat, List.List<ProgressNote>>();

  // Helper Functions

  // Helper function to check if user is assigned to a task
  func isUserAssignedToTask(user : Principal, taskId : Nat) : Bool {
    switch (userTaskAssignments.get(user)) {
      case (null) { false };
      case (?taskList) {
        taskList.toArray().find(func(id : Nat) : Bool { id == taskId }) != null;
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfileStore.add(caller, profile);
  };

  func taskInputToTask(input : TaskInput) : Task {
    let book = switch (books.filter(func(book) { book.name == input.bookName }).values().next()) {
      case (?found) { found };
      case (null) {
        Runtime.trap("Book not found");
      };
    };
    {
      book;
      type_ = input.type_;
      chapter = input.chapter;
      status = #inProcessAudio;
    };
  };

  public query ({ caller }) func getBook(name : Text) : async ?Book {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view books");
    };
    books.find(func(book) { book.name == name });
  };

  // Create Task
  public shared ({ caller }) func createTask(input : TaskInput) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };

    let task = taskInputToTask(input);
    let taskId = nextTaskId;
    nextTaskId += 1;

    // Save task to tasks map
    tasks.add(taskId, task);

    task;
  };

  // Assign Task to User
  public shared ({ caller }) func assignTaskToUser(user : Principal, input : TaskInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign tasks");
    };
    let task = taskInputToTask(input);
    let taskId = nextTaskId;
    nextTaskId += 1;

    tasks.add(taskId, task);

    // Add task to user's assignment list
    switch (userTaskAssignments.get(user)) {
      case (null) {
        let newList = List.empty<Nat>();
        newList.add(taskId);
        userTaskAssignments.add(user, newList);
      };
      case (?existingList) {
        existingList.add(taskId);
      };
    };
  };

  // Update Task
  public shared ({ caller }) func updateTask(bookName : Text, update : TaskInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update tasks");
    };

    let book = switch (books.filter(func(book) { book.name == bookName }).values().next()) {
      case (?found) { found };
      case (null) {
        Runtime.trap("Book not found");
      };
    };
    let task = {
      book;
      type_ = update.type_;
      chapter = update.chapter;
      status = #inProcessAudio;
    };
    let taskId = nextTaskId;
    nextTaskId += 1;
    tasks.add(taskId, task);
  };

  // Update Task Status - Admin can update any task, users can only update their assigned tasks
  public shared ({ caller }) func updateTaskStatus(id : Nat, status : TaskStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update task status");
    };

    // Check if admin or assigned to task
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAssigned = isUserAssignedToTask(caller, id);

    if (not isAdmin and not isAssigned) {
      Runtime.trap("Unauthorized: You can only update tasks assigned to you");
    };

    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask = {
          book = task.book;
          type_ = task.type_;
          chapter = task.chapter;
          status = status;
        };
        tasks.add(id, updatedTask);
      };
    };
  };

  // Get All Books
  public query ({ caller }) func getAllBooks() : async [Book] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view books");
    };
    books.values().toArray();
  };

  public query ({ caller }) func getAllTasksByType(taskType : TaskType) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray().filter(func(task) { task.type_ == taskType });
  };

  // Get Tasks by Status
  public query ({ caller }) func getTasksByStatus(taskStatus : TaskStatus) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray().filter(func(task) { task.status == taskStatus });
  };

  // Get Tasks by Book
  public query ({ caller }) func getTasksByBook(book : Text) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray().filter(func(task) { task.book.name == book });
  };

  // Get All Tasks - Admin only
  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all tasks");
    };
    tasks.values().toArray();
  };

  // Get User's Tasks
  public query ({ caller }) func getMyTasks() : async [TaskAssignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their tasks");
    };

    switch (userTaskAssignments.get(caller)) {
      case (null) { [] };
      case (?taskIds) {
        let assignments = List.empty<TaskAssignment>();
        for (taskId in taskIds.toArray().vals()) {
          switch (tasks.get(taskId)) {
            case (null) {};
            case (?task) {
              let notes = switch (progressNotes.get(taskId)) {
                case (null) { [] };
                case (?notesList) { notesList.toArray() };
              };
              assignments.add({ task; notes });
            };
          };
        };
        assignments.toArray();
      };
    };
  };

  // Add Progress Note - User must be assigned to the task
  public shared ({ caller }) func addProgressNote(taskId : Nat, content : Text) : async ProgressNote {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add progress notes");
    };

    // Check if admin or assigned to task
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAssigned = isUserAssignedToTask(caller, taskId);

    if (not isAdmin and not isAssigned) {
      Runtime.trap("Unauthorized: You can only add notes to tasks assigned to you");
    };

    let note = {
      author = caller;
      content;
      taskId;
      timestamp = Time.now();
    };
    switch (progressNotes.get(taskId)) {
      case (null) {
        let notes = List.empty<ProgressNote>();
        notes.add(note);
        progressNotes.add(taskId, notes);
      };
      case (?notes) {
        notes.add(note);
      };
    };
    note;
  };

  // Get User by Principal - Admin can view any profile, users can only view their own
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfileStore.get(user);
  };

  // Get My Profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfileStore.get(caller);
  };

  // Get Task Progress Notes - User must be assigned to the task or be admin
  public query ({ caller }) func getTaskProgressNotes(taskId : Nat) : async [ProgressNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress notes");
    };

    // Check if admin or assigned to task
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAssigned = isUserAssignedToTask(caller, taskId);

    if (not isAdmin and not isAssigned) {
      Runtime.trap("Unauthorized: You can only view notes for tasks assigned to you");
    };

    switch (progressNotes.get(taskId)) {
      case (null) { [] };
      case (?notesList) { notesList.toArray() };
    };
  };

  // Get All Users (Admin Only)
  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfileStore.values().toArray().sort();
  };

  // Get All Tasks by Status
  public query ({ caller }) func getAllTasksByStatus() : async [(TaskStatus, [Task])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    let statuses : List.List<(TaskStatus, [Task])> = List.empty();

    func buildAllTasksByStatus(status : TaskStatus) {
      statuses.add((status, tasks.values().toArray().filter(func(task) { task.status == status })));
    };

    buildAllTasksByStatus(#inProcessAudio);
    buildAllTasksByStatus(#inProcessVideo);
    buildAllTasksByStatus(#audioReadyToRelease);
    buildAllTasksByStatus(#videoReadyToRelease);
    buildAllTasksByStatus(#readyToRelease);
    buildAllTasksByStatus(#pendingToRelease);

    statuses.toArray();
  };

  // Get All Tasks By Section (Tracker) - Requires user permission
  public query ({ caller }) func getAllTrackerTasksBySection() : async [TaskAssignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tracker tasks");
    };

    let allAssignments = List.empty<TaskAssignment>();

    for ((taskId, task) in tasks.entries()) {
      let notes = switch (progressNotes.get(taskId)) {
        case (null) { [] };
        case (?notesList) { notesList.toArray() };
      };
      allAssignments.add({ task; notes });
    };

    let allTasks = allAssignments.toArray();

    // First, sort by BookSection
    let sortedBySection = allTasks.sort(TaskAssignment.compareByBookSection);

    // Then, sort by book
    let sortedByBook = sortedBySection.sort(
      TaskAssignment.compareByBook
    );

    // Finally, sort by chapter within each book
    let sortedByChapter = sortedByBook.sort(func(a, b) {
      switch (Text.compare(a.task.book.name, b.task.book.name)) {
        case (#equal) { TaskAssignment.compareByChapter(a, b) };
        case (other) { other };
      };
    });

    sortedByChapter;
  };

  public query ({ caller }) func getBooksBySection(section : BookSection) : async [Book] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view books");
    };
    books.values().toArray().filter(func(book) { book.section == section });
  };
};
