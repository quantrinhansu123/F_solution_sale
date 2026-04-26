import React, { useState } from 'react';
import { Code2, GitPullRequest, DollarSign, CheckCircle2, Laptop, Clock, ShieldCheck, ExternalLink, Plus, Edit2, Trash2, X } from 'lucide-react';
import { mockDevTasks } from '../../data/ticketMockData';
import StatCard from '../StatCard';
import { formatVnd } from '../../utils/formatVnd';

const DevTaskTable: React.FC = () => {
  const [tasks, setTasks] = useState(mockDevTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    points: 1,
    prUrl: '',
    status: 'Chờ làm',
    disbursement: { coding: false, uat: false, live: false }
  });

  const totalPoints = tasks.reduce((acc, task) => acc + task.points, 0);
  const donePoints = tasks.filter(t => t.status === 'Hoàn thành').reduce((acc, t) => acc + t.points, 0);
  
  const totalIncome = totalPoints * 100000;
  const availableIncome = donePoints * 100000 * 0.6;
  const pendingIncome = (totalPoints * 100000) - availableIncome;

  const handleOpenModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        points: task.points,
        prUrl: task.prUrl || '',
        status: task.status,
        disbursement: { ...task.disbursement }
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        points: 1,
        prUrl: '',
        status: 'Chờ làm',
        disbursement: { coding: false, uat: false, live: false }
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...formData } : t));
    } else {
      const newTask = {
        ...formData,
        id: `T${Date.now().toString().slice(-4)}`
      };
      setTasks([newTask, ...tasks]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa task này?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-4 text-[13px]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Tổng Point đã nhận" 
          value={`${totalPoints} Pts`} 
          subValue="Tích lũy từ đầu tháng" 
          icon={Laptop} 
          color="bg-indigo-500" 
        />
        <StatCard 
          label="Thu nhập khả dụng (60%)" 
          value={formatVnd(availableIncome)} 
          subValue="Từ các Ticket đã Done" 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Quỹ treo (40%)" 
          value={formatVnd(pendingIncome)} 
          subValue="Chờ UAT & Go-live" 
          icon={Clock} 
          color="bg-amber-500" 
          variant="dark"
        />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Danh sách công việc Lập trình</h3>
            <p className="text-[11px] text-slate-500">Quản lý task, link PR và tiến độ giải ngân</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500">Tỉ giá:</span>
              <span className="text-[12px] font-black text-indigo-600">1P = 100K</span>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Thêm Task
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket & ID</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Point</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bằng chứng (PR)</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giải ngân</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Code2 size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{task.title}</p>
                        <p className="text-[9px] text-slate-400 font-mono">#{task.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="bg-slate-50 text-slate-900 px-2 py-0.5 rounded font-black text-[12px] border border-slate-200">
                      {task.points}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {task.prUrl ? (
                      <a 
                        href={task.prUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[12px] font-semibold underline underline-offset-2"
                      >
                        <GitPullRequest size={12} />
                        PR
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <div className="text-red-400 text-[9px] font-bold flex items-center gap-1 italic opacity-60">
                        <GitPullRequest size={12} />
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 w-48">
                    <div className="flex items-center gap-0.5">
                      <div className={`h-1.5 flex-1 rounded-sm ${task.disbursement.coding ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
                      <div className={`h-1.5 flex-1 rounded-sm ${task.disbursement.uat ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
                      <div className={`h-1.5 flex-1 rounded-sm ${task.disbursement.live ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={`text-[7px] font-black ${task.disbursement.coding ? 'text-indigo-600' : 'text-slate-300'}`}>60%</span>
                      <span className={`text-[7px] font-black ${task.disbursement.uat ? 'text-indigo-600' : 'text-slate-300'}`}>20%</span>
                      <span className={`text-[7px] font-black ${task.disbursement.live ? 'text-indigo-600' : 'text-slate-300'}`}>20%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      task.status === 'Hoàn thành' ? 'bg-green-50 text-green-700 border-green-100' :
                      task.status === 'Kiểm tra' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      task.status === 'Đang làm' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="flex items-center gap-1 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(task)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                          title="Sửa"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {task.status === 'Chờ làm' ? (
                        <button className="bg-slate-900 text-white px-2 py-1 rounded text-[11px] font-bold hover:bg-slate-800 transition-all ml-1">
                          Nhận
                        </button>
                      ) : task.status === 'Đang làm' ? (
                        <button className="bg-indigo-600 text-white px-2 py-1 rounded text-[11px] font-bold hover:bg-indigo-700 transition-all ml-1" disabled={!task.prUrl}>
                          Gửi
                        </button>
                      ) : task.status === 'Kiểm tra' ? (
                        <div className="text-purple-600 text-[11px] font-bold flex items-center justify-end gap-1 ml-1">
                          <ShieldCheck size={12} />
                          Kiểm tra
                        </div>
                      ) : (
                        <div className="text-green-600 text-[11px] font-bold flex items-center justify-end gap-1 ml-1">
                          <CheckCircle2 size={12} />
                          Hoàn thành
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTask ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Tiêu đề Task</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Fix bug login UI"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Points</label>
                  <input
                    required
                    type="number"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                    value={formData.points}
                    onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Trạng thái</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Pull Request URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.prUrl}
                  onChange={e => setFormData({ ...formData, prUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Giải ngân (%)</label>
                <div className="flex gap-4 px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.disbursement.coding}
                      onChange={e => setFormData({ ...formData, disbursement: { ...formData.disbursement, coding: e.target.checked } })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[12px] font-bold text-slate-700">Coding (60%)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.disbursement.uat}
                      onChange={e => setFormData({ ...formData, disbursement: { ...formData.disbursement, uat: e.target.checked } })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[12px] font-bold text-slate-700">UAT (20%)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.disbursement.live}
                      onChange={e => setFormData({ ...formData, disbursement: { ...formData.disbursement, live: e.target.checked } })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[12px] font-bold text-slate-700">Live (20%)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all border border-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all"
                >
                  {editingTask ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTaskTable;
