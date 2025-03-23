import { sendCommand } from './commandSender.js';

// Selecting angle input
let angleInput = document.getElementById('angle-input');
let rotatingAngle = parseFloat(angleInput.value);

// Update rotatingAngle whenever the input value changes
angleInput.addEventListener('input', function() {
    rotatingAngle = parseFloat(angleInput.value);
});

angleInput.addEventListener('wheel', function(event) {
    event.preventDefault();
    let delta = event.deltaY > 0 ? -1 : 1;
    rotatingAngle = Math.max(1, Math.min(9, rotatingAngle + delta));
    angleInput.value = rotatingAngle;
});

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7, 60);// (0, 7, 55)

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.75);
document.getElementById('stlCanvas').appendChild(renderer.domElement);

// Set camera aspect ratio and update
camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
camera.updateProjectionMatrix();

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Load STL files and define hierarchical structure
const loader = new THREE.STLLoader();

// Structure Control
// Base (the root object of the robotic arm)
let baseGroup = new THREE.Group();
scene.add(baseGroup); // Add baseGroup to the scene
loader.load('./stl/0base.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -18.4, 0);
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(-1.57, 0, 0);
    baseGroup.add(mesh);  // Add mesh to base group
    console.log("Base loaded successfully");
});

// Base Control
// Shoulder (child of the base)
let shoulderGroup = new THREE.Group();
baseGroup.add(shoulderGroup); // Attach shoulder to baseGroup
loader.load('/stl2/1shoulder.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -10, 0);
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(-1.57, 0, 0);
    shoulderGroup.add(mesh);  // Add mesh to shoulder group
});

//elbow
// Upperarm (child of the shoulder)
let elbowPivotGroup = new THREE.Group(); // Create a pivot group for the elbow
shoulderGroup.add(elbowPivotGroup); // Attach elbowPivotGroup to shoulderGroup
// (-16, 6, -2)
elbowPivotGroup.position.set(-16, 6, -2); // Set pivot group position to the elbow's CoM
let elbowGroup = new THREE.Group();
elbowPivotGroup.add(elbowGroup); // Attach elbow to shoulderGroup
loader.load('/stl2/2elbow.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(3.14, 0, 2.8);
    elbowGroup.add(mesh);  // Add mesh to elbow group

    // Visualize the center of mass for the base
    // const baseCoM = new THREE.Vector3(-16, 6, -2); // Example CoM for the base
    // visualizeCenterOfMass(geometry, 0xff0000, baseCoM); // Red color
});

//wrist
// Elbow (child of the elbow)
let wristPivotGroup = new THREE.Group(); // Create a pivot group for the wrist
elbowGroup.add(wristPivotGroup); // Attach wristPivotGroup to elbowGroup
// (22.5, 22.5, 3.3)
wristPivotGroup.position.set(33, 11.5, -2); // Set pivot group position to the wrist's CoM
let wristGroup = new THREE.Group();
wristPivotGroup.add(wristGroup); // Attach wrist to elbowGroup
loader.load('/stl2/3wrist.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(4.5, 5, 7);
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(1.57, 3.14, 0);
    wristGroup.add(mesh);  // Add mesh to wrist group
    
    // Visualize the center of mass for the base 33 - 16, 10.5 + 6, 3.8 + 2
    // const wristCoM = new THREE.Vector3(33 - 16, 11.5 + 6, -2 + 2); // Example CoM for the base
    // visualizeCenterOfMass(geometry, 0xff0000, wristCoM); // Red color
});

//Hand
// Forearm (child of the wrist)
let handPivotGroup = new THREE.Group(); // Create a pivot group for the hand
wristGroup.add(handPivotGroup); // Attach handPivotGroup to wristGroup
// (-9, 22.5, 5) old - not standard
handPivotGroup.position.set(-26, 5, 8); // Set pivot group position to the hand's CoM
let handGroup = new THREE.Group();
handPivotGroup.add(handGroup); // Attach handGroup to handPivotGroup
loader.load('/stl2/4hand.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0); // Position the mesh at the origin of the handGroup
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(-1.57, 0, 0);// (-1.57, 0, 0)
    handGroup.add(mesh);  // Add mesh to hand group

    // Visualize the center of mass for the hand
    // const handCoM = new THREE.Vector3(-9, 23, 0); // Example CoM for the base
    // visualizeCenterOfMass(geometry, 0xff0000, handCoM); // Red color
});

