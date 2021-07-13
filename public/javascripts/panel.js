import { IDENTITY_MATRIX, transform, addMatrix, deleteMatrix, getMatrices, addVector, deleteVector, getVectors, getVector, enableUnitVectors, enableDeterminantDisplay, enableEigenVectorDisplay } from "/javascripts/main.js";
import { parseMatrix } from '/javascripts/input-parser.js';

/* TOP BAR */
const barButtons = document.getElementsByClassName("bar-button");
const matricesButton = document.getElementById("matrices-button");
const vectorsButton = document.getElementById("vectors-button");
const toolsButton = document.getElementById("tools-button");
// const settingsButton = document.getElementById("settings-button");


const contentBars = document.getElementsByClassName('content-bar');
const matricesBar = document.getElementById("matrices-bar");
const vectorsBar = document.getElementById("vectors-bar");
const toolsBar = document.getElementById("tools-bar");
// const settingsBar = document.getElementById("settings-bar");



const matricesAddButton = document.getElementById("matrices-add-button");
const matricesTransformButton = document.getElementById("matrices-transform-button");
const matricesListButton = document.getElementById("matrices-list-button");

const vectorsAddButton = document.getElementById("vectors-add-button");
const vectorsIncludeUnitVectorsButton = document.getElementById("vectors-include-unit-vectors-button");
const vectorsListButton = document.getElementById("vectors-list-button");

const dotProductButton = document.getElementById("dot-product-button");
const determinantButton = document.getElementById("determinant-button");
const eigenButton = document.getElementById("eigen-button");



const matricesAddFrame = document.getElementById("matrices-add-frame");
const matricesTransformFrame = document.getElementById("matrices-transform-frame");
const matricesListFrame = document.getElementById("matrices-list-frame");

const vectorsAddFrame = document.getElementById("vectors-add-frame");
const vectorsUnitsFrame = document.getElementById("vectors-units-frame");
const vectorsListFrame = document.getElementById("vectors-list-frame");

const dotProductFrame = document.getElementById("dot-product-frame");
const determinantFrame = document.getElementById("determinant-frame");
const eigenFrame = document.getElementById("eigen-frame");

// top bar to content bar 
const buttonBarPair = new Map(); 
buttonBarPair.set(matricesButton, matricesBar);
buttonBarPair.set(vectorsButton, vectorsBar);
buttonBarPair.set(toolsButton, toolsBar);

buttonBarPair.forEach((value, key) => {
    key.addEventListener('click', () => {
        if (key && value)
            toggleContentBar(key, value);
    });
})

function toggleContentBar(openButton, openBar) {
    if (!openBar.classList.contains('disabled')) {
        openButton.classList.add('disabled');
        openBar.classList.add('disabled');
        return;
    }
    // toggle tab
    for (let bar of contentBars) {
        bar.classList.add('disabled');
    }
    openBar.classList.remove('disabled');
    // change button color
    for (let button of barButtons) {
        button.classList.add('disabled');
    }
    openButton.classList.remove('disabled');
}


// content bar buttons to property frame
const buttonPropertyFramePair = new Map();
buttonPropertyFramePair.set(matricesAddButton, matricesAddFrame);
buttonPropertyFramePair.set(matricesTransformButton, matricesTransformFrame);
buttonPropertyFramePair.set(matricesListButton, matricesListFrame);

buttonPropertyFramePair.set(vectorsAddButton, vectorsAddFrame);
buttonPropertyFramePair.set(vectorsIncludeUnitVectorsButton, vectorsUnitsFrame);
buttonPropertyFramePair.set(vectorsListButton, vectorsListFrame);

buttonPropertyFramePair.set(dotProductButton, dotProductFrame);
buttonPropertyFramePair.set(determinantButton, determinantFrame);
buttonPropertyFramePair.set(eigenButton, eigenFrame);

buttonPropertyFramePair.forEach((value, key) => {
    if (value && key)
    key.addEventListener('click', () => {
        openPropertyFrame(value);
        key.classList.remove('disabled');
    });
});


function openPropertyFrame(frame) {
    frame.style.display = "block";
    putFrameOnTop(frame);
}


