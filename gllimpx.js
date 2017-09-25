/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
function Matrix(l, c, data)
{
	this.nLines = l || 1;
	this.nCols = c || 1;
	this.cell = data;
	if (this.cell)
		return this;
	this.cell = new Array(this.nLines);
	for (var i=0; i<this.nLines; i++)
	{
		this.cell[i] = new Array(this.nCols);
		for (var j=0; j<this.nCols; j++)
		{
			this.cell[i][j]=0;
		}
	}
	return this;
};

Matrix.prototype.mul = function(aMatrix)
{
	if (aMatrix.nLines != this.nCols)
		return null;
	var mResult = new Matrix(this.nLines, aMatrix.nCols);
	for (var i=0; i<mResult.nLines; i++)
	{
		for (var j=0; j<mResult.nCols; j++)
		{
			mResult.cell[i][j]=0;
			for (var k=0; k<this.nCols; k++)
			{
				mResult.cell[i][j] += this.cell[i][k] * aMatrix.cell[k][j];
			}
		}
	}
	return mResult;
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
Matrix3D.prototype = new Matrix();
Matrix3D.prototype.constructor = Matrix;

function Matrix3D() {
	Matrix.call(this,4,4);
	for (var i=0; i<this.nLines; i++)
		this.cell[i][i] = 1;
	return this;
};

Matrix3D.translation = function(x, y, z)
{
	var result = new Matrix3D();
	result.cell[0][3] = x;
	result.cell[1][3] = y;
	result.cell[2][3] = z;
	return result;
};

Matrix3D.scale = function(x, y, z)
{
	var result = new Matrix3D();
	result.cell[0][0] = x;
	result.cell[1][1] = y;
	result.cell[2][2] = z;
	return result;
};

Matrix3D.rotationX = function(teta)
{
	var result = new Matrix3D();
	result.cell[1][1] = Math.cos(teta);
	result.cell[1][2] = Math.sin(teta);
	result.cell[2][1] = -1 * Math.sin(teta);
	result.cell[2][2] = Math.cos(teta);
	return result;
};

Matrix3D.rotationY = function(teta)
{
	var result = new Matrix3D();
	result.cell[0][0] = Math.cos(teta);
	result.cell[0][2] = -1 * Math.sin(teta);
	result.cell[2][0] = Math.sin(teta);
	result.cell[2][2] = Math.cos(teta);
	return result;
};

Matrix3D.rotationZ = function(teta)
{
	var result = new Matrix3D();
	result.cell[0][0] = Math.cos(teta);
	result.cell[0][1] = Math.sin(teta);
	result.cell[1][0] = -1 * Math.sin(teta);
	result.cell[1][1] = Math.cos(teta);
	return result;
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
Vector.prototype = new Matrix();
Vector.prototype.constructor = Matrix;

function Vector(l) {
	Matrix.call(this,l,1);
	return this;
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
Vector3D.prototype = new Vector();
Vector3D.prototype.constructor = Vector;

function Vector3D(x,y,z) {
	Vector.call(this,4);
	this.cell[0][0] = x ? x : 0;
	this.cell[1][0] = y ? y : 0;
	this.cell[2][0] = z ? z : 0;
	this.cell[3][0] = 1;
	return this;
};

Vector3D.prototype.transformThis = function(aMatrix)
{
	var x,y,z;
	var mCell = aMatrix.cell;
	x = (mCell[0][0] * this.cell[0][0])
	  + (mCell[0][1] * this.cell[1][0])
	  + (mCell[0][2] * this.cell[2][0])
	  +  mCell[0][3];
	y = (mCell[1][0] * this.cell[0][0])
	  + (mCell[1][1] * this.cell[1][0])
	  + (mCell[1][2] * this.cell[2][0])	
	  +  mCell[1][3];
	z = (mCell[2][0] * this.cell[0][0])
	  + (mCell[2][1] * this.cell[1][0])
	  + (mCell[2][2] * this.cell[2][0])
	  +  mCell[2][3];
	this.cell[0][0] = x;
	this.cell[1][0] = y;
	this.cell[2][0] = z;
	return this;
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
function Object3D()
{
	this.color = null;
	this.name = null;
	
	this.mesh = new Mesh(0,0,null,null);
	this.position = new Matrix3D();
	this.orientation = new Matrix3D();
	this.scale = new Matrix3D();
	this.transformation = new Matrix3D();
	this.updatedTransform = null;
	
	this.nChild = 0;
	this.nFacet = 0;
	this.nFacetTotal = 0;
	
	this.child = null;
	this.parent = null;
	return this;
};

Object3D.prototype.setScale = function(s) 
{
	this.scale = s;
	this.transformation = this.position.mul(this.orientation).mul(this.scale);
	this.updatedTransform = null;
	return this;
};

Object3D.prototype.setOrientation = function(o) 
{
	this.orientation = o;
	this.transformation = this.position.mul(this.orientation).mul(this.scale);
	this.updatedTransform = null;
	return this;
};

Object3D.prototype.setPosition = function(p) 
{
	this.position = p;
	this.transformation = this.position.mul(this.orientation).mul(this.scale);
	this.updatedTransform = null;
	return this;
};

Object3D.prototype.transform = function(trans) 
{
	this.transformation = this.transformation.mul(trans);
	this.updatedTransform = null;
	return this;
};

Object3D.prototype.addChild = function(obj)
{
	obj.parent = this;
	if (obj.color == null)
		obj.color = this.color;
	if (this.child == null)
		this.child = new Array();
	this.child.push(obj);
	this.nChild++;
	return this;
};

Object3D.prototype.update = function(focal, screenX, screenY) 
{
	var i, nEdge;
	nEdge = 0;
	if (this.parent != null && this.parent.updatedTransform != null)
		this.updatedTransform = this.parent.updatedTransform.mul(this.transformation);
	else
		this.updatedTransform = this.transformation;
	for (i = 0; i < this.nChild; i++) {
		nEdge += this.child[i].update(focal, screenX, screenY);
	}
	if (this.mesh.nEdge > 0) {
		var transMesh = this.mesh.transform(this.updatedTransform);
		this.mesh.setWireframe(transMesh.updateWireframe(focal, screenX, screenY));
	}
	return nEdge + this.mesh.nEdge;
};

Object3D.prototype.paint = function(gc, parentColor) 
{
	var paintColor = this.color ? this.color : parentColor;
	var i;
	for (i = 0; i < this.nChild; i++) {
		this.child[i].paint(gc, paintColor);
	}
	this.mesh.drawWireframe(gc, paintColor);
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
function Mesh(nV, nE, v, e) 
{
	this.nVertex = nV;
	this.nEdge = nE;
	this.vertex = v;
	this.edge = e;
	this.scrX = new Array(this.nVertex);
	this.scrY = new Array(this.nVertex);
	this.lines = new Array(this.nEdge);		
	for (var i = 0; i < this.nEdge; i++)
		this.lines[i] = new Array(5);
	return this;
};

Mesh.prototype.transform = function(trans) {
	if (this.nVertex == 0)
		return this;
	var i;
	var transVertex = new Array(this.nVertex);
	for (i = 0; i < this.nVertex; i++) {
		transVertex[i] = trans.mul(this.vertex[i]);
	}
	return new Mesh(this.nVertex, this.nEdge, transVertex, this.edge);
};

Mesh.prototype.transformThis = function(trans) {
	if (this.nVertex == 0)
		return this;
	var i;
	for (i = 0; i < this.nVertex; i++) {
		this.vertex[i].transformThis(trans);
	}
	return this;
};

Mesh.prototype.updateWireframe = function(foc, sX, sY) {
	if (this.nEdge == 0)
		return null;
	var i, x0, y0, z;
	this.focal = foc;
	this.screenX = sX;
	this.screenY = sY;
	// screen center
	x0 = this.screenX / 2;
	y0 = this.screenY / 2;
	// Translate vertices to screen coordinates
	for (i = 0; i < this.nVertex; i++) {
		z = this.vertex[i].cell[2][0] > 0 ? this.vertex[i].cell[2][0] : 0.001;
		this.scrX[i] = Math.floor(x0 + this.vertex[i].cell[0][0] * this.focal / z);
		this.scrY[i] = Math.floor(y0 - this.vertex[i].cell[1][0] * this.focal / z);
	}
	// Create lines from mesh edges
	for (i = 0; i < this.nEdge; i++) {
		this.lines[i][0] = this.scrX[this.edge[i][0]];
		this.lines[i][1] = this.scrY[this.edge[i][0]];
		this.lines[i][2] = this.scrX[this.edge[i][1]];
		this.lines[i][3] = this.scrY[this.edge[i][1]];
		// z is the middle of this edge's ends on the z-axis
		this.lines[i][4] = (this.vertex[this.edge[i][0]].cell[2][0] + this.vertex[this.edge[i][1]].cell[2][0]) / 2;
	}
	return this;
};

Mesh.prototype.setWireframe = function(aMesh) 
{
	this.screenX = aMesh.screenX;
	this.screenY = aMesh.screenY;
	this.focal = aMesh.focal;
	this.scrX = aMesh.scrX;
	this.scrY = aMesh.scrY;
	this.lines = aMesh.lines;
	return this;
};

Mesh.prototype.drawWireframe = function(gc, color)
{
	var i;
	gc.beginPath();
	for (i = 0; i < this.nEdge; i++) {
		gc.moveTo(this.lines[i][0], this.lines[i][1]);
		if (this.lines[i][4] >= 0)
			gc.lineTo(this.lines[i][2], this.lines[i][3]);
	}
	gc.strokeStyle = color == null ? "#7F7F7F" : color;
	gc.stroke();
	gc.closePath();
	return this;
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
Box.prototype = new Object3D();
Box.prototype.constructor = Object3D;

function Box(x, y, z, fx) {
	Object3D.call(this);
	var dx = x / 2;
	var dy = y / 2;
	var dz = z / 2;
	var dbx = dx * (fx ? fx : 1);
	var v = new Array(8);
	// bottom rectangle
	v[0] = new Vector3D(-dbx, -dy, -dz);
	v[1] = new Vector3D(-dbx, -dy, dz);
	v[2] = new Vector3D(dbx, -dy, dz);
	v[3] = new Vector3D(dbx, -dy, -dz);
	// top rectangle
	v[4] = new Vector3D(-dx, dy, -dz);
	v[5] = new Vector3D(-dx, dy, dz);
	v[6] = new Vector3D(dx, dy, dz);
	v[7] = new Vector3D(dx, dy, -dz);
	var e = new Array(12);
	var i;
	for (i = 0; i < 12; i++)
		e[i] = new Array(2);
	for (i = 0; i < 4; i++) {
		// bottom rectangle
		e[i][0] = i;
		e[i][1] = (i + 1) % 4;
		// top rectangle
		e[i + 4][0] = i + 4;
		e[i + 4][1] = ((i + 1) % 4) + 4;
		// vertical lines
		e[i + 8][0] = i;
		e[i + 8][1] = i + 4;
	}
	this.mesh = new Mesh(8, 12, v, e);
	return this;
};
/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
PolyCone.prototype = new Object3D();
PolyCone.prototype.constructor = Object3D;

function PolyCone(nTotal, n, h, r)
{
	if (n < 3)
		n = 3;
	if (nTotal < n)
		nTotal = n;
	var dh = h / 2;
	var step = 2 * Math.PI / nTotal;
	var v = new Array(n + 1);
	var e = new Array(n * 2);
	var i;
	for (i = 0; i < n * 2; i++)
		e[i] = new Array(2);
	for (i = 0; i < n; i++) {
		// polygon
		v[i] = new Vector3D(r * Math.cos(i * step), -dh, r
				* Math.sin(i * step));
		e[i][0] = i;
		e[i][1] = (i + 1) % n;
		// vertical lines
		e[i + n][0] = n;
		e[i + n][1] = i;
	}
	v[n] = new Vector3D(0, dh, 0);
	this.mesh = new Mesh(n + 1, n * 2, v, e);
	return this;
};

/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
PolyCylinder.prototype = new Object3D();
PolyCylinder.prototype.constructor = Object3D;

function PolyCylinder(nTotal, n, h, r) 
{
	if (n < 3)
		n = 3;
	var dh = h / 2;
	var step = 2 * Math.PI / nTotal;
	var v = new Array(n * 2);
	var e = new Array(n * 3);
	var i;
	for (i = 0; i < n * 3; i++)
		e[i] = new Array(2);
	for (i = 0; i < n; i++) {
		// bottom polygon
		v[i] = new Vector3D(r * Math.cos(i * step), -dh, r
				* Math.sin(i * step));
		e[i][0] = i;
		e[i][1] = (i + 1) % n;
		// top polygon
		v[i + n] = new Vector3D(r * Math.cos(i * step), dh, r
				* Math.sin(i * step));
		e[i + n][0] = i + n;
		e[i + n][1] = ((i + 1) % n) + n;
		// vertical lines
		e[i + n * 2][0] = i;
		e[i + n * 2][1] = i + n;
	}
	this.mesh = new Mesh(n * 2, n * 3, v, e);
	return this;
};
/*
 * Copyright (c) 2010, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */
PolySphere.prototype = new Object3D();
PolySphere.prototype.constructor = Object3D;

function PolySphere(nTotal, n, r, frad) 
{
	if (n < 3)
		n = 3;
	if (nTotal < n)
		nTotal = n;
	var step = 2 * Math.PI / nTotal;
	var rLat, y;
	var nV = n * (n - 2) + 2;
	var v = new Array(nV);
	var nE = 2 * (nV - 2) + n;
	var e = new Array(nE);
	var i, j, f;
	for (i = 0; i < nE; i++)
		e[i] = new Array(2);
	// top
	v[nV - 1] = new Vector3D(0, r, 0);
	// bottom
	v[nV - 2] = new Vector3D(0, -r, 0);
	// lines from top
	for (i = 0; i < n; i++) {
		e[nE - (i + 1)][0] = nV - 1;
		e[nE - (i + 1)][1] = i;
	}
	// layers top down
	for (i = 0; i < n - 2; i++) {
		// top down
		rLat = frad * r * Math.sin(Math.PI * (i + 1) / (n - 1));
		y = r * Math.cos(Math.PI * (i + 1) / (n - 1));
		// polygon
		for (j = 0; j < n; j++) {
			var iV = i * n + j;
			v[iV] = new Vector3D(rLat * Math.cos(j * step), y, rLat
					* Math.sin(j * step));
			// line to next
			e[iV][0] = iV;
			e[iV][1] = i * n + ((j + 1) % n);
			// vertical lines to next below
			e[n * (n - 2) + iV][1] = iV;
			if (i < n - 3) {
				e[n * (n - 2) + iV][0] = iV + n;
			} else {
				e[n * (n - 2) + iV][0] = nV - 2;
			}
		}
	}
	this.mesh = new Mesh(nV, nE, v, e);
	return this;
};

/*
 * Copyright (c) 2012, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */


function x3dNode(object3D) {
	this.object3D = object3D;
	return this;
}


function x3d() {
	this.xmlDoc = null;
	this.scene = null;
	this.defNodes = new Array();
	this.viewpoints = new Array();
	this.circlelines = 6;
	return this;
}

x3d.prototype.defKey = function(aNode) {
	for (var iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "DEF") {
			this.defNodes[aNode.attributes.item(iatt).value] = aNode;
			return aNode.attributes.item(iatt).value;
		}
	}
	return null;
}

x3d.prototype.useKey = function(aNode) {
	for (var iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "USE") {
			if (this.defNodes[aNode.attributes.item(iatt).value])
				return this.defNodes[aNode.attributes.item(iatt).value];
		}
	}
	return aNode;
}

x3d.prototype.getObject3D = function(aTransformGroup) {
	var objName = this.defKey(aTransformGroup);
	aTransformGroup = this.useKey(aTransformGroup);
	var obj = null;
	var child = aTransformGroup.firstChild;
	while(child) {
		if (child.tagName == "Shape") {
			if (!obj)
				obj = this.getShape(child);
			else
				obj.addChild(this.getShape(child));
		}
		child = child.nextSibling;
	}
	if (!obj)
		obj = new Object3D();
	for (var iatt=0; iatt < aTransformGroup.attributes.length; iatt++) {
		if (aTransformGroup.attributes.item(iatt).name == "translation") {
			obj.setPosition(x3d.getTranslation(aTransformGroup.attributes.item(iatt).value));
		}
		else if (aTransformGroup.attributes.item(iatt).name == "rotation") {
			obj.setOrientation(x3d.getRotation(aTransformGroup.attributes.item(iatt).value));
		}
		else if (aTransformGroup.attributes.item(iatt).name == "scale") {
			obj.setScale(x3d.getScale(aTransformGroup.attributes.item(iatt).value));
		}
	}
	child = aTransformGroup.firstChild;
	while(child) {
		if (child.tagName == "Transform" || child.tagName == "Group")
			obj.addChild(this.getObject3D(child));
		child = child.nextSibling;
	}
	if (objName)
		obj.name = objName;
	return obj;
}


x3d.getColorString = function(fr, fg, fb) {
	var r = (Math.round(255*fr)).toString(16);
	if (r.length < 2) r = "0" + r;
	var g = (Math.round(255*fg)).toString(16);
	if (g.length < 2) g = "0" + g;
	var b = (Math.round(255*fb)).toString(16);
	if (b.length < 2) b = "0" + b;
	return "#" + r + g + b;
}
	
x3d.prototype.getColor = function(aAppearance) {
	this.defKey(aAppearance);
	aAppearance = this.useKey(aAppearance);
	var child = aAppearance.firstChild;
	while(child) {
		if (child.tagName == "Material") {
			for (var iatt=0; iatt < child.attributes.length; iatt++) {
				if (child.attributes.item(iatt).name == "diffuseColor") {
					var rgb = child.attributes.item(iatt).value.match(/\S+/g);
					return x3d.getColorString(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2]));
				}
			}
		}
		child = child.nextSibling;
	}
	return null;
}


x3d.prototype.getShape = function(aShape) {
	var objName = this.defKey(aShape);
	aShape = this.useKey(aShape);
	var obj = null;
	var color = null;
	var child = aShape.firstChild;
	while(child) {
		if (child.tagName == "Appearance") {
			color = this.getColor(child);
		}
		else if (child.tagName == "Cone") {
			obj = this.getCone(child);
		}
		else if (child.tagName == "Cylinder") {
			obj = this.getCylinder(child);
		}
		else if (child.tagName == "Sphere") {
			obj = this.getSphere(child);
		}
		else if (child.tagName == "Box") {
			obj = this.getBox(child);
		}
		else if (child.tagName == "IndexedFaceSet") {
			obj = this.getIndexedFaceSet(child);
		}
		child = child.nextSibling;
	}
	if (!obj)
		obj = new Object3D();
	if (color)
		obj.color = color;
	if (objName)
		obj.name = objName;
	return obj;
}

x3d.prototype.getCone = function(aNode) {
	var h=1;
	var r=1;
	for (var iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "height") {
			h=parseFloat(aNode.attributes.item(iatt).value);
		}
		else if (aNode.attributes.item(iatt).name == "bottomRadius") {
			r=parseFloat(aNode.attributes.item(iatt).value);
		}
	}
	return new PolyCone(this.circlelines,this.circlelines,h,r);
}

x3d.prototype.getCylinder = function(aNode) {
	var h=1;
	var r=1;
	for (var iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "height") {
			h=parseFloat(aNode.attributes.item(iatt).value);
		}
		else if (aNode.attributes.item(iatt).name == "radius") {
			r=parseFloat(aNode.attributes.item(iatt).value);
		}
	}
	return new PolyCylinder(this.circlelines,this.circlelines,h,r);
}

