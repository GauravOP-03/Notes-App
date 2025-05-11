import getCaretCoordinates from "textarea-caret";

export function getCursorCoordinates(
  textarea: HTMLTextAreaElement,
  position: number
) {
  return getCaretCoordinates(textarea, position);
}
