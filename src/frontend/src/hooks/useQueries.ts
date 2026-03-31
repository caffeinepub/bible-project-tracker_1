import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookSection,
  type TaskInput,
  TaskStatus,
  TaskType,
  type UserRole,
} from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin", actor],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTasksByStatus() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allTasksByStatus"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasksByStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrackerTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["trackerTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrackerTasksBySection();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUserProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTaskProgressNotes(taskId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["taskNotes", taskId?.toString()],
    queryFn: async () => {
      if (!actor || taskId === null) return [];
      return actor.getTaskProgressNotes(taskId);
    },
    enabled: !!actor && !isFetching && taskId !== null,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TaskInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTask(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTasks"] });
      qc.invalidateQueries({ queryKey: ["allTasksByStatus"] });
      qc.invalidateQueries({ queryKey: ["trackerTasks"] });
    },
  });
}

export function useAssignTaskToUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      input,
    }: { user: Principal; input: TaskInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignTaskToUser(user, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTasks"] });
      qc.invalidateQueries({ queryKey: ["trackerTasks"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: TaskStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTaskStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTasks"] });
      qc.invalidateQueries({ queryKey: ["myTasks"] });
      qc.invalidateQueries({ queryKey: ["allTasksByStatus"] });
      qc.invalidateQueries({ queryKey: ["trackerTasks"] });
    },
  });
}

export function useAddProgressNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      content,
    }: { taskId: bigint; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProgressNote(taskId, content);
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: ["taskNotes", taskId.toString()] });
      qc.invalidateQueries({ queryKey: ["myTasks"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
      qc.invalidateQueries({ queryKey: ["allUserProfiles"] });
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUserProfiles"] });
    },
  });
}

export { TaskStatus, TaskType, BookSection };
