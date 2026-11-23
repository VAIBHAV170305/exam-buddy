import React, { useState, useEffect } from 'react';
import { plannerAPI } from '../services/api';
import {
  CalendarCheck2,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Calendar,
  AlertCircle,
  Award
} from 'lucide-react';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Operating Systems');
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('study');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await plannerAPI.listTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await plannerAPI.updateTask(taskId, { is_completed: !currentStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await plannerAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await plannerAPI.createTask({
        title: newTaskTitle.trim(),
        subject: newTaskSubject,
        duration_minutes: parseInt(newTaskDuration),
        priority: newTaskPriority,
        category: newTaskCategory,
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-purple-600" />
            <span>Personalized Study Planner</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build your study schedule, set target revision sessions, and track daily academic tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          aria-label="Add new study goal"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Study Goal</span>
        </button>
      </div>

      {/* Progress Metric Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            Daily Study Progress
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            {completedCount} of {tasks.length} Goals Completed
          </h3>
          <p className="text-xs text-slate-600">
            Keep your momentum strong for upcoming semester examinations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-36 bg-slate-100 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Daily study progress">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-sm font-extrabold text-purple-700">{progressPercent}%</span>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Today's Study Checklist</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading schedule...</div>
        ) : tasks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/70 px-3 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id, task.is_completed)}
                    aria-label={task.is_completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as completed`}
                    className="text-slate-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
                  >
                    {task.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 fill-purple-100" aria-hidden="true" />
                    ) : (
                      <Circle className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>

                  <div>
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        task.is_completed ? 'line-through text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
                      <span className="font-semibold text-slate-800">{task.subject}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                        {task.duration_minutes} min
                      </span>
                      <span>•</span>
                      <span className={`capitalize font-semibold ${
                        task.priority === 'high' ? 'text-rose-600' : 'text-slate-600'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label={`Delete study goal "${task.title}"`}
                  className="opacity-70 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-slate-500">
            No study goals scheduled for today. Click 'Add Study Goal' above.
          </p>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-planner-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 id="modal-planner-title" className="font-bold text-slate-900 text-base">Schedule New Study Goal</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close add goal modal"
                className="text-slate-500 hover:text-slate-800 text-sm font-semibold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label htmlFor="planner-task-title" className="block text-xs font-bold text-slate-800 mb-1">Goal / Task Title</label>
                <input
                  id="planner-task-title"
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 5 Banker's Algorithm numericals"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="planner-task-subject" className="block text-xs font-bold text-slate-800 mb-1">Subject</label>
                  <input
                    id="planner-task-subject"
                    type="text"
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="planner-task-duration" className="block text-xs font-bold text-slate-800 mb-1">Duration (Min)</label>
                  <input
                    id="planner-task-duration"
                    type="number"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="planner-task-priority" className="block text-xs font-bold text-slate-800 mb-1">Priority</label>
                  <select
                    id="planner-task-priority"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="planner-task-category" className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    id="planner-task-category"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="study">Deep Study</option>
                    <option value="revision">Revision</option>
                    <option value="exam_practice">Mock Test Practice</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label="Save study goal to schedule"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {submitting ? 'Adding...' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
