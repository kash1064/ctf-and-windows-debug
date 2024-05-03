import os
import subprocess

exe_path = "C:\\CTF\\HelloWorld.exe"
for i in range(0x20,0x7F):
	if chr(i) in ["\\","?","<",">",":","*","|","\"",".","/"]:
		continue

	new_exe_path = "C:\\CTF\\{}.exe".format(chr(i)*9)
	os.rename(exe_path,new_exe_path)
	exe_path = new_exe_path
	proc = subprocess.Popen([exe_path])
	proc.kill()