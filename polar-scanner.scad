jeu=0.2;

include<stepper_28BYJ_todiff.scad>
include<servo_SG90_todiff.scad>
include<hc-sr04-ultrasonic-sensor_todiff.scad>

tigeH=30;
deportX=25;

module sensor()
{
#    translate([0,0,-10]) rotate([90,0,180]) sensorHCSR04();
}

module stepper()
{
	translate([-8,0,9.5]) rotate([180,0,0]) StepMotor28BYJ();
}

module servo()
{
#    rotate([0,0,270]) translate([-sg90l/2,sg90L+sg90topCylinderH,0]) rotate([90,0,0]) servoSG90();
}

module dovetail(jeu_dovetail)
{
	hull()
	{
		cube([9,3+jeu_dovetail,0.1],center=true);
		translate([0,0,-2-jeu_dovetail]) cube([9,6+jeu_dovetail,0.1],center=true);
	}
}

module sensorholder()
{
    difference()
    {
        translate([0,0,-12]) rotate([90,0,180]) union()
        {
            difference()
            {
                cube([2.5,24,10]);
                translate([-0.1,12,5]) rotate([0,90,0]) cylinder(d=sg90axisD, h=1.5);
            }
            cube([52,24,2.5]);
        }
        translate([-6,2,0]) sensor();
    }
}

module tigeservo()
{
	difference()
	{
		hull()
		{
			cylinder(h=10, r=10);
			translate([deportX+5,0,0]) cylinder(h=tigeH, r=5);
		}
		translate([0,0,5]) rotate([0,90,180]) cylinder(h=50, r=1);
		translate([0,12,tigeH-5]) rotate([90,0,0]) scale([1,0.5,1]) cylinder(h=24, r=deportX+3);
		translate([deportX*4/3,12,0]) rotate([90,0,0]) cylinder(h=24, r=3+deportX/2);
		translate([deportX+9,0,tigeH]) dovetail(jeu);		
		translate([deportX+3,0,tigeH]) dovetail(jeu);		
		translate([0,0,-20]) stepper();
	}
}

module servoholder()
{
	difference() 
	{
		translate([1,-22.5,-2]) cube([9,35,16]);
		translate([0,0,0.1]) servo();
	}
	translate([5.5,0,-2]) dovetail(-jeu);
}

module tige()
{
	tigeservo();
	translate([deportX,0,tigeH+2]) servoholder();
}

module pied()
{
    long = 40;
    difference()
    {
        hull()
        {
            cylinder(h=5, d=5);
            translate([long,0,0]) cylinder(h=5, d=15);
        }
        translate([long,0,0]) cylinder(h=12, d=4, center=true);
    }    
}

module support()
{
    hull()
     {
		 translate([5,0,0]) cylinder(d=42,h=20.98);
         translate([-10,10,0]) cylinder(d=26,h=20.98);
         translate([-10,-10,0]) cylinder(d=26,h=20.98);
     }
    for (i=[0:3])
    {
        rotate([0,0,45+90*i]) pied();
    }
}

module base()
{
    difference()
    {
        support();
#        translate([0,0,2]) stepper();
    }
}

module polarScanner(angleZ,angleX)
{
	base();
	rotate([0,0,angleZ]) union()
	{
		translate([0,0,22]) tige();
		translate([deportX,0,tigeH + 22 + 6]) rotate([angleX,0,0]) translate([0,-5,0]) sensorholder();
	}
}

module print()
{
    base();
    translate([-10,50,0]) tigeservo();
    translate([-10,80,-1]) rotate([0,-90,90]) servoholder();
    translate([30,-50,0]) rotate([90,0,0]) sensorholder();
}


function scanAngles(t) = [ 
    t * 360 , 
    (t < 0.5 ? t : 1 - t) * 240 - 60
];
angles = scanAngles($t);

polarScanner(angles[0],angles[1]);

// print();