x3d.prototype.getSphere = function(aNode) {
	var r=1;
	for (var iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "radius") {
			r=parseFloat(aNode.attributes.item(iatt).value);
			break;
		}
	}
	return new PolySphere(this.circlelines,this.circlelines,r,1);
}

x3d.prototype.getBox = function(aNode) {
	var x=1;
	var y=1;
	var z=1;
	for (var iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "size") {
			var xyz = aNode.attributes.item(iatt).value.match(/\S+/g);
			x=parseFloat(xyz[0]);
			y=parseFloat(xyz[1]);
			z=parseFloat(xyz[2]);
			break;
		}
	}
	return new Box(x,y,z,1);
}

x3d.prototype.getIndexedFaceSet = function(aNode) {
	var iatt, i,j,k,l;
	var obj = new Object3D();
	var indexStr, indexes, xyzPoints;
	for (iatt=0; iatt < aNode.attributes.length; iatt++) {
		if (aNode.attributes.item(iatt).name == "coordIndex") {
			indexStr = aNode.attributes.item(iatt).value;
			indexes = indexStr.match(/\S+/g);
			break;
		}
	}
	var child = aNode.firstChild;
	while(child) {
		if (child.tagName == "Coordinate") {
			for (iatt=0; iatt < child.attributes.length; iatt++) {
				if (child.attributes.item(iatt).name == "point") {
					xyzPoints = child.attributes.item(iatt).value.match(/\S+/g);
					break;
				}
			}
			break;
		}
		child = child.nextSibling;
	}
	var nPoints = xyzPoints.length/3;
	var vertex = new Array(nPoints);
	for (i=0; i<nPoints; i++) {
	    vertex[i] = new Vector3D(parseFloat(xyzPoints[i*3]),parseFloat(xyzPoints[i*3+1]),-parseFloat(xyzPoints[i*3+2]));
	}
	i=j=0;
	while(i != -1) {
	    i=indexStr.indexOf("-1",i+1);
	    j++;
	}
	var nFaces = j-1;
	var nEdges = indexes.length-nFaces;
	var edges = new Array(nEdges);
	j=k=l=0;
	for (i=0; i<indexes.length; i++) {
		if (parseInt(indexes[i]) == -1) {
			for (k=j; k<i; k++) {
				edges[l] = new Array(2);
				edges[l][0]=parseInt(indexes[k]);
				edges[l][1]=parseInt(indexes[k+1]);
			    l++;
			}
			edges[l-1][1]=parseInt(indexes[j]);
			j=i+1;
	    }
	}
	obj.mesh = new Mesh(vertex.length,edges.length,vertex,edges);
	return obj;
}


