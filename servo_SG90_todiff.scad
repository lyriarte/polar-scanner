sg90L = 22.8 + jeu;
sg90l = 12.6 + jeu;
sg90h = 22.8;
sg90topCylinderH = 3.4 + jeu;
sg90axisD = 4 + jeu;

module servoSG90() {
    L = sg90L;
    l = sg90l;
    h = sg90h;
    plateL = 32.5;
    plateH = 2.7;
    plateHPos = 16;
    topCylinderH = sg90topCylinderH;
    smallTopCylinderD = 4.5;
    
    axisH = 2;
    axisD = sg90axisD;
    
    screwHoleCenter=2;
    screwHoleD=2 - jeu;
    holeSize=1 - jeu;
    
    difference() {
        union() {
            color("LightBlue", 0.5) {
                // main part
                cube([L, l, h]);
                // support
                translate([-(plateL - L) / 2, 0, plateHPos]) {
                    cube([plateL, l, plateH]);
                }
                // top big cylinder
                translate([l/2,l/2,h]) {
                    cylinder(d=l, h=topCylinderH, $fn=180);
                }
                // top small cylinder
                translate([l, l/2, h]) { 
                    cylinder(d=smallTopCylinderD, h=topCylinderH, $fn=180);
                }
            }
            translate([l/2,l/2, h + topCylinderH]) {
                color("white") {
                    cylinder(d=axisD,h=axisH, $fn=180);
                }
            }
        }
    }
}

//servoSG90();
