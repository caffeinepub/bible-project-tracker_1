import {
  BookOpen,
  CheckCircle,
  Clock,
  Edit3,
  Music,
  Star,
  Video,
} from "lucide-react";
import { TaskStatus } from "../backend";
import { useAllTasks, useAllTasksByStatus } from "../hooks/useQueries";

const BIBLE_STORIES = [
  {
    icon: "🌍",
    title: "The Creation",
    reference: "Genesis 1–2",
    description:
      "In the beginning, God created the heavens and the earth in six days, forming light, sky, land, sea, and every living creature. On the seventh day He rested, declaring all He had made very good.",
  },
  {
    icon: "🌊",
    title: "Noah's Ark",
    reference: "Genesis 6–9",
    description:
      "God commanded righteous Noah to build a great ark and fill it with every kind of animal. Forty days of rain covered the earth, and when the waters receded, a rainbow was placed in the sky as God's covenant promise.",
  },
  {
    icon: "🔥",
    title: "Moses & the Exodus",
    reference: "Exodus 3–14",
    description:
      "God appeared to Moses in a burning bush, calling him to lead Israel out of Egyptian slavery. After ten mighty plagues, Pharaoh relented and the Israelites crossed the Red Sea on dry ground to freedom.",
  },
  {
    icon: "⚔️",
    title: "David & Goliath",
    reference: "1 Samuel 17",
    description:
      "Young shepherd David stepped forward when no Israelite soldier dared face the giant Philistine warrior Goliath. Armed with only a sling and five smooth stones — and unshakeable faith — he slew the giant with a single stone.",
  },
  {
    icon: "⭐",
    title: "Birth of Jesus",
    reference: "Luke 2",
    description:
      "Mary and Joseph traveled to Bethlehem where Jesus was born in a humble manger. Angels announced His birth to shepherds in the fields, and wise men from the East followed a star to bring gifts to the newborn King.",
  },
  {
    icon: "✝️",
    title: "The Resurrection",
    reference: "John 20",
    description:
      "Three days after His crucifixion, Jesus rose from the dead — conquering sin and death. Mary Magdalene was first to see the empty tomb, and Jesus appeared to His disciples, fulfilling every prophecy and proving He is Lord.",
  },
  {
    icon: "🌊",
    title: "Jonah & the Whale",
    reference: "Jonah 1–2",
    description:
      "When Jonah fled God's call to preach to Nineveh, a violent storm arose at sea. He was swallowed by a great fish and remained inside three days, praying fervently until God commanded the fish to release him onto dry land.",
  },
  {
    icon: "🦁",
    title: "Daniel in the Lions' Den",
    reference: "Daniel 6",
    description:
      "Daniel continued praying to God despite a royal decree forbidding it. Thrown into a den of hungry lions for his faithfulness, he emerged unharmed the next morning — God had sent an angel to shut the lions' mouths.",
  },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.inProcessAudio]: "In Process Audio",
  [TaskStatus.inProcessVideo]: "In Process Video",
  [TaskStatus.audioReadyToRelease]: "Audio Ready",
  [TaskStatus.videoReadyToRelease]: "Video Ready",
  [TaskStatus.readyToRelease]: "Ready to Release",
  [TaskStatus.pendingToRelease]: "Pending Release",
};

export function Dashboard() {
  const { data: allTasks = [] } = useAllTasks();
  const { data: tasksByStatus = [] } = useAllTasksByStatus();

  const statusCounts: Record<string, number> = {};
  for (const [status, tasks] of tasksByStatus) {
    statusCounts[status] = tasks.length;
  }

  const stats = [
    {
      label: "Total Tasks",
      value: allTasks.length,
      icon: BookOpen,
      color: "text-gold",
    },
    {
      label: "Audio Tasks",
      value: allTasks.filter((t) => t.type === "audio").length,
      icon: Music,
      color: "text-amber-400",
    },
    {
      label: "Video Tasks",
      value: allTasks.filter((t) => t.type === "video").length,
      icon: Video,
      color: "text-sky-400",
    },
    {
      label: "Editing Tasks",
      value: allTasks.filter((t) => t.type === "editing").length,
      icon: Edit3,
      color: "text-teal-400",
    },
    {
      label: "Ready to Release",
      value: statusCounts[TaskStatus.readyToRelease] ?? 0,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      label: "In Progress",
      value:
        (statusCounts[TaskStatus.inProcessAudio] ?? 0) +
        (statusCounts[TaskStatus.inProcessVideo] ?? 0),
      icon: Clock,
      color: "text-orange-400",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/scripture-hero.dim_1400x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "420px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0_0/0.7)] via-[oklch(0.12_0_0/0.5)] to-[oklch(0.12_0_0)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">
            Bible Production Management
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
            Scripture<span className="text-gold">Flow</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
            Track every audio recording, video production, and editing task
            across the Old Testament, Psalms &amp; Prophets, and New Testament
            with precision and clarity.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <section className="mb-16 animate-fade-in-up delay-300">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            Project Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-lg p-4 text-center card-hover animate-count-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div
                  className={`text-3xl font-bold font-display ${stat.color} mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status Breakdown */}
        {tasksByStatus.length > 0 && (
          <section className="mb-16 animate-fade-in-up delay-400">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Status Breakdown
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tasksByStatus.map(([status, tasks]) => (
                <div
                  key={status}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">
                      {STATUS_LABELS[status]}
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {tasks.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-gold font-bold">{tasks.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bible Stories */}
        <section className="animate-fade-in-up delay-500">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-gold" />
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Famous Bible Stories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BIBLE_STORIES.map((story, i) => (
              <article
                key={story.title}
                className="bg-card border border-border rounded-lg p-5 card-hover cursor-default group animate-fade-in-up"
                style={{ animationDelay: `${0.5 + i * 0.07}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {story.icon}
                </div>
                <div className="text-gold text-xs font-semibold tracking-wide uppercase mb-1">
                  {story.reference}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {story.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                  {story.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