x3d.getPosition = function(tosplit) {
	var xyz = tosplit.match(/\S+/g);
	return x3d.getTranslationMatrix(-parseFloat(xyz[0]),-parseFloat(xyz[1]),-parseFloat(xyz[2]));
}

x3d.getTranslation = function(tosplit) {
	var xyz = tosplit.match(/\S+/g);
	return x3d.getTranslationMatrix(parseFloat(xyz[0]),parseFloat(xyz[1]),parseFloat(xyz[2]));
}

x3d.getTranslationMatrix = function(x, y, z) {
	var m3d = Matrix3D.translation(x, y, -z);
	return m3d;
}

x3dNode.prototype.translation = function(x, y, z) {
	this.object3D.transform(x3d.getTranslationMatrix(x, y, z));
	return this;
}


x3d.getOrientation = function(tosplit) {
	var xyza = tosplit.match(/\S+/g);
	return x3d.getRotationMatrix(parseFloat(xyza[0]), parseFloat(xyza[1]), parseFloat(xyza[2]), -parseFloat(xyza[3]));
}

x3d.getRotation = function(tosplit) {
	var xyza = tosplit.match(/\S+/g);
	return x3d.getRotationMatrix(parseFloat(xyza[0]), parseFloat(xyza[1]), parseFloat(xyza[2]), parseFloat(xyza[3]));
}