// change property frame default width
const propertyFrames = document.getElementsByClassName("property-frame");
for (let frame of propertyFrames) {
    if (frame.dataset.width) {
        frame.style.width = frame.dataset.width;
    }
}



/* PROPERTY FRAME */

function removePasteStyling(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
}

document.querySelectorAll('[contenteditable]').forEach(v => {
    v.addEventListener('paste', removePasteStyling);
});

// closing
const closeButtons =
    Array.from(document.querySelectorAll(".property-frame > .button-list > .button.cancel")).concat(
        Array.from(document.querySelectorAll(".property-frame > .top-bar > .close-button"))
    ).concat(Array.from(document.querySelectorAll(".warning-frame > .top-bar > .close-button")));

closeButtons.forEach(element => {
    registerCloseButton(element);
});


function registerCloseButton(element, custom) {
    element.addEventListener('click', (e) => {
        if (custom) {
            custom(element);
        } else {
            const frame = element.parentElement.parentElement;
            frame.style.display = "none";

            // remove button highlight
            buttonPropertyFramePair.forEach((v, k) => {
                if (v.id === frame.id) {
                    k.classList.add('disabled');
                }
            });
        }
    });
}

// toggler 
function createToggler(button, onOff, onOn) {
    button.addEventListener('click', _ => {
        const turnOn = button.textContent === "o";
        // o === is off
        // x === is on
        if (button.textContent === "x") {
            button.textContent = "o";
            onOff(turnOn);
        } else {
            button.textContent = "x";
            onOn(turnOn);
        }
    });
}


// MATRIX
// add matrix
const matricesAddc0X = document.getElementById("matrices-add-c0x");
const matricesAddc0Y = document.getElementById("matrices-add-c0y");
const matricesAddc1X = document.getElementById("matrices-add-c1x");
const matricesAddc1Y = document.getElementById("matrices-add-c1y");
const matricesAddNameField = document.getElementById("matrices-add-name-field");
const matricesAddFrameAddButton = document.getElementById("matrices-add-frame-add-button");
const matricesAddFrameCancelButton = document.getElementById("matrices-add-frame-cancel-button");

matricesAddFrameAddButton.addEventListener('click', () => {
    const c0X = Number.parseFloat(matricesAddc0X.textContent);
    const c0Y = Number.parseFloat(matricesAddc0Y.textContent);
    const c1X = Number.parseFloat(matricesAddc1X.textContent);
    const c1Y = Number.parseFloat(matricesAddc1Y.textContent);
    const name = matricesAddNameField.textContent.trim();
    if (Number.isNaN(c0X)) {
        createNewWarning("Matrix C0 X must be a number");
        return;
    }
    if (Number.isNaN(c0Y)) {
        createNewWarning("Matrix C0 Y must be a number");
        return;
    }
    if (Number.isNaN(c1X)) {
        createNewWarning("Matrix C1 X must be a number");
        return;
    }
    if (Number.isNaN(c1Y)) {
        createNewWarning("Matrix C1 Y must be a number");
        return;
    }
    if (!name) {
        createNewWarning("Name cannot be empty");
        return;
    }

    addMatrix(name, [c0X, c0Y], [c1X, c1Y]); 
    refreshMatrixList(getMatrices());
    resetAddMatricesInput();
    transformFromInput(transformTextField.textContent);
});

matricesAddFrameCancelButton.addEventListener('click', resetAddMatricesInput);

function resetAddMatricesInput() {
    matricesAddc0X.textContent = "0";
    matricesAddc0Y.textContent = "0";
    matricesAddc1X.textContent = "0";
    matricesAddc1Y.textContent = "0";
    matricesAddNameField.textContent = "";
}



// matrix transform 
const transformTextField = document.getElementById("transform-text-field");
const transformOutputTextField = document.getElementById("matrix-transform-output-field");
const transformOutputC0X = document.getElementById("matrices-transform-output-c0x");
const transformOutputC0Y = document.getElementById("matrices-transform-output-c0y");
const transformOutputC1X = document.getElementById("matrices-transform-output-c1x");
const transformOutputC1Y = document.getElementById("matrices-transform-output-c1y");

transformTextField.addEventListener('input', () => {
    transformFromInput(transformTextField.textContent);
});

