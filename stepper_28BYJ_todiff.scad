module StepMotor28BYJ()
{

	difference(){
	
		union(){
				color("gray") cylinder(h = 19, r = 14 + jeu, center = true, $fn = 32);
				color("gray") translate([8,0,-1.5])	cylinder(h = 19, r = 4.5, center = true, $fn = 32);
				color("gold") translate([8,0,-10])	cylinder(h = 19, r = 2.5 + jeu, center = true, $fn = 32);


				color("Silver") translate([0,0,-9]) cube([7 + jeu,35,0.99], center = true);				
				color("Silver") translate([0,17.6,-9])	cylinder(h = 1, r = 3.5 + jeu/2, center = true, $fn = 32);

				color("Silver") translate([0,-17.6,-9])	cylinder(h = 1, r = 3.5 + jeu/2, center = true, $fn = 32);


				color("blue") translate([-3,0,-1]) cube([28 + jeu,16 + jeu,16.9 + jeu], center = true);
			}

				// handle
				color("red") translate([11,0,-16.55]) cube([4 + jeu,5 + jeu,6.1], center = true);
				color("red") translate([5,0,-16.55]) cube([4 + jeu,5 + jeu,6.1], center = true);

				// screw holes
				color("red") translate([0,17.5,-9])	cylinder(h = 2, r = 2 - jeu, center = true, $fn = 32);
				color("red") translate([0,-17.5,-9])	cylinder(h = 2, r = 2 - jeu, center = true, $fn = 32);
		}
	}


//StepMotor28BYJ();