x3d.getRotationMatrix = function(fx, fy, fz, teta) {
	var m3d = new Matrix3D();	
	if (fx != 0)
		m3d = m3d.mul(Matrix3D.rotationX(teta * fx));
	if (fy != 0)
		m3d = m3d.mul(Matrix3D.rotationY(teta * fy));
	if (fz != 0)
		m3d = m3d.mul(Matrix3D.rotationZ(teta * -fz));
	return m3d;
}

x3dNode.prototype.rotation = function(fx, fy, fz, teta) {
	this.object3D.transform(x3d.getRotationMatrix(fx, fy, fz, teta));
	return this;
}


x3d.getScale = function(tosplit) {
	var xyz = tosplit.match(/\S+/g);
	return x3d.getScaleMatrix(parseFloat(xyz[0]),parseFloat(xyz[1]),parseFloat(xyz[2]));
}

x3d.getScaleMatrix = function(x, y, z) {
	var m3d = Matrix3D.scale(x, y, -z);
	return m3d;
}

x3dNode.prototype.scale = function(x, y, z) {
	this.object3D.transform(x3d.getScaleMatrix(x, y, z));
	return this;
}

x3dNode.prototype.color = function(r, g, b) {
	this.object3D.color = x3d.getColorString(r, g, b);
	return this;
}


