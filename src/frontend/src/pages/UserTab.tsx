import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  Save,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TaskAssignment } from "../backend";
import { StatusBadge } from "../components/StatusBadge";
import { getSectionLabel } from "../data/bibleBooks";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  BookSection,
  TaskStatus,
  useAddProgressNote,
  useCallerProfile,
  useMyTasks,
  useSaveProfile,
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

function TaskCard({
  assignment,
  index,
}: { assignment: TaskAssignment; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState<TaskStatus>(
    assignment.task.status,
  );
  const addNote = useAddProgressNote();
  const updateStatus = useUpdateTaskStatus();
  const taskNotes = assignment.notes;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await addNote.mutateAsync({
        taskId: BigInt(0),
        content: noteText.trim(),
      });
      toast.success("Note added!");
      setNoteText("");
    } catch {
      toast.error("Failed to add note.");
    }
  };

  const handleStatusChange = async (status: TaskStatus) => {
    setNewStatus(status);
    try {
      await updateStatus.mutateAsync({ id: BigInt(0), status });
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden card-hover"
      data-ocid={`user.tasks.item.${index}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">
                {assignment.task.book.name}
              </span>
              <span className="text-muted-foreground text-sm">
                Ch. {assignment.task.chapter.toString()}
              </span>
              <span className="capitalize text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {assignment.task.type}
              </span>
            </div>
            <StatusBadge status={assignment.task.status} />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={newStatus}
              onValueChange={(v) => handleStatusChange(v as TaskStatus)}
            >
              <SelectTrigger
                className="h-8 text-xs bg-input border-border w-40"
                data-ocid={`user.tasks.status.select.${index}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground"
              data-ocid={`user.tasks.expand.button.${index}`}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Notes list */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Progress Notes
            </h4>
            {taskNotes.length === 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-ocid={`user.tasks.notes.empty_state.${index}`}
              >
                No notes yet. Add your first update below.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {taskNotes.map((note, ni) => (
                  <div
                    key={String(note.timestamp) + String(note.author)}
                    className="bg-secondary rounded p-3 text-sm"
                    data-ocid={`user.tasks.note.item.${ni + 1}`}
                  >
                    <p className="text-foreground">{note.content}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {new Date(
                        Number(note.timestamp) / 1_000_000,
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add note form */}
          <form onSubmit={handleAddNote} className="space-y-2">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your progress update..."
              className="bg-input border-border resize-none text-sm"
              rows={3}
              data-ocid={`user.tasks.note.textarea.${index}`}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!noteText.trim() || addNote.isPending}
              className="bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim text-xs font-semibold"
              data-ocid={`user.tasks.note.submit_button.${index}`}
            >
              {addNote.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Add Note"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export function UserTab() {
  const { identity } = useInternetIdentity();
  const { data: myTasks = [], isLoading } = useMyTasks();
  const { data: profile } = useCallerProfile();
  const saveProfile = useSaveProfile();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  if (!identity) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in"
        data-ocid="user.error_state"
      >
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Sign In Required
        </h2>
        <p className="text-muted-foreground">
          Please sign in to view your assigned tasks.
        </p>
      </div>
    );
  }

  // Group tasks by section then book
  const tasksBySection = myTasks.reduce(
    (acc, assignment) => {
      const section = assignment.task.book.section;
      if (!acc[section]) acc[section] = {};
      const book = assignment.task.book.name;
      if (!acc[section][book]) acc[section][book] = [];
      acc[section][book].push(assignment);
      return acc;
    },
    {} as Record<string, Record<string, TaskAssignment[]>>,
  );

  const sectionOrder = [
    BookSection.oldTestament,
    BookSection.psalmsAndProphets,
    BookSection.newTestament,
  ];

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await saveProfile.mutateAsync(newName.trim());
      toast.success("Name updated!");
      setEditingName(false);
    } catch {
      toast.error("Failed to update name.");
    }
  };

  let taskIndex = 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
        <User className="w-6 h-6 text-gold" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-sm">
            Your assigned Bible production tasks
          </p>
        </div>
      </div>

      {/* Profile section */}
      <section
        className="bg-card border border-border rounded-lg p-5 mb-8 animate-fade-in-up delay-100"
        data-ocid="user.profile.card"
      >
        <h2 className="font-semibold text-foreground mb-3">Profile</h2>
        {editingName ? (
          <form onSubmit={handleSaveName} className="flex items-center gap-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Your display name"
              className="bg-input border-border max-w-xs"
              autoFocus
              data-ocid="user.profile.name.input"
            />
            <Button
              type="submit"
              size="sm"
              disabled={saveProfile.isPending}
              className="bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim"
              data-ocid="user.profile.save.submit_button"
            >
              {saveProfile.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingName(false)}
              data-ocid="user.profile.cancel.button"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {profile?.name ?? "Unnamed User"}
              </div>
              <div className="text-muted-foreground text-xs">
                {identity.getPrincipal().toString().slice(0, 20)}...
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewName(profile?.name ?? "");
                setEditingName(true);
              }}
              className="ml-auto text-gold hover:text-gold hover:bg-gold/10"
              data-ocid="user.profile.edit.button"
            >
              Edit Name
            </Button>
          </div>
        )}
      </section>

      {/* Principal ID */}
      <section className="bg-card border border-border rounded-lg p-4 mb-8 animate-fade-in-up delay-150">
        <Label className="text-muted-foreground text-xs">
          Your Principal ID (share with admin to get tasks assigned)
        </Label>
        <p className="text-foreground text-sm font-mono mt-1 break-all">
          {identity.getPrincipal().toString()}
        </p>
      </section>

      {/* Tasks */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="user.tasks.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : myTasks.length === 0 ? (
        <div
          className="text-center py-16 animate-fade-in"
          data-ocid="user.tasks.empty_state"
        >
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No Tasks Assigned
          </h3>
          <p className="text-muted-foreground">
            Share your Principal ID with the admin to receive task assignments.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sectionOrder.map((section) => {
            const books = tasksBySection[section];
            if (!books) return null;
            return (
              <section key={section} className="animate-fade-in-up">
                <div className="bg-panel-header rounded-lg px-4 py-2 mb-4">
                  <h2 className="font-semibold text-white">
                    {getSectionLabel(section)}
                  </h2>
                </div>
                {Object.entries(books).map(([book, assignments]) => (
                  <div key={book} className="mb-6">
                    <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {book}
                    </h3>
                    <div className="space-y-3">
                      {assignments.map((assignment) => {
                        taskIndex++;
                        return (
                          <TaskCard
                            key={taskIndex}
                            assignment={assignment}
                            index={taskIndex}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
