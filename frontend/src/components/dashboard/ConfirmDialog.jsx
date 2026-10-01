import { useEffect, useRef } from "react";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = "Delete",
  loading = false,
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // showModal also traps keyboard focus and supports Escape to close.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleCancel(event) {
    event.preventDefault();
    onCancel();
  }

  return (
    <dialog ref={dialogRef} className="pc-confirm-dialog" onCancel={handleCancel}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="pc-actions">
        <button
          type="button"
          className="pc-button secondary"
          disabled={loading}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="pc-button danger"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;