x3d.prototype.getViewpoint = function(aViewpoint) {
	var objName = this.defKey(aViewpoint);
	aViewpoint = this.useKey(aViewpoint);
	var obj = new Object3D();
	for (var iatt=0; iatt < aViewpoint.attributes.length; iatt++) {
		if (aViewpoint.attributes.item(iatt).name == "position") {
			obj.setPosition(x3d.getPosition(aViewpoint.attributes.item(iatt).value));
		}
		else if (aViewpoint.attributes.item(iatt).name == "orientation") {
			obj.setOrientation(x3d.getOrientation(aViewpoint.attributes.item(iatt).value));
		}
	}
	obj.name = objName;
	return obj;
}

x3d.prototype.setViewpoint = function(object3D) {
	var obj = this.scene.object3D;
	obj.transformation = obj.position.mul(obj.orientation).mul(obj.scale);
	obj.transform(object3D.transformation);
	return this;
}


x3d.prototype.getScene = function(xmlDoc) {
	this.xmlDoc = xmlDoc;
	this.defNodes = new Array();
	this.viewpoints = new Array();
	var jScene = this.xmlDoc.getElementsByTagName("Scene")[0];
	var child = jScene.firstChild;
	while(child) {
		if (child.tagName == "Appearance")
			this.getColor(child);
		else if (child.tagName == "Viewpoint")
			this.viewpoints.push(this.getViewpoint(child));
		child = child.nextSibling;
	}
	this.scene = new x3dNode(this.getObject3D(jScene));
	if (this.viewpoints.length == 0)
		this.viewpoints.push(new Object3D().setPosition(Matrix3D.translation(0,0,10)));
	this.setViewpoint(this.viewpoints[0]);
	return this.scene;
}