function transformFromInput(input) {
    if (!input) {
        handleTransform({matrix: IDENTITY_MATRIX, err: "Input is empty"});
        return;
    }
    handleTransform(parseMatrix(input, getMatrices(), getVectors()));
}

function handleTransform(output) {
    const matrix = output.matrix;

    if (output.err) {
        const err = output.err;
        transformOutputTextField.textContent = err;
    } else {
        transformOutputTextField.textContent = "Success";
    }
    // transformOutputC0X.textContent = Math.round(matrix.c0r0*100)/100;
    // transformOutputC0Y.textContent = Math.round(matrix.c0r1*100)/100;
    // transformOutputC1X.textContent = Math.round(matrix.c1r0*100)/100;
    // transformOutputC1Y.textContent = Math.round(matrix.c1r1*100)/100;
    transformOutputC0X.textContent = matrix.c0r0;
    transformOutputC0Y.textContent = matrix.c0r1;
    transformOutputC1X.textContent = matrix.c1r0;
    transformOutputC1Y.textContent = matrix.c1r1;

    changeDeterminant(matrix);
    transform(matrix);
}




// matrix list
const matrixListLi = document.querySelector('#storage > li.matrix-list-li');
const matrixPropertiesList = document.getElementById("matrix-properties-list");

function deleteMatrixFromList(name, li) {
    deleteMatrix(name);
    li.remove();
}

function removeMatrixListLis() {
    matrixPropertiesList.textContent = '';
}

function setupMatrixListLi(name, matrixC0, matrixC1) {
    const clone = matrixListLi.cloneNode(true);

    clone.classList.add(name);
    clone.getElementsByClassName('label')[0].textContent = name;
    // clone.getElementsByClassName('c0x')[0].textContent = Math.round(matrixC0[0]*100)/100;
    // clone.getElementsByClassName('c0y')[0].textContent = Math.round(matrixC0[1]*100)/100;
    // clone.getElementsByClassName('c1x')[0].textContent = Math.round(matrixC1[0]*100)/100;
    // clone.getElementsByClassName('c1y')[0].textContent = Math.round(matrixC1[1]*100)/100;
    clone.getElementsByClassName('c0x')[0].textContent = matrixC0[0];
    clone.getElementsByClassName('c0y')[0].textContent = matrixC0[1];
    clone.getElementsByClassName('c1x')[0].textContent = matrixC1[0];
    clone.getElementsByClassName('c1y')[0].textContent = matrixC1[1];
    clone.getElementsByClassName('delete-button')[0].addEventListener('click', () => {
        deleteMatrixFromList(name, clone);
        transformFromInput(transformTextField.textContent);
    });

    return clone;
}

function refreshMatrixList(matrices) {
    removeMatrixListLis();

    matrices.forEach((matrix, name) => {
        const clone = setupMatrixListLi(name, matrix.c0, matrix.c1);
        matrixPropertiesList.appendChild(clone);
    });
}




// VECTOR
// add vector
const vectorsAddX = document.getElementById("vectors-add-x");
const vectorsAddY = document.getElementById("vectors-add-y");
const vectorsAddNameField = document.getElementById("vectors-add-name-field");
const vectorsAddFrameAddButton = document.getElementById("vectors-add-frame-add-button");
const vectorsAddFrameCancelButton = document.getElementById("vectors-add-frame-cancel-button");
const vectorsAddFrameInputColor = document.getElementById("vectors-add-frame-input-color");

vectorsAddFrameAddButton.addEventListener('click', () => {
    const xNum = Number.parseFloat(vectorsAddX.textContent);
    const yNum = Number.parseFloat(vectorsAddY.textContent);
    const name = vectorsAddNameField.textContent.trim();
    if (Number.isNaN(xNum)) {
        createNewWarning("Vector X must be a number");
        return;
    }
    if (Number.isNaN(yNum)) {
        createNewWarning("Vector Y must be a number");
        return;
    }
    if (!name) {
        createNewWarning("Name cannot be empty");
        return;
    }
    addVector(name, xNum, yNum, vectorsAddFrameInputColor.value);
    refreshVectorList(getVectors());
    resetAddVectorsInput();
    transformFromInput(transformTextField.textContent);
});

vectorsAddFrameCancelButton.addEventListener('click', resetAddVectorsInput);

