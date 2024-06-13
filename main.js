const coordinates = [
    [-2.820512821, 1.948717949, -2.871794872],
    [-2.615384615, 0.7692307692, -2.794871795],
    [-2.358974359, -1.179487179, 1.564102564],
    [-0.1282051282, -1.41025641, 0.7179487179],
    [0.1794871795, -2.076923077, 0.358974359],
    [0.7179487179, -1.794871795, -0.5641025641],
    [2, -2.41025641, -2.538461538],
    [-2.692307692, -0.7692307692, 1.512820513],
    [-2.948717949, 2, -3],
    [-2.615384615, 1.948717949, -2.871794872],
    [-2.666666667, 1.974358974, -2.897435897],
    [-2.948717949, 1.923076923, -2.846153846],
    [-2.923076923, 1.948717949, -2.871794872],
    [0.8461538462, -0.7435897436, -2.41025641],
    [-2.205128205, 1.076923077, -2.897435897],
    [-1.641025641, 1.076923077, -2.769230769],
    [-0.5641025641, 0.05128205128, -2.743589744],
    [-2.763157895, 1.41025641, -2.41025641],
    [-2.846153846, 1.256410256, -0.5384615385],
    [-2, 0.8974358974, -0.9487179487],
    [1.769230769, -1.769230769, -2.564102564],
    [1.666666667, -2.358974359, -1.769230769],
    [-0.9230769231, -1.230769231, 1.384615385],
    [1.769230769, -2, -1.948717949],
    [0.9230769231, -0.8205128205, -2.051282051],
];

const info = document.getElementById("info")

// Initialize Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Initialize camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("main").appendChild(renderer.domElement);

// Initialize controls for rotating the scene
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create axes
const axisXGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1000000, 0, 0) // X axis
]);
const axisYGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1000000, 0) // Y axis
]);
const axisZGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 10000000) // Z axis
]);

const axisMaterialX = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red for X axis
const axisMaterialY = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green for Y axis
const axisMaterialZ = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue for Z axis

const axisX = new THREE.Line(axisXGeometry, axisMaterialX);
const axisY = new THREE.Line(axisYGeometry, axisMaterialY);
const axisZ = new THREE.Line(axisZGeometry, axisMaterialZ);

scene.add(axisX);
scene.add(axisY);
scene.add(axisZ);

// Create points based on provided coordinates
const points = [];
coordinates.forEach((coord, i) => {
    const ci_percent = (((coord[0] + 3) / 5))
    const sc_percent = (((coord[1] + 3) / 5))
    const sa_percent = (((coord[2] + 3) / 5))

    const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial();
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    pointMaterial.color.setRGB(ci_percent, sc_percent, sa_percent)
    console.log(pointMaterial);
    point.position.set(coord[0] + 3, coord[1] + 3, coord[2] + 3);
    point.name = i
    scene.add(point);
    points.push(point);
});

// Create lines from points to the center

const lines = [];
coordinates.forEach(coord => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(coord[0] + 3, coord[1] + 3, coord[2] + 3),
        new THREE.Vector3(0, 0, 0) // Center point
    ]);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xd3d3d3 });
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
    lines.push(line);
});

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(points);

    points.forEach(p => {
        p.material.transparent = true
        p.material.opacity = 0.3
        lines[p.name].material.transparent = true
        lines[p.name].material.opacity = 0.3
    });

    if (intersects.length > 0) {
        const point = intersects[0].object
        const id = point.name

        point.material.transparent = false
        point.material.opacity = 1
        lines[id].material.transparent = false
        lines[id].material.opacity = 1

        const ci_percent = (((coordinates[id][0] + 0.5) / 2.5) * 100).toFixed(2)
        const sc_percent = (((coordinates[id][1] + 0.5) / 2.5) * 100).toFixed(2)
        const sa_percent = (((coordinates[id][2] + 0.5) / 2.5) * 100).toFixed(2)

        info.classList.add("open")
        info.innerHTML = `
            <div class="img">
                <img src="assets/${id + 1}.png" />
            </div>
            <div class="coordinates">
                Percentuale Scarpa: ${sc_percent}% <br>
                Percentuale Sandalo: ${sa_percent}% <br>
                Percentuale Ciabatta: ${ci_percent}%
            </div>
            
        `
    }
}

document.addEventListener('mousemove', onMouseMove, false);

// Render function
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

const calzature = document.getElementById("calzature");

coordinates.forEach((c) => {
    const s = document.createElement("div");
    s.innerHTML = "asd";
    calzature.appendChild(s);
});