x3d.prototype.findObjectChildByName = function(defName, rootObj) {
	var obj = null;
	if (rootObj.name && rootObj.name == defName)
		return rootObj;
	for (var i=0; i<rootObj.nChild; i++) {
		obj = this.findObjectChildByName(defName, rootObj.child[i]);
		if (obj)
			return obj;
	}
	return null;
}


x3d.prototype.findObjectByPath = function(defPath) {
	var obj = this.scene.object3D;
	for (var i=0; i<defPath.length; i++) {
		obj = this.findObjectChildByName(defPath[i],obj);
		if (!obj)
			return null;
	}
	return new x3dNode(obj);
}
/*
 * Copyright (c) 2012, Luc Yriarte
 * All rights reserved.
 * 
 * License: BSD <http://www.opensource.org/licenses/bsd-license.php>
 * 
 */

function gllimpx()
{
	this.x3d = new x3d();
	this.canvas = null;
	this.gc = null;
	this.model = null;
	this.dragX = 0;
	this.dragY = 0;
	return this;	
}

gllimpx.prototype.parseX3d = function(x3dStr) {
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(x3dStr, "text/xml");
	this.model = this.x3d.getScene(xmlDoc);
	return this.model;
}

gllimpx.prototype.setCanvas = function(aCanvas) {
	this.canvas = aCanvas;
	this.gc = this.canvas.getContext("2d");
}

