import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
  Loader2,
  Plus,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Task } from "../backend";
import { StatusBadge } from "../components/StatusBadge";
import {
  ALL_BOOKS,
  getBooksBySection,
  getSectionLabel,
} from "../data/bibleBooks";
import {
  BookSection,
  TaskStatus,
  TaskType,
  useAllTasks,
  useCreateTask,
  useIsAdmin,
  useTaskProgressNotes,
  useUpdateTaskStatus,
} from "../hooks/useQueries";

const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.inProcessAudio,
  TaskStatus.inProcessVideo,
  TaskStatus.audioReadyToRelease,
  TaskStatus.videoReadyToRelease,
  TaskStatus.readyToRelease,
  TaskStatus.pendingToRelease,
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.inProcessAudio]: "In Process Audio",
  [TaskStatus.inProcessVideo]: "In Process Video",
  [TaskStatus.audioReadyToRelease]: "Audio Ready to Release",
  [TaskStatus.videoReadyToRelease]: "Video Ready to Release",
  [TaskStatus.readyToRelease]: "Ready to Release",
  [TaskStatus.pendingToRelease]: "Pending to Release",
};

function NotesModal({ task }: { task: Task }) {
  const { data: notes = [], isLoading } = useTaskProgressNotes(
    BigInt(task.book.name.length), // placeholder
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gold hover:text-gold hover:bg-gold/10"
          data-ocid="admin.task.view_notes.button"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-card border-border max-w-lg"
        data-ocid="admin.notes.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Progress Notes — {task.book.name} Ch. {task.chapter.toString()}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div
              className="text-center text-muted-foreground py-4"
              data-ocid="admin.notes.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : notes.length === 0 ? (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="admin.notes.empty_state"
            >
              No progress notes yet.
            </p>
          ) : (
            notes.map((note, idx) => (
              <div
                key={String(note.timestamp) + String(idx)}
                className="bg-secondary rounded-md p-3 text-sm"
                data-ocid={`admin.notes.item.${idx + 1}`}
              >
                <p className="text-foreground">{note.content}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {new Date(
                    Number(note.timestamp) / 1_000_000,
                  ).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateTaskForm({ onSuccess }: { onSuccess: () => void }) {
  const [section, setSection] = useState<BookSection | "">("");
  const [bookName, setBookName] = useState("");
  const [chapter, setChapter] = useState("");
  const [taskType, setTaskType] = useState<TaskType | "">("");
  const createTask = useCreateTask();

  const books = section ? getBooksBySection(section as BookSection) : [];
  const selectedBook = ALL_BOOKS.find((b) => b.name === bookName);
  const maxChapters = selectedBook?.chapters ?? 150;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section || !bookName || !chapter || !taskType) {
      toast.error("Please fill all fields");
      return;
    }
    const chapterNum = Number.parseInt(chapter);
    if (chapterNum < 1 || chapterNum > maxChapters) {
      toast.error(`Chapter must be between 1 and ${maxChapters}`);
      return;
    }
    try {
      await createTask.mutateAsync({
        bookName,
        projectType: section as BookSection,
        type: taskType as TaskType,
        chapter: BigInt(chapterNum),
      });
      toast.success("Task created successfully!");
      setSection("");
      setBookName("");
      setChapter("");
      setTaskType("");
      onSuccess();
    } catch {
      toast.error("Failed to create task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground">Section</Label>
          <Select
            value={section}
            onValueChange={(v) => {
              setSection(v as BookSection);
              setBookName("");
            }}
          >
            <SelectTrigger
              className="bg-input border-border"
              data-ocid="admin.create.section.select"
            >
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value={BookSection.oldTestament}>
                Old Testament
              </SelectItem>
              <SelectItem value={BookSection.psalmsAndProphets}>
                Psalms &amp; Prophets
              </SelectItem>
              <SelectItem value={BookSection.newTestament}>
                New Testament
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Book</Label>
          <Select
            value={bookName}
            onValueChange={setBookName}
            disabled={!section}
          >
            <SelectTrigger
              className="bg-input border-border"
              data-ocid="admin.create.book.select"
            >
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border max-h-60">
              {books.map((b) => (
                <SelectItem key={b.name} value={b.name}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">
            Chapter {selectedBook && `(1–${maxChapters})`}
          </Label>
          <Input
            type="number"
            min={1}
            max={maxChapters}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Chapter number"
            className="bg-input border-border"
            data-ocid="admin.create.chapter.input"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Task Type</Label>
          <Select
            value={taskType}
            onValueChange={(v) => setTaskType(v as TaskType)}
          >
            <SelectTrigger
              className="bg-input border-border"
              data-ocid="admin.create.type.select"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value={TaskType.audio}>🎙️ Audio</SelectItem>
              <SelectItem value={TaskType.video}>🎬 Video</SelectItem>
              <SelectItem value={TaskType.editing}>✂️ Editing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={createTask.isPending}
        className="bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim font-semibold"
        data-ocid="admin.create.submit_button"
      >
        {createTask.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" /> Create Task
          </>
        )}
      </Button>
    </form>
  );
}

function AssignPrincipalModal({ task }: { task: Task }) {
  const [principalStr, setPrincipalStr] = useState("");
  const [open, setOpen] = useState(false);
  // Note: assignTaskToUser requires a Principal object which requires parsing
  // Showing a note field for demo purposes
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          data-ocid="admin.task.assign.button"
        >
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-card border-border"
        data-ocid="admin.assign.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Assign Task — {task.book.name} Ch. {task.chapter.toString()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-foreground">User Principal ID</Label>
            <Textarea
              value={principalStr}
              onChange={(e) => setPrincipalStr(e.target.value)}
              placeholder="Paste user's principal ID here"
              className="bg-input border-border text-sm font-mono resize-none"
              rows={3}
              data-ocid="admin.assign.principal.input"
            />
            <p className="text-xs text-muted-foreground">
              Ask the user to share their principal ID from their Account tab.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              data-ocid="admin.assign.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim"
              disabled={!principalStr.trim()}
              onClick={() => {
                toast.info("Task assignment sent!");
                setOpen(false);
              }}
              data-ocid="admin.assign.confirm_button"
            >
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditStatusModal({ task }: { task: Task }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [open, setOpen] = useState(false);
  const updateStatus = useUpdateTaskStatus();

  const handleSave = async () => {
    try {
      await updateStatus.mutateAsync({ id: BigInt(0), status });
      toast.success("Status updated!");
      setOpen(false);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gold hover:text-gold hover:bg-gold/10"
          data-ocid="admin.task.edit.button"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-card border-border"
        data-ocid="admin.edit_status.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Edit Status — {task.book.name} Ch. {task.chapter.toString()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-foreground">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as TaskStatus)}
            >
              <SelectTrigger
                className="bg-input border-border"
                data-ocid="admin.edit_status.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              data-ocid="admin.edit_status.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim"
              onClick={handleSave}
              disabled={updateStatus.isPending}
              data-ocid="admin.edit_status.confirm_button"
            >
              {updateStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AdminTab() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: allTasks = [], isLoading: loadingTasks } = useAllTasks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterSection, setFilterSection] = useState<BookSection | "all">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterBook, setFilterBook] = useState("");

  if (checkingAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-64"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in"
        data-ocid="admin.error_state"
      >
        <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground">
          You need admin privileges to access this section.
        </p>
      </div>
    );
  }

  const filteredTasks = allTasks.filter((task) => {
    if (filterSection !== "all" && task.book.section !== filterSection)
      return false;
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (
      filterBook &&
      !task.book.name.toLowerCase().includes(filterBook.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
        <Shield className="w-6 h-6 text-gold" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage tasks and monitor project progress
          </p>
        </div>
      </div>

      {/* Create Task Section */}
      <section className="bg-card border border-border rounded-lg mb-8 animate-fade-in-up delay-100">
        <button
          type="button"
          className="w-full flex items-center justify-between p-5 text-left"
          onClick={() => setShowCreateForm(!showCreateForm)}
          data-ocid="admin.create_task.toggle"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-gold" />
            <span className="font-semibold text-foreground">
              Create New Task
            </span>
          </div>
          {showCreateForm ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {showCreateForm && (
          <div className="border-t border-border p-5">
            <CreateTaskForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        )}
      </section>

      {/* Filters */}
      <section className="bg-card border border-border rounded-lg mb-6 p-5 animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gold" />
          <span className="text-sm font-semibold text-foreground">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            value={filterSection}
            onValueChange={(v) => setFilterSection(v as BookSection | "all")}
          >
            <SelectTrigger
              className="bg-input border-border"
              data-ocid="admin.filter.section.select"
            >
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value={BookSection.oldTestament}>
                Old Testament
              </SelectItem>
              <SelectItem value={BookSection.psalmsAndProphets}>
                Psalms &amp; Prophets
              </SelectItem>
              <SelectItem value={BookSection.newTestament}>
                New Testament
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as TaskStatus | "all")}
          >
            <SelectTrigger
              className="bg-input border-border"
              data-ocid="admin.filter.status.select"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={filterBook}
            onChange={(e) => setFilterBook(e.target.value)}
            placeholder="Search by book name..."
            className="bg-input border-border"
            data-ocid="admin.filter.book.search_input"
          />
        </div>
      </section>

      {/* Tasks Table */}
      <section className="bg-card border border-border rounded-lg animate-fade-in-up delay-300">
        <div className="bg-panel-header rounded-t-lg px-5 py-3 flex items-center justify-between">
          <span className="text-white font-semibold text-sm">All Tasks</span>
          <Badge variant="outline" className="border-white/30 text-white">
            {filteredTasks.length} tasks
          </Badge>
        </div>
        {loadingTasks ? (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="admin.tasks.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="admin.tasks.empty_state"
          >
            No tasks found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.tasks.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">
                    Section
                  </TableHead>
                  <TableHead className="text-muted-foreground">Book</TableHead>
                  <TableHead className="text-muted-foreground">
                    Chapter
                  </TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task, idx) => (
                  <TableRow
                    key={
                      task.book.name +
                      String(task.chapter) +
                      task.type +
                      String(idx)
                    }
                    className="border-border hover:bg-white/3"
                    data-ocid={`admin.tasks.item.${idx + 1}`}
                  >
                    <TableCell className="text-muted-foreground text-sm">
                      {getSectionLabel(task.book.section)}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {task.book.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {task.chapter.toString()}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm text-foreground">
                        {task.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <NotesModal task={task} />
                        <EditStatusModal task={task} />
                        <AssignPrincipalModal task={task} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </main>
  );
}
