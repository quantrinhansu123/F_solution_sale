import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Printer } from 'lucide-react';
import { fetchQuotationById, quotationStatusToLabel, type QuotationView } from '../utils/crmDb';
import './QuotationBaogiaPage.css';

function formatMoneyVi(n: number) {
  return Math.round(n).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
}

function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase();
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

const QuotationBaogiaPage: React.FC = () => {
  const [search] = useSearchParams();
  const id = search.get('id')?.trim() || '';
  const autoPrint = search.get('autoprint') === '1';

  const [q, setQ] = useState<QuotationView | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setQ(null);
      return;
    }
    let ok = true;
    setQ(undefined);
    setErr(null);
    fetchQuotationById(id)
      .then((row) => {
        if (!ok) return;
        setQ(row);
        if (!row) setErr('Không tìm thấy báo giá.');
      })
      .catch((e) => {
        if (!ok) return;
        console.error(e);
        setErr('Không tải được dữ liệu. Kiểm tra kết nối / quyền truy cập Supabase.');
        setQ(null);
      });
    return () => {
      ok = false;
    };
  }, [id]);

  useEffect(() => {
    if (q && typeof q === 'object') {
      document.title = `${q.code} — Báo giá F-Solution`;
    } else {
      document.title = 'Báo giá F-Solution';
    }
  }, [q]);

  useEffect(() => {
    if (!autoPrint || !q) return;
    const t = window.setTimeout(() => {
      window.print();
    }, 250);
    return () => window.clearTimeout(t);
  }, [autoPrint, q]);

  const titleDoc = 'Báo giá dịch vụ — F-SOLUTION';

  const viewModel = useMemo(() => {
    if (!q) return null;
    const created = q.createdAt ? new Date(q.createdAt) : new Date();
    const dateStr = created.toLocaleDateString('vi-VN');
    const deadline = addDays(created, 30).toLocaleDateString('vi-VN');
    const clientLine = [q.customerName, q.customerPhone && `SĐT: ${q.customerPhone}`]
      .filter(Boolean)
      .join(' | ');
    const intro =
      q.notes?.trim() ||
      'Kính gửi Quý khách hàng, Công ty Cổ phần F-Solution Technology trân trọng gửi Báo giá dịch vụ theo nội dung trao đổi.';
    const solution = q.title?.trim() || 'Theo mô tả công việc và phạm vi đã thống nhất.';
    const subtotal = Math.max(0, q.amount);
    const paymentPhases = [
      { phase: 'Đợt 1', timing: 'Sau ký hợp đồng / tạm ứng', val: '50%', desc: 'Thanh toán 50% giá trị' },
      { phase: 'Đợt 2', timing: 'Nghiệm thu bàn giao', val: '50%', desc: 'Thanh toán 50% còn lại' },
    ] as const;
    const selIdx = 0;
    const total = subtotal;
    const pct = 0.5;
    const amtQR = Math.round(total * pct);
    const clientKey = removeVietnameseTones(q.customerName || 'KH').replace(/\W/g, '') || 'KH';
    const transferContent = `${clientKey} DOT ${selIdx + 1}`;
    const qrSrc = `https://img.vietqr.io/image/vietinbank-100001692967-compact.png?amount=${amtQR}&addInfo=${encodeURIComponent(transferContent)}`;
    const timeline = [
      { phase: 'Khởi động', work: 'Kick-off & bàn giao yêu cầu' },
      { phase: 'Triển khai', work: 'Phát triển theo phạm vi BG' },
      { phase: 'Nghiệm thu', work: 'UAT & bàn giao sản phẩm' },
    ];
    return {
      q,
      dateStr,
      deadline,
      clientLine: clientLine || '—',
      intro,
      solution,
      subtotal,
      total,
      paymentPhases: [...paymentPhases],
      qrSrc,
      transferContent,
      timeline,
    };
  }, [q]);

  if (q === undefined && id) {
    return (
      <div id="q-baogia-print-root">
        <div className="q-state-msg">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-2" />
          <p>Đang tải báo giá…</p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div id="q-baogia-print-root">
        <div className="q-baogia-toolbar">
          <Link to="/crm/quotes">← Báo giá (CRM)</Link>
        </div>
        <div className="q-state-msg">
          <p className="font-bold text-slate-800 mb-2">Chưa chọn báo giá</p>
          <p className="text-sm mb-3">
            Mở từ màn <strong>Báo giá</strong> bằng nút <strong>In / mẫu A4</strong> trên từng dòng, hoặc dùng URL:
            <code className="block mt-2 text-xs bg-slate-100 p-2 rounded">/baogiafinal.html?id=(UUID)</code>
          </p>
          <Link to="/crm/quotes" className="text-indigo-600 font-bold">
            Về danh sách Báo giá
          </Link>
        </div>
      </div>
    );
  }

  if (err || !q) {
    return (
      <div id="q-baogia-print-root">
        <div className="q-baogia-toolbar">
          <Link to="/crm/quotes">← Báo giá (CRM)</Link>
        </div>
        <div className="q-state-msg">
          <p className="text-rose-600 font-bold mb-2">{err || 'Không tìm thấy báo giá.'}</p>
          <Link to="/crm/quotes" className="text-indigo-600 font-bold">
            Về danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;
  const vm = viewModel;

  return (
    <div id="q-baogia-print-root">
      <div className="q-baogia-toolbar">
        <span>
          {titleDoc} <span className="text-slate-500">| Mã: {vm.q.code}</span>
        </span>
        <div className="flex items-center gap-2">
          <Link to="/crm/quotes">← CRM</Link>
          <button type="button" onClick={() => window.print()}>
            <Printer size={16} className="inline mr-1" style={{ verticalAlign: 'text-bottom' }} />
            In / PDF
          </button>
        </div>
      </div>
      <div className="preview-pane">
        <div className="a4-wrapper">
          <div className="print-header">
            <div className="header-inner">
              <div className="brand">
                <svg className="brand-logo-svg" viewBox="0 0 450 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <linearGradient id="qLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#002D72', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#00A3E0', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 10 L80 10 L80 25 L38 25 L38 45 L70 45 L70 60 L38 60 L38 90 L20 90 Z"
                    fill="url(#qLogoGrad)"
                  />
                  <circle cx="95" cy="50" r="6" fill="#00A3E0" />
                  <text x="110" y="65" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="52" fill="#002D72" letterSpacing="-2">
                    SOLUTION
                  </text>
                  <text x="112" y="85" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="14" fill="#00A3E0" letterSpacing="6">
                    TECHNOLOGY
                  </text>
                </svg>
              </div>
              <div className="doc-info">
                <h2>BÁO GIÁ DỊCH VỤ</h2>
                <p>
                  Số: <strong>{vm.q.code}</strong>
                </p>
                <p>
                  Khách hàng: <span>{vm.clientLine}</span>
                </p>
                <p>
                  Ngày: <span>{vm.dateStr}</span>
                </p>
              </div>
            </div>
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <td>
                  <div className="header-space"> </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="print-content-body">
                  <div
                    style={{
                      fontSize: 13,
                      fontStyle: 'italic',
                      color: '#475569',
                      marginBottom: 20,
                      lineHeight: 1.6,
                    }}
                  >
                    {vm.intro}
                  </div>
                  <div className="info-summary-bar">
                    <div className="info-item">
                      <span className="info-label">Hiệu lực</span>
                      <div className="info-value">30 ngày</div>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Trạng thái (CRM)</span>
                      <div className="info-value" style={{ fontSize: 14 }}>
                        {quotationStatusToLabel(vm.q.status)}
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ngày dự kiến chốt</span>
                      <div className="info-value">{vm.deadline}</div>
                    </div>
                  </div>
                  <div className="section-wrapper">
                    <div className="section-header">GIẢI PHÁP ĐỀ XUẤT</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{vm.solution}</div>
                  </div>
                  <div className="section-wrapper">
                    <div className="section-header">CHI TIẾT CHI PHÍ ĐẦU TƯ</div>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th className="check-col">✓</th>
                          <th style={{ width: '25%' }}>Hạng mục</th>
                          <th style={{ width: '45%' }}>Mô tả chi tiết</th>
                          <th style={{ textAlign: 'right' }}>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="check-col">☑</td>
                          <td style={{ fontWeight: 600 }}>{vm.q.code}</td>
                          <td>{vm.q.notes?.trim() || vm.q.title || 'Theo phạm vi công việc'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoneyVi(vm.subtotal)} VNĐ</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="total-row">
                          <td colSpan={3} className="total-label">
                            TỔNG THANH TOÁN
                          </td>
                          <td className="total-value-cell">{formatMoneyVi(vm.total)} VNĐ</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="section-wrapper">
                    <div className="section-header">KẾ HOẠCH TRIỂN KHAI</div>
                    <div className="timeline-box">
                      {vm.timeline.map((t, x) => (
                        <div key={x} className="t-item">
                          <div className="t-circle">{x + 1}</div>
                          <div className="t-title">{t.phase}</div>
                          <div style={{ fontSize: 10 }}>{t.work}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="section-wrapper">
                    <div className="section-header">TIẾN ĐỘ THANH TOÁN</div>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th style={{ width: '20%' }}>Giai đoạn</th>
                          <th style={{ width: '30%' }}>Thời điểm</th>
                          <th style={{ width: '20%' }}>Giá trị</th>
                          <th>Nội dung</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vm.paymentPhases.map((p, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{p.phase}</td>
                            <td>{p.timing}</td>
                            <td className="text-accent">{p.val}</td>
                            <td>{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="section-wrapper">
                    <div className="section-header">THANH TOÁN QR</div>
                    <div className="payment-container">
                      <img className="qr-display" src={vm.qrSrc} alt="QR chuyển khoản" width={125} height={125} />
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        Ngân hàng: VIETINBANK
                        <br />
                        Số TK: 100001692967
                        <br />
                        Chủ TK: HOANG THU HUE
                        <br />
                        <br />
                        Nội dung: <strong>{vm.transferContent}</strong>
                        <br />
                        <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>
                          (Số tiền QR: đợt 1 — {formatMoneyVi(Math.round(vm.total * 0.5))} VNĐ)
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <div className="footer-space"> </div>
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="print-footer">
            <div className="footer-inner">
              <div>
                <strong>F-SOLUTION TECHNOLOGY</strong> — Mã BG: {vm.q.code}
              </div>
              <div>
                Hotline: 0987.654.321 | Email: contact@f-solution.vn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationBaogiaPage;
