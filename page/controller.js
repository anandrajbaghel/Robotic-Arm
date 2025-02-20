// This file handles all UI interactions, including button clicks, keyboard shortcuts, and log book updates.
// It contains the centralized handleControl function that calls the movement function and logs the actions.

import {structureControl, baseControl, shoulderControl, upperarmControl, elbowControl, wristControl, forehandControl} from './stl.js';


document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const leftNavOpen = document.getElementById('sidebar-left-open');
    const leftNavClose = document.getElementById('sidebar-left-close');
    const rightNavOpen = document.querySelector('.sidebar-right-open');
    const rightNavClose = document.querySelector('.sidebar-right-close');
    
    const blurBackground = document.querySelector('.blur-background');
    const leftNav = document.querySelector('.sidebar-left');
    const rightNav = document.querySelector('.sidebar-right');

    const shortcutBox = document.querySelector('.shortcut-box');
    const aboutBox = document.querySelector('.about-box');
    const resourcesBox = document.querySelector('.resource-box');
    
    const openShortcuts = document.getElementById('shortcuts');
    const openAbout = document.getElementById('about');
    const openResources = document.getElementById('resources');
    const closeShortcuts = document.getElementById('close-shortcut');
    const closeAbout = document.getElementById('close-about');
    const closeResources = document.getElementById('close-resource');

    const socketOverlay = document.querySelector('.socket-overlay');
    const messageOverlay = document.querySelector('.message-overlay');

    const messageMarker = document.getElementById('message-marker');
    const socketMarker = document.getElementById('socket-marker');

    const socket = document.getElementById('socket');
    const message = document.getElementById('message');

    const controls = document.querySelectorAll('.control');

    const gripper = document.querySelector('.gripper');
    const wrist = document.querySelector('.wrist');
    const forearm = document.querySelector('.forearm');
    const elbow = document.querySelector('.elbow');
    const upperarm = document.querySelector('.upperarm');
    const shoulder = document.querySelector('.shoulder');
    const base = document.querySelector('.base');

    // UI State Variables
    let isLeftNavOpen = false;
    let isRightNavOpen = false;
    let isSocketVisible = false;
    let isMessageVisible = false;

    openShortcuts.addEventListener('click', () => {
        shortcutBox.style.visibility = 'visible';
        aboutBox.style.visibility = 'hidden';
        resourcesBox.style.visibility = 'hidden';
        leftNavCloseState();
    });
    openAbout.addEventListener('click', () => {
        shortcutBox.style.visibility = 'hidden';
        aboutBox.style.visibility = 'visible';
        resourcesBox.style.visibility = 'hidden';
        leftNavCloseState();
    });
    openResources.addEventListener('click', () => {
        shortcutBox.style.visibility = 'hidden';
        aboutBox.style.visibility = 'hidden';
        resourcesBox.style.visibility = 'visible';
        leftNavCloseState();
    });
    closeShortcuts.addEventListener('click', () => {
        shortcutBox.style.visibility = 'hidden';
        console.log('closeShortcuts');
    });
    closeAbout.addEventListener('click', () => {
        aboutBox.style.visibility = 'hidden';
    });
    closeResources.addEventListener('click', () => {
        resourcesBox.style.visibility = 'hidden';
    });

    socket.addEventListener('click', () => {
        if (socketOverlay.style.visibility === 'visible') {
            messageOverlay.style.visibility = 'hidden';
            socketOverlay.style.visibility = 'hidden';
            isSocketVisible = false;
        } else {
            messageOverlay.style.visibility = 'hidden';
            socketOverlay.style.visibility = 'visible';
            isSocketVisible = true;
            socketMarker.style.visibility = 'hidden';
        }
    });
    message.addEventListener('click', () => {
        if (messageOverlay.style.visibility === 'visible') {
            socketOverlay.style.visibility = 'hidden';
            messageOverlay.style.visibility = 'hidden';
            isMessageVisible = false;
        } else {
            socketOverlay.style.visibility = 'hidden';
            messageOverlay.style.visibility = 'visible';
            isMessageVisible = true;
            messageMarker.style.visibility = 'hidden';
        }
    });

    // Update UI
    function updateUI() {
        if (isLeftNavOpen) leftNavOpenState();
        if (isRightNavOpen) rightNavOpenState();
    }
    updateUI();

    // Sidebar States
    function leftNavOpenState() {
        leftNav.style.left = '0';
        blurBackground.style.display = 'block';
        blurBackground.style.zIndex = '1';
    }
    function leftNavCloseState() {
        leftNav.style.left = '-340px';
        blurBackground.style.display = 'none'; // Corrected
        blurBackground.style.zIndex = '-1';
    }
    function rightNavOpenState() {
        rightNav.style.right = '0';
        blurBackground.style.display = 'block';
        blurBackground.style.zIndex = '1';
    }
    function rightNavCloseState() {
        rightNav.style.right = '-340px';
        blurBackground.style.display = 'none'; // Corrected
        blurBackground.style.zIndex = '-1';
    }
    function blurBackgroundState() {
        blurBackground.style.display = 'none'; // Corrected
        leftNav.style.left = '-340px';
        rightNav.style.right = '-340px';
        blurBackground.style.zIndex = '-1';
        socketOverlay.style.visibility = 'hidden';
        isSocketVisible = false;
        messageOverlay.style.visibility = 'hidden';
        isMessageVisible = false;
    }

    blurBackground.addEventListener('click', () => {
        blurBackgroundState();
    });
    leftNavOpen.addEventListener('click', () => {
        leftNavOpenState();
        isLeftNavOpen = true;
    });
    leftNavClose.addEventListener('click', () => {
        leftNavCloseState();
        isLeftNavOpen = false;
    });
    rightNavOpen.addEventListener('click', () => {
        rightNavOpenState();
        isRightNavOpen = true;
    });
    rightNavClose.addEventListener('click', () => {
        rightNavCloseState();
        isRightNavOpen = false;
    });

    // Drag and Drop
    let draggedItem = null;
    controls.forEach(control => {
        control.addEventListener('dragstart', handleDragStart);
        control.addEventListener('dragend', handleDragEnd);
        control.addEventListener('dragover', handleDragOver);
        control.addEventListener('drop', handleDrop);
    });
    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => {
            this.classList.add('dragging');
        }, 0);
    }
    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }
    function handleDragOver(e) {
        e.preventDefault(); // Allow drop
    }
    function handleDrop(e) {
        e.preventDefault();
        if (draggedItem !== this) {
            const controlsContainer = document.querySelector('.control-buttons');
            const controls = Array.from(controlsContainer.children);
            const draggedIndex = controls.indexOf(draggedItem);
            const targetIndex = controls.indexOf(this);

            if (draggedIndex < targetIndex) {
                this.after(draggedItem);
            } else {
                this.before(draggedItem);
            }
        }
    }

    // ============================
    // ============================

    // Log Data
    const controlButtonsContainer = document.querySelector('.control-buttons');
    const logBookTableBody = document.querySelector('.log-book tbody');
    const noDataAvailable = document.querySelector('.log-book .no-data-available');

    let lastRow = null;

    controlButtonsContainer.addEventListener('click', (event) => {
        const control = event.target.closest('.control');
        if (control) {
            const controlName = control.querySelector('.control-name').innerText;
            const clickedElement = event.target.closest('.control-1, .control-2');

            if (clickedElement) {
                let direction;
                
                if (controlName === 'Gripper') {
                    direction = clickedElement.classList.contains('control-1') ? 'Hold' : 'Released';
                } else if (controlName === 'Wrist') {
                    direction = clickedElement.classList.contains('control-1') ? 'counter' : 'clock';
                    moveSTLObject('wrist', direction);
                } else if (controlName === 'Forearm') {
                    direction = clickedElement.classList.contains('control-1') ? 'counter' : 'clock';
                    moveSTLObject('forehand', direction);
                } else if (controlName === 'Elbow') {
                    direction = clickedElement.classList.contains('control-1') ? 'counter' : 'clock';
                    moveSTLObject('elbow', direction);
                } else if (controlName === 'Upperarm') {
                    direction = clickedElement.classList.contains('control-1') ? 'counter' : 'clock';
                    moveSTLObject('upperarm', direction);
                } else if (controlName === 'Shoulder') {
                    direction = clickedElement.classList.contains('control-1') ? 'counter' : 'clock';
                    moveSTLObject('shoulder', direction);
                } else if (controlName === 'Base') {
                    direction = clickedElement.classList.contains('control-1') ? 'counter' : 'clock';
                    moveSTLObject('base', direction);
                }

                updateLogBook(controlName, direction);
            }
        }
    });

    // Centralized Control Handler
    function handleControl(action, direction) {
        moveSTLObject(action, direction);
        
        // Update Log Book
        // updateLogBook(action, direction);
    }
    // Move STL Object/Group
    function moveSTLObject(action, direction) {
        switch(action) {
            case 'base':
                baseControl('base', direction);
                break;
            case 'shoulder':
                shoulderControl('shoulder', direction);
                break;
            case 'upperarm':
                upperarmControl('upperarm', direction);
                break;
            case 'elbow':
                elbowControl('elbow', direction);
                break;
            case 'wrist':
                wristControl('wrist', direction);
                break;
            case 'forehand':
                forehandControl('forehand', direction);
                break;
        }
    }

    function updateLogBook(action, direction) {
        // Check if the row already exists and if it is the same as the last row
        const currentRow = Array.from(logBookTableBody.rows).find(row => 
            row.cells[0].textContent === action && 
            row.cells[1].textContent === direction
        );

        if (currentRow) {
            if (currentRow === lastRow) {
                const timesCell = currentRow.cells[2];
                timesCell.textContent = parseInt(timesCell.textContent, 10) + 1;
            } else {
                const newRow = document.createElement('tr');
                const actionCell = document.createElement('td');
                actionCell.textContent = action;
                const directionCell = document.createElement('td');
                directionCell.textContent = direction;
                const timesCell = document.createElement('td');
                timesCell.textContent = '1';

                newRow.appendChild(actionCell);
                newRow.appendChild(directionCell);
                newRow.appendChild(timesCell);

                logBookTableBody.insertBefore(newRow, logBookTableBody.firstChild);
                lastRow = newRow;
            }
        } else {
            const newRow = document.createElement('tr');
            const actionCell = document.createElement('td');
            actionCell.textContent = action;
            const directionCell = document.createElement('td');
            directionCell.textContent = direction;
            const timesCell = document.createElement('td');
            timesCell.textContent = '1';

            newRow.appendChild(actionCell);
            newRow.appendChild(directionCell);
            newRow.appendChild(timesCell);

            logBookTableBody.insertBefore(newRow, logBookTableBody.firstChild);
            lastRow = newRow;
        }

        noDataAvailable.style.display = logBookTableBody.rows.length > 0 ? 'none' : 'block';
    }

    // Update Log Book
    // function updateLogBook(action, direction) {
    //     // Check if a log entry already exists, update count if true, add new row if not
    //     if (logBookEntryExists(action, direction)) {
    //         incrementLogCount(action, direction);
    //     } else {
    //         addNewLogRow(action, direction);
    //     }
    // }

});



















// Button Event Listeners
// for each controlButton in controlButtons {
//     controlButton.addEventListener('click', (event) => {
//         let action = getControlAction(event);
//         let direction = getControlDirection(event);
//         handleControl(action, direction);  // Calls centralized handler
//     });
// }

// // Keyboard Shortcut Event Listener
// document.addEventListener('keydown', (event) => {
//     let action = getShortcutAction(event);
//     let direction = getShortcutDirection(event);
//     handleControl(action, direction);  // Calls centralized handler
// });
