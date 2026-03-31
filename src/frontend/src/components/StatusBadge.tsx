import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "../backend";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> =
  {
    [TaskStatus.inProcessAudio]: {
      label: "In Process Audio",
      className:
        "bg-amber-900/40 text-amber-300 border-amber-700/50 status-in-process",
    },
    [TaskStatus.inProcessVideo]: {
      label: "In Process Video",
      className:
        "bg-amber-900/40 text-amber-300 border-amber-700/50 status-in-process",
    },
    [TaskStatus.audioReadyToRelease]: {
      label: "Audio Ready",
      className: "bg-teal-900/40 text-teal-300 border-teal-700/50",
    },
    [TaskStatus.videoReadyToRelease]: {
      label: "Video Ready",
      className: "bg-sky-900/40 text-sky-300 border-sky-700/50",
    },
    [TaskStatus.readyToRelease]: {
      label: "Ready to Release",
      className: "bg-green-900/40 text-green-300 border-green-700/50",
    },
    [TaskStatus.pendingToRelease]: {
      label: "Pending Release",
      className: "bg-slate-700/40 text-slate-300 border-slate-600/50",
    },
  };

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

export { STATUS_CONFIG };