//forehand
// Wrist (child of the hand)
let forehandPivotGroup = new THREE.Group(); // Create a pivot group for the hand
handGroup.add(forehandPivotGroup); // Attach handPivotGroup to wristGroup
forehandPivotGroup.position.set(-10, 0, -1); // Set pivot group position to the hand's CoM
let forehandGroup = new THREE.Group();
forehandPivotGroup.add(forehandGroup); // Attach handGroup to handPivotGroup
loader.load('/stl2/5forehand.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-6, 0, -0.5); // Position the mesh at the origin of the handGroup
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(1.57, 3.14, 1.57);
    forehandGroup.add(mesh);  // Add mesh to hand group

    // Visualize the center of mass for the hand
    // const forehandCoM = new THREE.Vector3(-26, 30, 0); // Example CoM for the base
    // visualizeCenterOfMass(geometry, 0xff0000, forehandCoM); // Red color
});

//finger
// Palm (child of the forehand)
let fingerPivotGroup = new THREE.Group(); // Create a pivot group for the hand
forehandGroup.add(fingerPivotGroup); // Attach handPivotGroup to wristGroup
fingerPivotGroup.position.set(-10, 0, -1); // Set pivot group position to the hand's CoM
let fingerGroup = new THREE.Group();
fingerPivotGroup.add(fingerGroup); // Attach handGroup to handPivotGroup
loader.load('/stl2/6finger.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0); // Position the mesh at the origin of the handGroup
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(0, 3.14, 0);
    fingerGroup.add(mesh);  // Add mesh to hand group

    // Visualize the center of mass for the hand
    // const fingerCoM = new THREE.Vector3(-26, 30, 0); // Example CoM for the base
    // visualizeCenterOfMass(geometry, 0xff0000, fingerCoM); // Red color
});


// Gripper (child of the finger)
let gripperPivotGroup = new THREE.Group(); // Create a pivot group for the hand
fingerGroup.add(gripperPivotGroup); // Attach handPivotGroup to wristGroup
gripperPivotGroup.position.set(-8, 0, 0); // Set pivot group position to the hand's CoM
let gripperGroup = new THREE.Group();
gripperPivotGroup.add(gripperGroup); // Attach handGroup to handPivotGroup
loader.load('/stl2/7gripper.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0); // Position the mesh at the origin of the handGroup
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.rotation.set(1.57, 1.57, 1.57);
    gripperGroup.add(mesh);  // Add mesh to hand group

    // Visualize the center of mass for the hand
    // const fingerCoM = new THREE.Vector3(-26, 30, 0); // Example CoM for the base
    // visualizeCenterOfMass(geometry, 0xff0000, fingerCoM); // Red color
});

// Setting Inital Rotation
baseGroup.rotation.y = THREE.Math.degToRad(0);
shoulderGroup.rotation.y = THREE.Math.degToRad(-220);
elbowGroup.rotation.z = THREE.Math.degToRad(-10);
wristGroup.rotation.z = THREE.Math.degToRad(-20);
handGroup.rotation.x = THREE.Math.degToRad(0);
forehandGroup.rotation.z = THREE.Math.degToRad(70);
fingerGroup.rotation.x = THREE.Math.degToRad(70);
gripperGroup.rotation.z = THREE.Math.degToRad(0);



function visualizeCenterOfMass(geometry, color, position) {
    // Create a small sphere to represent the CoM
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16); // Small radius
    const material = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(sphereGeometry, material);

    // Set the position of the sphere to the given position
    sphere.position.copy(position);

    // Add the sphere to the scene
    scene.add(sphere);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Key press event handling
let isRPressed = false;
let isBPressed = false;
let isSPressed = false;
let isUPressed = false;
let isEPressed = false;
let isFPressed = false;
let isWPressed = false;
let isPPressed = false;
let isGPressed = false;

