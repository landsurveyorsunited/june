var frameSets = document.querySelectorAll('.frameSet');
var frameData = [];

Array.from(frameSets).forEach(function (frameSet) {
  var frameSetData = {
    elt: frameSet,
    dir: 'horizontal',
    frames: [],
    divider: {
      elt: frameSet.querySelector('.divider'),
      x: 50,
      y: 0
    }
  };

  setFrameSizes(frameSetData);
  arrangeFrameSet(frameSetData);
  //addChildEventListener(frameSet, 'click', addFrame, 'frame');

  frameData.push(frameSetData);

  frameSet.addEventListener('mousedown', mouseDownHandler, false);

  function mouseDownHandler(e) {
    window.addEventListener('mousemove', mouseMoveHandler, false);
    window.addEventListener('mouseup', mouseUpHandler, false);
    frameSetData.divider.elt.classList.add('dragging');
  }

  function mouseUpHandler(e) {
    frameSetData.divider.elt.classList.remove('dragging');
    window.removeEventListener('mousemove', mouseMoveHandler, false);
    window.removeEventListener('mouseup', mouseUpHandler, false);
  }

  function mouseMoveHandler(e) {
    setFramesetDivider(frameSetData, e.clientX, e.clientY);
  }
});

function setFrameSizes(frameSetData) {
  var frameSet = frameSetData.elt;
  var frames = frameSet.querySelectorAll('.frameSet .frame');

  Array.from(frames).forEach(function (frame, i) {
    var frameData = {
      elt: frame,
      w: 50,
      h: 100,
      x: 100 / frames.length * i,
      y: 0
    };

    //arrangeFrame(frameData, frameSetSize);
    frameSetData.frames.push(frameData);
  });
}

function arrangeFrame(frameData, frameSetSize) {
  var frame = frameData.elt;

  frame.style.width = frameData.w + '%';
  frame.style.height = frameData.h + '%';

  frame.style.left = frameData.x + '%';
  frame.style.top = frameData.y + '%';
}

function arrangeFrameSet(frameSetData) {
  var frameSetSize = frameSetData.elt.getBoundingClientRect();

  arrangeFrame(frameSetData.frames[0], frameSetSize);
  arrangeFrame(frameSetData.frames[1], frameSetSize);

  frameSetData.divider.elt.style.left = frameSetData.divider.x + '%';
}

function addFrame(e, frameSet, frame) {
  console.log(this);
  console.log(target);
}

function setFramesetDivider(frameSetData, x, y) {
  var offset = getRelativeOffsets(x, y, frameSetData.elt);

  frameSetData.divider.x = offset.x * 100;
  frameSetData.frames[0].w = offset.x * 100;
  frameSetData.frames[1].x = offset.x * 100;
  frameSetData.frames[1].w = 100 - offset.x * 100;

  arrangeFrameSet(frameSetData);
}