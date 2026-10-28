/**
 * Robust clipboard utility that works across modern browsers, insecure contexts, and restricted iframes.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Strategy 1: Modern navigator.clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed (likely iframe restriction), using fallback:', err);
    }
  }

  // Strategy 2: Invisible textarea fallback with execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.contain = 'strict';
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    textArea.style.fontSize = '12pt'; // Prevent iOS zoom

    const selection = document.getSelection();
    let originalRange: Range | null = null;
    if (selection && selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }

    document.body.appendChild(textArea);
    textArea.select();
    textArea.selectionStart = 0;
    textArea.selectionEnd = text.length;

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (originalRange && selection) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }

    return successful;
  } catch (fallbackErr) {
    console.error('All clipboard copy strategies failed:', fallbackErr);
    return false;
  }
}
