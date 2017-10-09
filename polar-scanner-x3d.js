/*
 * Copyright (c) 2017, Luc Yriarte
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 */



var platformAbstract = {
};

if (typeof exports === "undefined") {
	platformAbstract.exports = {};
}
else {
	platformAbstract.exports = exports;
}



var PolarScanner = function() {
	this._stepper_steps = 512;
	this._servo_range = 180;
	this._us_precision = 0;
	return this;
}


PolarScanner.prototype.indexedFaceSet = function(stpInc, stpNbr, srvInc, srvNbr, srvFrm, scan) {

	var ifs = 
	{
		coordIndex: "",
		Coordinate: 
		{
			point: ""
		}
	};

	var coords = [];
	var stpAngle = 0;
	var srvAngle = 0;
	for (var i=0; i<scan.length; i++) {
		srvAngle = srvFrm + srvInc * (i % srvNbr);
		stpAngle += i != 0 && i % srvNbr == 0 ? stpInc : 0;
		coords.push((scan[i] * Math.sin(srvAngle) * Math.cos(stpAngle)).toFixed(this._us_precision)); // x
		coords.push((scan[i] * Math.cos(srvAngle)).toFixed(this._us_precision)); // y
		coords.push((scan[i] * Math.sin(srvAngle) * Math.sin(stpAngle)).toFixed(this._us_precision)); // z
	}

	var indexes = [];
	for (var i=0; i<stpNbr-1; i++) {
		for (var j=0; j<srvNbr-1; j++) {
			indexes.push(i * srvNbr + j);
			indexes.push(i * srvNbr + j+1);
			indexes.push((i+1) * srvNbr + j+1);
			indexes.push((i+1) * srvNbr + j);
			indexes.push(-1);
		}
	}

	indexes.map(function(x) {ifs.coordIndex += x + " "});
	coords.map(function(x) {ifs.Coordinate.point += x + " "});

	return ifs;
}


PolarScanner.prototype.x3dScan = function(stepper_step, stepper_nbr, servo_step, servo_nbr, servo_from, scan) {
	var ifs = this.indexedFaceSet(
		stepper_step * 2 * Math.PI / this._stepper_steps, stepper_nbr,
		servo_step * Math.PI / this._servo_range, servo_nbr, servo_from * Math.PI / this._servo_range,
		scan
	);
	return '<IndexedFaceSet coordIndex="' + ifs.coordIndex + '">' + "\n"
		+  "\t" + '<Coordinate point="' + ifs.Coordinate.point + '"/>' + "\n"
		+  '</IndexedFaceSet>' + "\n";
}



platformAbstract.exports.PolarScanner = PolarScanner;
