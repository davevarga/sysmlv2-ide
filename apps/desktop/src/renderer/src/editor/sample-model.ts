export const SAMPLE_SYSML = `// Hard-coded demo model
package VehicleModel {
    part def Engine;
    part def Wheel;

    part def Vehicle {
        part engine : Engine;
        part frontLeft : Wheel;
        part frontRight : Wheel;
        connect engine to frontLeft;
    }

    /* an instance */
    part car : Vehicle;
}
`
