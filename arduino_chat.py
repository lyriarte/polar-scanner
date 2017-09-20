#!/usr/bin/python

import serial, sys

if len(sys.argv) < 2:
	print "Usage:", sys.argv[0], "<device> <speed> [word]*"
	exit()

device = sys.argv[1]
speed = 9600
chatscript = []
if len(sys.argv) >= 3 :
	speed = int(sys.argv[2])
if len(sys.argv) > 3 :
	chatscript = sys.argv[3:]
	chatscript.append("")

tty = serial.Serial(device, speed)
istr = ""
while (len(chatscript) > 0):
	istr += tty.read()
	if (len(istr) >= 2 and istr[len(istr)-2:] == ": "):
		print istr
		ostr = chatscript.pop(0)
		print ostr
		tty.write(ostr)
		istr = ""

try:
	while True:
		istr += tty.read()
		if ((len(istr) >= 2 and istr[len(istr)-2:] == ": ") or (istr[len(istr)-1] == "\n")):
			print istr
			istr = ""
except KeyboardInterrupt:
		pass
print istr