function structureControl(structure, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        baseGroup.rotation.y -= rotationAmount; // Clock
    } else if (direction === 'clock') {
        baseGroup.rotation.y += rotationAmount; // Counter
    }
}
function baseControl(base, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        shoulderGroup.rotation.y -= rotationAmount; // Clock
        sendCommand('clock', 'base');
    } else if (direction === 'clock') {
        shoulderGroup.rotation.y += rotationAmount; // Counter
        sendCommand('counter', 'base');
    }
}
function shoulderControl(shoulder, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        elbowGroup.rotation.z -= rotationAmount; // Clock
        sendCommand('clock', 'shouldere');
    } else if (direction === 'clock') {
        elbowGroup.rotation.z += rotationAmount; // Counter
        sendCommand('counter', 'shoulder');
    }
}
function upperarmControl(upperarm, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        wristGroup.rotation.z -= rotationAmount; // Clock
        sendCommand('clock', 'upperarm');
    } else if (direction === 'clock') {
        wristGroup.rotation.z += rotationAmount; // Counter
        sendCommand('counter', 'upperarm');
    }
}
function elbowControl(elbow, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        handGroup.rotation.x -= rotationAmount; // Clock
        sendCommand('clock', 'elbow');
    } else if (direction === 'clock') {
        handGroup.rotation.x += rotationAmount; // Counter
        sendCommand('counter', 'elbow');
    }
}
function forehandControl(forehand, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        forehandGroup.rotation.z -= rotationAmount; // Clock
        sendCommand('clock', 'forehand');
    } else if (direction === 'clock') {
        forehandGroup.rotation.z += rotationAmount; // Counter
        sendCommand('counter', 'forehand');
    }
}
function wristControl(wrist, direction) {
    const rotationAmount = THREE.Math.degToRad(rotatingAngle);
    if (direction === 'counter') {
        fingerGroup.rotation.x -= rotationAmount; // Clock
        sendCommand('clock', 'wrist');
    } else if (direction === 'clock') {
        fingerGroup.rotation.x += rotationAmount; // Counter
        sendCommand('counter', 'wrist');
    }
}

// Key down event
document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyR') {
        isRPressed = true;
    } else if (event.code === 'KeyB') {
        isBPressed = true;
    } else if (event.code === 'KeyS') {
        isSPressed = true;
    } else if (event.code === 'KeyU') {
        isUPressed = true;
    } else if (event.code === 'KeyE') {
        isEPressed = true;
    } else if (event.code === 'KeyF') {
        isFPressed = true;
    } else if (event.code === 'KeyW') {
        isWPressed = true;
    } else if (event.code === 'KeyP') {
        isPPressed = true;
    } else if (event.code === 'KeyG') {
        isGPressed = true;
    }
    
    if (isRPressed) {
        if (event.code === 'ArrowLeft') {
            structureControl('structure', 'counter');
        }
        if (event.code === 'ArrowRight') {
            structureControl('structure', 'clock');
        }
    } else if (isBPressed) {
        if (event.code === 'ArrowLeft') {
            baseControl('base', 'counter');
        }
        if (event.code === 'ArrowRight') {
            baseControl('base', 'clock');
        }
    } else if (isSPressed) {
        if (event.code === 'ArrowUp') {
            shoulderControl('shoulder', 'counter');
        }
        if (event.code === 'ArrowDown') {
            shoulderControl('shoulder', 'clock');
        }
    } else if (isUPressed) {
        if (event.code === 'ArrowUp') {
            upperarmControl('upperarm', 'counter');
        }
        if (event.code === 'ArrowDown') {
            upperarmControl('upperarm', 'clock');
        }
    } else if (isEPressed) {
        if (event.code === 'ArrowUp') {
            elbowControl('elbow', 'counter');
        }
        if (event.code === 'ArrowDown') {
            elbowControl('elbow', 'clock');
        }
    } else if (isFPressed) {
        if (event.code === 'ArrowUp') {
            forehandControl('forehand', 'counter');
        }
        if (event.code === 'ArrowDown') {
            forehandControl('forehand', 'clock');
        }
    } else if(isWPressed) {
        if (event.code === 'ArrowUp') {
            wristControl('wrist', 'counter');
        }
        if (event.code === 'ArrowDown') {
            wristControl('wrist', 'clock');
        }
    }
    
});

// Key up event for R key
document.addEventListener('keyup', function (event) {
    if (event.code === 'KeyR') {
        isRPressed = false;
    } else if (event.code === 'KeyB') {
        isBPressed = false;
    } else if (event.code === 'KeyS') {
        isSPressed = false;
    } else if (event.code === 'KeyU') {
        isUPressed = false;
    } else if (event.code === 'KeyE') {
        isEPressed = false;
    } else if (event.code === 'KeyF') {
        isFPressed = false;
    } else if (event.code === 'KeyW') {
        isWPressed = false;
    } else if (event.code === 'KeyP') {
        isPPressed = false;
    } else if (event.code === 'KeyG') {
        isGPressed = false;
    }
});


// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth * 0.4;
    const height = window.innerHeight * 0.75;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

export {structureControl, baseControl, shoulderControl, upperarmControl, elbowControl, wristControl, forehandControl};
