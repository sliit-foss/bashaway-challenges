let gearTeeth = 20;
let gearRatio = 2.5;
let gearSpeed = 150; // RPM
let gearDiameter = 10; // cm

console.log('Gear setup initialized.');

function calculateCircumference(diameter) {
    console.log('Calculating circumference for diameter:', diameter);
    let circumference = Math.PI * diameter;
    console.log('Circumference calculated:', circumference);
    return circumference;
}

// Function to calculate the speed of the driven gear
function calculateDrivenSpeed(driverSpeed, ratio) {
    console.log('Calculating driven speed with driverSpeed:', driverSpeed, 'and ratio:', ratio);
    let drivenSpeed = driverSpeed / ratio;
    console.log('Driven speed calculated:', drivenSpeed);
    return drivenSpeed;
}

// Function to calculate the gear ratio
function calculateGearRatio(teeth1, teeth2) {
    console.log('Calculating gear ratio with teeth1:', teeth1, 'and teeth2:', teeth2);
    let ratio = teeth1 / teeth2;
    console.log('Gear ratio calculated:', ratio);
    return ratio;
}

// Example usage
console.log('Starting example usage.');

let circumference = calculateCircumference(gearDiameter);

console.log('Circumference of the gear:', circumference);

let drivenSpeed = calculateDrivenSpeed(gearSpeed, gearRatio);
console.log('Speed of the driven gear:', drivenSpeed);

let calculatedRatio = calculateGearRatio(gearTeeth, gearTeeth / gearRatio);
console.log('Calculated gear ratio:', calculatedRatio);

console.log('Gear calculations complete.');



console.log('End of script.');