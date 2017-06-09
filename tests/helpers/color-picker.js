export function openColorChooser(element) {
  if (element == null) {
    element = 'body';
  }
  return andThen(function() {
    var dropdown;
    dropdown = find('.color-picker-button .dropdown', element);
    if (!dropdown.hasClass('open')) {
      return click('.color-picker-dropdown-button', element);
    }
  });
}

export function getSelectedColor() {
  var active = find('.color-picker-dropdown .active');
  if (active.length) {
    return active[0].attributes.style.value.match(/#[A-F0-9]+/)[0];
  } else {
    return find('.color-picker-dropdown .input-sm').val();
  }
}

export function selectColor(colorInHex) {
  openColorChooser();
  var colorCell;

  andThen(function() {
    $(".color-picker-cell").each(function(index, cell) {
      if (cell.attributes.style.value.match(colorInHex)) {
        colorCell = cell;
      }
    });

    return click(colorCell);
  });
}

export function fillInCustomColor(value) {
  return fillIn('.color-picker-dropdown .input-sm', value);
}