function resetAddVectorsInput() {
    vectorsAddFrameInputColor.value = "#ff0000";
    vectorsAddX.textContent = "0";
    vectorsAddY.textContent = "0";
    vectorsAddNameField.textContent = "";
}

// unit vector
const vectorsUnitsToggleButton = document.getElementById("vectors-units-frame-toggle-button");

createToggler(vectorsUnitsToggleButton, enableUnitVectors, enableUnitVectors);


// vector list
const vectorListLi = document.querySelector('#storage > li.vector-list-li');
const vectorPropertiesList = document.getElementById("vector-properties-list");

function deleteVectorFromList(name, li) {
    deleteVector(name);
    li.remove();
}

function removeVectorListLis() {
    vectorPropertiesList.textContent = '';
}

function setupVectorListLi(name, vectorX, vectorY, color) {
    const clone = vectorListLi.cloneNode(true);

    clone.classList.add(name);
    clone.getElementsByClassName('label')[0].textContent = name;
    clone.getElementsByClassName('x')[0].textContent = vectorX;
    clone.getElementsByClassName('y')[0].textContent = vectorY;
    clone.getElementsByClassName('color')[0].style.backgroundColor = color;
    clone.getElementsByClassName('delete-button')[0].addEventListener('click', () => {
        deleteVectorFromList(name, clone);
        transformFromInput(transformTextField.textContent);
    });

    return clone;

}

function refreshVectorList(vectors) {
    removeVectorListLis();

    vectors.forEach((vector, name) => {
        const clone = setupVectorListLi(name, vector.x, vector.y, vector.color);
        vectorPropertiesList.appendChild(clone);
    });
}



// TOOLS
// dot product 
const dotProductVectorAField = document.getElementById("dot-product-vector-a-field");
const dotProductVectorBField = document.getElementById("dot-product-vector-b-field");
const dotProductOutput = document.getElementById("dot-product-output");

dotProductVectorAField.addEventListener('input', () => {
    changeDotProductOutput(dotProductVectorAField.textContent, dotProductVectorBField.textContent);
});

dotProductVectorBField.addEventListener('input', () => {
    changeDotProductOutput(dotProductVectorAField.textContent, dotProductVectorBField.textContent);
});

function changeDotProductOutput(aName, bName) {
    const a = getVector(aName);
    const b = getVector(bName);

    if (!a && !b) {
        dotProductOutput.textContent = "vector a and b not found";
        return;
    }
    if (!a) {
        dotProductOutput.textContent = "vector a not found";
        return;
    }
    if (!b) {
        dotProductOutput.textContent = "vector b not found";
        return;
    }

    dotProductOutput.textContent = a.dot(b);
}


// determinant 
const determinantField = document.getElementById("determinant-field");
const determinantDisplayToggleButton = document.getElementById("display-determinant-toggle-button");

function changeDeterminant(matrix) {
    determinantField.textContent = matrix.getDeterminant();
}

createToggler(determinantDisplayToggleButton, enableDeterminantDisplay, enableDeterminantDisplay);

// eigen
const eigenVectorDisplayToggleButton = document.getElementById("display-eigen-vector-toggle-button");

createToggler(eigenVectorDisplayToggleButton, enableEigenVectorDisplay, enableEigenVectorDisplay);


/* DRAGGABLE */
let draggableElements = document.getElementsByClassName('draggable');

for (let i = 0; i < draggableElements.length; i++) {
    dragElement(draggableElements[i]);
}

