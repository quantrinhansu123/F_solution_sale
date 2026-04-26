import React, { useState, useEffect, useCallback } from 'react';
import { Settings2, Users2, Percent, Coins, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchSettingsUsers, type SettingsUserView } from '../../utils/crmDb';

const SettingsTab: React.FC = () => {
  const [policies, setPolicies] = useState({
    mkt: 10,
    sale: 20,
    sa: 10,
    product: 15,
    dev: 35,
    cs: 10
  });

  const [team, setTeam] = useState<SettingsUserView[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    setUsersError(null);
    void fetchSettingsUsers()
      .then((rows) => {
        setTeam(rows);
        setUsersLoading(false);
      })
      .catch((e: Error) => {
        setUsersError(e?.message || 'Không tải được bảng users.');
        setUsersLoading(false);
      });
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalPercent = Object.values(policies).reduce((a, b) => a + b, 0);

  const handleSavePolicies = () => {
    alert('Đã cập nhật chính sách mới thành công!');
  };

  return (
    <div className="space-y-4 pb-8 text-[13px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Policy Settings Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center text-indigo-600">
              <Percent size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Chính sách Thu nhập (%)</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(policies).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={value}
                      onChange={(e) => setPolicies({...policies, [key]: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 rounded-xl flex items-center justify-between border ${totalPercent === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                {totalPercent === 100 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                Tổng cấu hình:
              </div>
              <div className="text-base font-black">{totalPercent}%</div>
            </div>
          </div>
        </div>

        {/* Unit Price Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-50 rounded flex items-center justify-center text-amber-600">
              <Coins size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Đơn giá Cơ bản (VNĐ)</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn giá Lead (Qualified)</label>
              <div className="relative">
                <input type="text" defaultValue="30.000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">VNĐ</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí thực hiện Demo</label>
              <div className="relative">
                <input type="text" defaultValue="50.000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">VNĐ</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí AMC (Bảo trì/năm)</label>
              <div className="relative">
                <input type="text" defaultValue="1.000.000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">VNĐ</span>
              </div>
            </div>
            
            {/* Payout Rules */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-4">
                <Settings2 size={16} className="text-slate-400" />
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Quy tắc Giải ngân (60-20-20)</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="text-[9px] font-black text-indigo-400 uppercase mb-0.5">Coding</div>
                  <div className="text-base font-black text-indigo-700">60%</div>
                </div>
                <div className="flex-1 text-center p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-[9px] font-black text-blue-400 uppercase mb-0.5">UAT</div>
                  <div className="text-base font-black text-blue-700">20%</div>
                </div>
                <div className="flex-1 text-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[9px] font-black text-emerald-400 uppercase mb-0.5">Live</div>
                  <div className="text-base font-black text-emerald-700">20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
              <Users2 size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quản lý Thành viên</h3>
              <p className="text-[11px] text-slate-500">
                Đọc từ bảng <code className="text-[10px] font-mono text-slate-600">public.users</code> (cần quyền SELECT / RLS)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadUsers()}
            disabled={usersLoading}
            className="text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-all disabled:opacity-50"
            title="Tải lại danh sách"
          >
            <RefreshCw size={16} className={usersLoading ? 'animate-spin' : ''} />
            Tải lại
          </button>
        </div>
        {usersError && (
          <div className="px-4 py-3 text-[12px] text-red-700 bg-red-50 border-b border-red-100 flex items-center justify-between gap-2">
            <span>{usersError}</span>
            <button type="button" className="text-red-800 font-bold underline" onClick={() => loadUsers()}>
              Thử lại
            </button>
          </div>
        )}
        <div className="overflow-x-auto min-h-[120px]">
          {usersLoading && team.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-slate-500">Đang tải danh sách users…</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và Tên</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bộ phận</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {team.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[12px] text-slate-500">
                      {usersError ? '—' : 'Chưa có bản ghi nào hoặc bảng rỗng.'}
                    </td>
                  </tr>
                ) : (
                  team.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 font-bold text-slate-900 leading-tight">{member.name}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{member.email || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-100">
                          {member.dept}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            member.status === 'Active'
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button 
          onClick={handleSavePolicies}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          <Save size={16} />
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
