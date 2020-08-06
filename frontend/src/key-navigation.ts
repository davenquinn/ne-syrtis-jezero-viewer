// Bind up and down arrow keys
document.onkeydown = function (e) {
  switch (e.which) {
    case 37: // left
      break;

    case 38: // up
      break;

    case 39: // right
      break;

    case 40: // down
      break;

    default:
      return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
};