gllimpx.prototype.redrawCanvas = function() {
	this.x3d.scene.object3D.update(this.canvas.width / 2,this.canvas.width,this.canvas.height);
	this.gc.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.x3d.scene.object3D.paint(this.gc);  
}

gllimpx.prototype.onMouseDown = function(event) {
	this.dragX = event.clientX;
	this.dragY = event.clientY;
}

gllimpx.prototype.onMouseUp = function(event) {
	this.dragX = 0;
	this.dragY = 0;
}

gllimpx.prototype.rotateOnMouseMove = function(event) {
  if (this.model && (this.dragX || this.dragY)) {
	var deltaX = (event.clientX - this.dragX) * 2 * Math.PI / this.canvas.width;
	var deltaY = (this.dragY - event.clientY) * 2 * Math.PI / this.canvas.height;
	this.model.object3D.transform(
		Matrix3D.rotationY(deltaX).mul(
			Matrix3D.rotationX(deltaY)));
	this.redrawCanvas();
	this.dragX = event.clientX;
	this.dragY = event.clientY;
  }
}

gllimpx.prototype.translateOnMouseMove = function(event) {
  if (this.model && (this.dragX || this.dragY)) {
	var deltaX = (event.clientX - this.dragX) / this.canvas.width;
	var deltaY = (this.dragY - event.clientY) / this.canvas.height;
	this.model.translation(deltaX, deltaY, 0);
	this.redrawCanvas();
	this.dragX = event.clientX;
	this.dragY = event.clientY;
  }
}

gllimpx.prototype.zoomOnMouseMove = function(event) {
  if (this.model && this.dragY) {
	var deltaZ = (this.dragY - event.clientY) / this.canvas.height;
	this.model.translation(0, 0, deltaZ);
	this.redrawCanvas();
	this.dragX = event.clientX;
	this.dragY = event.clientY;
  }
}

