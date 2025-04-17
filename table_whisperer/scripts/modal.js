export function hideModal() {
  const modalDialog = document.getElementById('modal-dialog');
  if (modalDialog) {
    modalDialog.style.display = 'none';
  }
}