let gearTeeth = 20;
let gearRatio = 2.5;
let gearSpeed = 150; // RPM
let gearDiameter = 10; // cm

function calculateCircumference(diameter) {
  let circumference = Math.PI * diameter;
  console.log('Circumference calculated:', circumference);
  return circumference;
}

function calculateDrivenSpeed(driverSpeed, ratio) {
  let drivenSpeed = driverSpeed / ratio;
  console.log('Driven speed calculated:', drivenSpeed);
  return drivenSpeed;
}

function calculateGearRatio(teeth1, teeth2) {
  let ratio = teeth1 / teeth2;
  console.log('Gear ratio calculated:', ratio);
  return ratio;
}

let circumference = calculateCircumference(gearDiameter);
let drivenSpeed = calculateDrivenSpeed(gearSpeed, gearRatio);
let calculatedRatio = calculateGearRatio(gearTeeth, gearTeeth / gearRatio);

console.log('Gear calculations complete.');