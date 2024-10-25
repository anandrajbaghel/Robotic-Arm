// This file handles all UI interactions, including button clicks, keyboard shortcuts, and log book updates.
// It contains the centralized handleControl function that calls the movement function and logs the actions.

import {structureControl, baseControl, shoulderControl, upperarmControl, elbowControl, wristControl, forehandControl} from './stl.js';


document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const controls = document.querySelectorAll('.control');
    const leftNav = document.querySelector('.left-sidebar');
    const rightNav = document.querySelector('.right-sidebar');
    const blurBackground = document.querySelector('.blur-background');
    const shortcuts = document.querySelector('.shortcuts');
    const shortcutsDropdown = document.querySelector('.shortcuts .menu-dropdown');

    const leftNavOpen = document.querySelector('.left-sidebar-open-button');
    const leftNavClose = document.querySelector('.left-sidebar-close-button');
    const rightNavOpen = document.querySelector('.right-sidebar-open-button');
    const rightNavClose = document.querySelector('.right-sidenav-close-button');

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
    let isShortcutsMenuOpen = false;

    // Control Variables
    let baseDegree = 1; // 1 degree
    let baseRadian = 0.0174533; // 1 degree in radians
    let multiplier = 1; // Default multiplier
    let isAngleInRadians = false;


    // Toggle Shortcuts Menu
    function toggleShortcutsMenu() {
        if (isShortcutsMenuOpen) {
            shortcuts.style.height = '64px';
            shortcuts.style.backgroundColor = 'transparent';
            isShortcutsMenuOpen = false;
            shortcutsDropdown.style.transform = 'rotate(0deg)';
        } else {
            shortcuts.style.height = 'max-content';
            shortcuts.style.backgroundColor = '#eee';
            isShortcutsMenuOpen = true;
            shortcutsDropdown.style.transform = 'rotate(180deg)';
        }
    }

    shortcuts.addEventListener('click', () => {
        toggleShortcutsMenu();
    });

    // Update UI
    function updateUI() {
        if (isLeftNavOpen) leftNavOpenState();
        if (isRightNavOpen) rightNavOpenState();
        if (isShortcutsMenuOpen) {
            shortcuts.style.height = 'max-content';
            shortcutsDropdown.style.transform = 'rotate(180deg)';
        }
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
