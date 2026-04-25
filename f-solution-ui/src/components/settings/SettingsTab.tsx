import React, { useState } from 'react';
import { Settings2, Users2, Percent, Coins, Plus, Edit2, Save, CheckCircle, AlertCircle } from 'lucide-react';

const SettingsTab: React.FC = () => {
  const [policies, setPolicies] = useState({
    mkt: 10,
    sale: 20,
    sa: 10,
    product: 15,
    dev: 35,
    cs: 10
  });

  const totalPercent = Object.values(policies).reduce((a, b) => a + b, 0);

  const team = [
    { name: 'Nguyễn Văn A', email: 'a.nguyen@f-solution.vn', dept: 'Phát triển (Dev)', status: 'Active' },
    { name: 'Trần Thị B', email: 'b.tran@f-solution.vn', dept: 'Marketing', status: 'Active' },
    { name: 'Lê Văn C', email: 'c.le@f-solution.vn', dept: 'Sale', status: 'Inactive' },
    { name: 'Phạm Minh D', email: 'd.pham@f-solution.vn', dept: 'Triển khai (CS)', status: 'Active' },
  ];

  const handleSave = () => {
    alert('Đã cập nhật chính sách mới thành công!');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Policy Settings Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Percent size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Chính sách Thu nhập (%)</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              {Object.entries(policies).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{key.toUpperCase()}</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={value}
                      onChange={(e) => setPolicies({...policies, [key]: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-4 rounded-2xl flex items-center justify-between ${totalPercent === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {totalPercent === 100 ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                Tổng cộng cấu hình:
              </div>
              <div className="text-xl font-black">{totalPercent}%</div>
            </div>
          </div>
        </div>

        {/* Unit Price Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Coins size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Đơn giá Cơ bản (VNĐ)</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Đơn giá Lead (Qualified)</label>
              <div className="relative">
                <input type="text" defaultValue="30.000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VNĐ</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phí thực hiện Demo</label>
              <div className="relative">
                <input type="text" defaultValue="50.000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VNĐ</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phí AMC (Bảo trì/năm)</label>
              <div className="relative">
                <input type="text" defaultValue="1.000.000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VNĐ</span>
              </div>
            </div>
            
            {/* Payout Rules */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Settings2 size={18} className="text-slate-400" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Quy tắc Giải ngân (60-20-20)</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="text-xs font-black text-indigo-400 uppercase mb-1">Coding</div>
                  <div className="text-lg font-black text-indigo-700">60%</div>
                </div>
                <div className="flex-1 text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-xs font-black text-blue-400 uppercase mb-1">UAT</div>
                  <div className="text-lg font-black text-blue-700">20%</div>
                </div>
                <div className="flex-1 text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-xs font-black text-emerald-400 uppercase mb-1">Live</div>
                  <div className="text-lg font-black text-emerald-700">20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Users2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Quản lý Thành viên</h3>
              <p className="text-sm text-slate-500">Phân quyền và quản lý nhân sự hệ thống</p>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
            <Plus size={18} />
            Thêm thành viên
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Họ và Tên</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Bộ phận</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {team.map((member, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">{member.name}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">{member.email}</td>
                  <td className="px-8 py-5">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold">
                      {member.dept}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-base font-black flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Save size={20} />
          Lưu cấu hình hệ thống
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
