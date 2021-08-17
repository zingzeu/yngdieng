
import sys

def readfile(filename):
    with open(filename, 'r') as fin:
        line = fin.readline()
        zids = set()
        while line:
            s = line.split(',')[0]
            if s.startswith('/w/') and len(s) == 11:
                print(s[3:])
                zids.add(s[3:])
            line = fin.readline()
        print(len(zids))

def main():
    filename = sys.argv[1]
    readfile(filename)



if __name__ == '__main__':
    main()