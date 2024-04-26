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
    cmd += ".if (@zf == 1) { .printf \"Solver: Correct word in %d\\n\", @r8 ; " + f"$$< {script_path}" + " } .else { r zf=1 ; " + f"$$< {script_path}" + "}"
    f.write(cmd)

command = f"\"{cdb_path}\" -G -o -kqm -c \"bp !DoPClient+0x17ca ; {dbg_cmd}\" \"{exe_path}\" < \"{flag_path}\""


flag = ["" for i in range(45)]

print("============================================================")

for i in range(0x20,0x7e):
    with open(flag_path,"w") as f:
        word = chr(i)*45
        word += "\n"
        f.write(word)

    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    for line in stdout.decode("utf-8").split("\n"):          
        if line.startswith("Solver: Correct word"):
            t = int(line.split(" ")[-1])
            flag[t] = chr(i)
            print(f"flag[{t}] is {chr(i)}")

print("============================================================")

print("".join(flag))
