import AdminButton from '../AdminButton';

export default function AdminButtonExample() {
  return (
    <div className="relative h-64">
      <AdminButton onClick={() => console.log('Admin button clicked')} />
    </div>
  );
}
