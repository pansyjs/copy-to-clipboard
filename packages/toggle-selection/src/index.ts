function toggleSelection() {
  const selection = document.getSelection();

  if (!selection?.rangeCount) {
    return function () {};
  }

  let active = document.activeElement;

  const ranges: Range[] = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active?.tagName?.toUpperCase()) {
    case 'INPUT':
    case 'TEXTAREA':
      (active as any).blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();

  return function () {
    selection.type === 'Caret' &&
    selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }

    active && (active as any).focus();
  }
}

export default toggleSelection;
