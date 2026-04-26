/** Hiển thị số tiền VNĐ với dấu chấm phân cách hàng nghìn, ví dụ: 1.000.000 ₫ */
export function formatVnd(value: number): string {
  return `${Math.round(value).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} ₫`;
}

/** Chỉ phần số có dấu chấm (dùng cho input tiền), ví dụ: 1.000.000 */
export function formatVndDigits(value: number): string {
  return Math.max(0, Math.round(value)).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
}

/** Từ chuỗi người dùng gõ (có thể có dấu chấm) → số nguyên VNĐ */
export function parseVndDigitsInput(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 0;
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(n, Number.MAX_SAFE_INTEGER);
}
