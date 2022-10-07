let preview = document.getElementById('preview');
let updatePreview = () => {
  document.body.setAttribute(
    'class',
    preview?.options[preview?.options?.selectedIndex]?.id
  );
};
preview.onchange = updatePreview;
updatePreview();
