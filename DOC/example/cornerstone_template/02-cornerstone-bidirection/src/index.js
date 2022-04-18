export default class ObservableRectangleRoiTool extends cornerstoneTools.LengthTool {
  constructor(name = "ObservableRectangleRoi") {
    super({
      name,
      // supportedInteractionTypes: ['Mouse'],
      // mixins: ['activeOrDisabledBinaryTool'],
    });
  }

  createNewMeasurement(event) {
    console.log("New measurement");
    const measurement = super.createNewMeasurement(event);
    window.measurement = measurement;
    console.log(measurement);
    return measurement;
  }

  // mouseDragCallback(evt) {
  //   console.log("mouseDragCallback");
  // }
 
  // mouseMoveCallback(evt) {
  //   console.log("MouseMove");
  // }

  // preMouseDownCallback(evt) {
  //   console.log('Hello cornerstoneTools!');
  // }

  // postMouseDownCallback(evt) {
  //   console.log("PostMouseDownCallback");
  // }

  // activeCallback(element) {
  //   console.log(`Hello element ${element.uuid}!`);
  // }

  // disabledCallback(element) {
  //   console.log(`Goodbye element ${element.uuid}!`);
  // }
}



function initModeButtons() {
  const nameSpace = `.mode-buttons`;
  const buttons = document.querySelectorAll(`${nameSpace} .set-tool-mode`);

  const handleClick = function (evt) {
    const action = this.dataset.action;
    const options = {
      mouseButtonMask: evt.buttons || convertMouseEventWhichToButtons(evt.which)
    };

    cornerstoneTools[`setTool${action}`](toolName, options);

    // Remove active style from all buttons
    buttons.forEach((btn) => {
      btn.classList.remove("is-primary");
    });

    // Add active style to this button
    this.classList.add("is-primary");

    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    return false;
  };

  buttons.forEach((btn) => {
    btn.addEventListener("contextmenu", handleClick);
    btn.addEventListener("auxclick", handleClick);
    btn.addEventListener("click", handleClick);
  });
}

function _initInterface() {
  initModeButtons();
}

// NOTE: We pull these in from packaged sources in our header,
// but here are the associated NPM packages that can be used instead

// Packages
// import Hammer from 'hammerjs';
// import dicomParser from 'dicom-parser';
// import * as cornerstone from 'cornerstone-core';
// import * as cornerstoneMath from 'cornerstone-math';
// import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
// import * as cornerstoneTools from '@cornerstonejs/tools';

const baseUrl = "https://tools.cornerstonejs.org/examples/";

_initCornerstone();
const element = document.querySelector(".cornerstone-element");
_initInterface();

// Init CornerstoneTools
cornerstoneTools.init({
  showSVGCursors: true
});

cornerstone.enable(element);
const toolName = "ObservableRectangleRoi";
const imageIds = [
  `wadouri:${baseUrl}assets/dicom/exotic/1.dcm`,
  `wadouri:${baseUrl}assets/dicom/exotic/2.dcm`
];

const stack = {
  currentImageIdIndex: 0,
  imageIds: imageIds
};

element.tabIndex = 0;
element.focus();

cornerstone.loadImage(imageIds[0]).then(function (image) {
  console.log("loaded image");
  cornerstoneTools.addStackStateManager(element, ["stack"]);
  cornerstoneTools.addToolState(element, "stack", stack);
  cornerstone.displayImage(element, image);
});

// Add the tool
// const apiTool = cornerstoneTools[`${toolName}Tool`];
// cornerstoneTools.addTool(apiTool);
// Add our tool, and set it's mode

// const BidirectionalTool = cornerstoneTools.BidirectionalTool;
// cornerstoneTools.addTool(BidirectionalTool)
// cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 1 })


// add custom Tools
cornerstoneTools.addTool(ObservableRectangleRoiTool);
cornerstoneTools.setToolActive("ObservableRectangleRoi", {
  mouseButtonMask: 1
});

/***************************************************************************
 * UI & Boilerplate setup code
 **************************************************************************/

/***
 *
 *
 */
function _initCornerstone() {
  // Externals
  console.log(cornerstoneWADOImageLoader);
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;

  // Image Loader
  const config = {
    webWorkerPath: `${baseUrl}assets/image-loader/cornerstoneWADOImageLoaderWebWorker.js`,
    taskConfiguration: {
      decodeTask: {
        codecsPath: `${baseUrl}assets/image-loader/cornerstoneWADOImageLoaderCodecs.js`
      }
    }
  };
  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
}

const convertMouseEventWhichToButtons = (which) => {
  console.log('146L which ===> ',which);
  switch (which) {
    // no button
    case 0:
      return 0;
    // left
    case 1:
      return 1;
    // middle
    case 2:
      return 4;
    // right
    case 3:
      return 2;
  }
  return 0;
};