function dragElement(element) { // https://www.w3schools.com/howto/howto_js_draggable.asp
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.parentElement.style.top = Math.min(Math.max(element.parentElement.offsetTop - pos2, 28), document.body.clientHeight - element.parentElement.clientHeight) + "px";
        element.parentElement.style.left = Math.min(Math.max(element.parentElement.offsetLeft - pos1, 0), document.body.clientWidth - element.parentElement.clientWidth) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

/* WARNING FRAME */
const warningFrame = document.getElementsByClassName("warning-frame")[0];
let lastWarningFrame = null;

function createNewWarning(text) {
    const clone = warningFrame.cloneNode(true);
    clone.style.display = "block";
    clone.getElementsByClassName("content")[0].textContent = text;

    dragElement(clone.getElementsByClassName("draggable")[0]);
    registerCloseButton(clone.getElementsByClassName("close-button")[0], ele => {
        ele.parentNode.parentNode.remove();
        unregisterFrameZIndex(ele);
    });

    // change position if last warningFrame is the same
    if (lastWarningFrame !== null) {
        const top = window.getComputedStyle(lastWarningFrame).getPropertyValue('top');
        clone.style.top = `calc(${top} + 2%)`;
    }

    clone.id = createUniqueId(10);
    document.body.appendChild(clone);
    lastWarningFrame = clone;
    registerFrameZIndex(clone);
}

const idChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const idTable = {};
function createUniqueId(length) {
    let id = "";
    for (let i = 0; i < length; i++) {
      id += idChars.charAt(Math.floor(Math.random() * idChars.length));
    }
    if (idTable[id]) return createUniqueId(length);
    idTable[id] = true;
    return id;
}

/* Z-INDEX */
let zIndexQueue = [];

function refreshZIndex() {
    for (let i = 0; i < zIndexQueue.length; i++) {
        zIndexQueue[i].style.zIndex = i + 100;
    }
}

function registerFrameZIndex(frame) {
    putFrameOnTop(frame, false);
}

function unregisterFrameZIndex(frame) {
    const index = zIndexQueue.findIndex(v => v.id === frame.id);
    if (index < 0) {
        console.log(frame + " not in queue");
        return;
    }
    zIndexQueue.splice(index, 1);
    refreshZIndex();
}

function putFrameOnTop(frame, search=true) {
    if (search) {
        if (zIndexQueue[zIndexQueue.length-1] === frame) return;
        unregisterFrameZIndex(frame);
    }
    zIndexQueue.push(frame);
    refreshZIndex();
}

for (let frame of document.getElementsByClassName("property-frame")) {
    registerFrameZIndex(frame);
    frame.addEventListener('mousedown', () => putFrameOnTop(frame));
}


/* ARROW */
class ListNode {
    constructor(value, next, before) {
        this.value = value;
        this.next = next;
        this.before = before;
    }
}

function arrayToLinkedList(arr) {
    if (arr.length === 0) return null;
    if (arr.length === 1) {
        const node = new ListNode(arr[0]);
        node.next = node;
        node.before = node;
        return node;
    }

    const head = new ListNode(arr[0]);
    head.next = new ListNode(arr[1]);
    head.before = new ListNode(arr[arr.length-1]);

    let curr = head.next;
    let before = head;
    
    for (let i = 2; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr.before = before;

        before = before.next;
        curr = curr.next;
    }

    curr.before = before;
    curr.next = head;

    return head;
}

function arrowOnKeyDown(curr) {
    return e => {
        if (e.code === "ArrowDown") { // down
            curr.next.value.focus();
        } else if (e.code === "ArrowUp") { // up
            curr.before.value.focus();
        }
    }
}

function registerArrowList(head) {
    let curr = head;
    do {
        curr.value.addEventListener('keydown', arrowOnKeyDown(curr));

        curr = curr.next;
    } while (curr !== head);
}

const matricesAddArrowList = arrayToLinkedList(
    [
        document.getElementById("matrices-add-name-field"),
        document.getElementById("matrices-add-c0x"),
        document.getElementById("matrices-add-c0y"),
        document.getElementById("matrices-add-c1x"),
        document.getElementById("matrices-add-c1y")
    ]
);

const vectorAddArrowList = arrayToLinkedList(
    [
        document.getElementById("vectors-add-name-field"),
        document.getElementById("vectors-add-x"),
        document.getElementById("vectors-add-y")
    ]
);

const dotProductArrowList = arrayToLinkedList(
    [
        document.getElementById("dot-product-vector-a-field"),
        document.getElementById("dot-product-vector-b-field")
    ]
);

registerArrowList(matricesAddArrowList);
registerArrowList(vectorAddArrowList);
registerArrowList(dotProductArrowList);


/* INIT */
addMatrix("I", [1, 0], [0, 1]); 
refreshMatrixList(getMatrices());

addVector("o", 1, 1); 
refreshVectorList(getVectors());

handleTransform({matrix: IDENTITY_MATRIX});

// window.onbeforeunload = () => true;