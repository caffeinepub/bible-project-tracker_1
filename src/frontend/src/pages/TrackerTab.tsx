import { Badge } from "@/components/ui/badge";
import { BarChart3, Loader2 } from "lucide-react";
import { TaskStatus } from "../backend";
import { StatusBadge } from "../components/StatusBadge";
import { getSectionLabel } from "../data/bibleBooks";
import { useTrackerTasks } from "../hooks/useQueries";

const STATUS_COLUMNS: {
  status: TaskStatus;
  label: string;
  icon: string;
  colorClass: string;
}[] = [
  {
    status: TaskStatus.inProcessAudio,
    label: "In Process Audio",
    icon: "🎙️",
    colorClass: "border-amber-700/40 bg-amber-900/10",
  },
  {
    status: TaskStatus.inProcessVideo,
    label: "In Process Video",
    icon: "🎬",
    colorClass: "border-orange-700/40 bg-orange-900/10",
  },
  {
    status: TaskStatus.audioReadyToRelease,
    label: "Audio Ready",
    icon: "✅",
    colorClass: "border-teal-700/40 bg-teal-900/10",
  },
  {
    status: TaskStatus.videoReadyToRelease,
    label: "Video Ready",
    icon: "🎞️",
    colorClass: "border-sky-700/40 bg-sky-900/10",
  },
  {
    status: TaskStatus.readyToRelease,
    label: "Ready to Release",
    icon: "🚀",
    colorClass: "border-green-700/40 bg-green-900/10",
  },
  {
    status: TaskStatus.pendingToRelease,
    label: "Pending Release",
    icon: "⏳",
    colorClass: "border-slate-600/40 bg-slate-800/20",
  },
];

export function TrackerTab() {
  const { data: trackerTasks = [], isLoading } = useTrackerTasks();

  // Group by status
  const tasksByStatus: Record<TaskStatus, typeof trackerTasks> = {
    [TaskStatus.inProcessAudio]: [],
    [TaskStatus.inProcessVideo]: [],
    [TaskStatus.audioReadyToRelease]: [],
    [TaskStatus.videoReadyToRelease]: [],
    [TaskStatus.readyToRelease]: [],
    [TaskStatus.pendingToRelease]: [],
  };

  for (const assignment of trackerTasks) {
    const s = assignment.task.status;
    if (s in tasksByStatus) {
      tasksByStatus[s].push(assignment);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
        <BarChart3 className="w-6 h-6 text-gold" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Production Tracker
          </h1>
          <p className="text-muted-foreground text-sm">
            Real-time status of all Bible production tasks
          </p>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up delay-100">
        {STATUS_COLUMNS.map((col) => (
          <div
            key={col.status}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${col.colorClass}`}
            data-ocid={`tracker.${col.status}.badge`}
          >
            <span>{col.icon}</span>
            <span className="text-sm text-foreground">{col.label}</span>
            <Badge
              variant="outline"
              className="border-white/20 text-foreground min-w-[1.5rem] text-center"
            >
              {tasksByStatus[col.status].length}
            </Badge>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="tracker.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATUS_COLUMNS.map((col, colIdx) => (
            <div
              key={col.status}
              className={`rounded-lg border ${col.colorClass} overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${0.15 + colIdx * 0.08}s` }}
              data-ocid={`tracker.${col.status}.panel`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{col.icon}</span>
                  <span className="font-semibold text-foreground text-sm">
                    {col.label}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-white/20 text-foreground"
                >
                  {tasksByStatus[col.status].length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="p-3 space-y-2 min-h-32">
                {tasksByStatus[col.status].length === 0 ? (
                  <div
                    className="text-center text-muted-foreground text-sm py-6"
                    data-ocid={`tracker.${col.status}.empty_state`}
                  >
                    No tasks
                  </div>
                ) : (
                  tasksByStatus[col.status].map((assignment, idx) => (
                    <div
                      key={
                        assignment.task.book.name +
                        String(assignment.task.chapter) +
                        assignment.task.type +
                        String(col.status)
                      }
                      className="bg-card border border-border rounded-md p-3 card-hover"
                      data-ocid={`tracker.${col.status}.item.${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {assignment.task.book.name}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Chapter {assignment.task.chapter.toString()} ·{" "}
                            <span className="capitalize">
                              {assignment.task.type}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-xs mt-0.5">
                            {getSectionLabel(assignment.task.book.section)}
                          </div>
                        </div>
                        <StatusBadge status={assignment.task.status} />
                      </div>
                      {assignment.notes.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-muted-foreground text-xs">
                            {assignment.notes.length} note
                            {assignment.notes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
