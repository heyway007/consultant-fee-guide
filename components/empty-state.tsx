type EmptyStateProps = {
  title?: string;
  description?: string;
  onReset?: () => void;
};

export default function EmptyState({ title = "ไม่พบข้อมูลที่ตรงกัน", description = "ลองเปลี่ยนคำค้นหรือปรับตัวกรองเพื่อดูผลลัพธ์อื่น", onReset }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">⌕</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {onReset ? <button type="button" className="primary-button" onClick={onReset}>ล้างตัวกรอง</button> : null}
    </div>
  );
}
