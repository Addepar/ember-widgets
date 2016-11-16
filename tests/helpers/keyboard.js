export function pressEnter(element) {
  return keyEvent(element, 'keydown', 13);
}

export function pressSpacebar(element) {
  return keyEvent(element, 'keydown', 32);
}

export function pressEsc(element) {
  return keyEvent(element, 'keydown', 27);
}

export function pressUpArrow(element) {
  return keyEvent(element, 'keydown', 38);
}

export function pressDownArrow(element) {
  return keyEvent(element, 'keydown', 40);
}

export function pressBackspace(element) {
  return keyEvent(element, 'keydown', 8);
}
