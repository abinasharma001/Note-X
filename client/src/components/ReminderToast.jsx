export default function ReminderToast({ reminders, onClose }) {
  if (!reminders.length) return null;

  return (
    <div className="toast-wrapper">
      {reminders.map((reminder) => (
        <div className="toast" key={reminder._id}>
          <strong>Reminder</strong>
          <p>{reminder.message || 'You have a due reminder for a note.'}</p>
          <button type="button" onClick={() => onClose(reminder._id)}>
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
