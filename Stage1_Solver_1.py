import subprocess

cdb_path = "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\cdb.exe"
exe_path = "C:\\CTF\\DoPClient.exe"
flag_path = "C:\\CTF\\input.txt"
script_path = "C:\\CTF\\script.txt"

dbg_cmd = f"$$< {script_path}"

with open(script_path,"w") as f:
    cmd = ""
    cmd += "g ;"
    cmd += "p ;"
    cmd += ".if (@zf == 1) { .printf \"Solver: R8 is %d\\n\", @r8 ; " + f"$$< {script_path}" + " } .else { .echo \"Fail.\" ; .kill }"
    f.write(cmd)

command = f"\"{cdb_path}\" -G -o -kqm -c \"bp !DoPClient+0x17ca ; {dbg_cmd}\" \"{exe_path}\" < \"{flag_path}\""

i = 4
flag = r"FLAG{"
while(i < 44):
    for j in range(0x20,0x7e):
        with open(flag_path,"w") as f:
            word = ""
            word += flag
            word += chr(j)
            word += "A"*(45 - (len(flag)+1))
            word += "\n"
            f.write(word)

        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        print("")
        print("============================================================")

        for line in stdout.decode("utf-8").split("\n"):
            if line.startswith("Solver:"):
                print(line)
            
            if line.startswith("Solver: R8 is"):
                t = int(line.split(" ")[-1])

        print("============================================================")

        if t > i:
            i = t
            flag += chr(j)
            print(f"Flag: {flag}, i: {i}")
            break
        
print(flag)
