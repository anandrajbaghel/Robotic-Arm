'use strict';

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

    // State Variables
    let isLeftNavOpen = false;
    let isRightNavOpen = false;
    let isShortcutsMenuOpen = false;

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
                } else {
                    direction = clickedElement.classList.contains('control-1') ? 'Counter' : 'Clock';
                }

                updateLogBook(controlName, direction);
            }
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.code === 'KeyB') {
            if (event.code === 'ArrowLeft') {
                handleShortcut('Base', 'Counterclockwise');
            } else if (event.code === 'ArrowRight') {
                handleShortcut('Base', 'Clockwise');
            }
        }
    });

    function handleShortcut(action, direction) {
        console.log(`Detected shortcut: ${action} - ${direction}`); // Debugging line
        applyHoverEffect(action);
        updateLogBook(action, direction);
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

    function applyHoverEffect(controlName) {
        document.querySelectorAll('.control').forEach(control => {
            control.classList.remove('hover-effect');
        });

        const targetControl = Array.from(document.querySelectorAll('.control'))
            .find(control => control.querySelector('.control-name').innerText === controlName);

        if (targetControl) {
            targetControl.classList.add('hover-effect');
            setTimeout(() => {
                targetControl.classList.remove('hover-effect');
            }, 300); // Adjust duration as needed
        }
    }
});
