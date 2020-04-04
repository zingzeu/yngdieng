import sys
from os import listdir
from os.path import isfile, join

def get_input_files(input_dir):
    return [f for f in listdir(input_dir) \
        if isfile(join(input_dir, f))]

def in_range(c, unicode_block='A'):
    if unicode_block == 'A':
        return 0x3400 < ord(c) and ord(c) < 0x4DBF
    if unicode_block == 'B':
        return 0x20000 < ord(c) and ord(c) < 0x2A6D6
    if unicode_block == 'AB':
        return (0x3400 < ord(c) and ord(c) < 0x4DBF) or \
            0x20000 < ord(c) and ord(c) < 0x2A6D6
    print("Error: Unicode_block should be set to 'A', 'B', or 'AB'.")
    return false

def scan(filename, charset, unicode_block='B'):
    with open(filename, 'r') as f:
        count = 0
        c = f.read(1)
        while c:
            if c not in charset and in_range(c, unicode_block):
                charset.add(c)
                count += 1
            c = f.read(1)
    print("scaned {} new characters from block extended-{} \
        in total from {}".format(count, unicode_block, filename))
    return charset


def process(input_dir, output_path, unicode_block='B'):
    input_files = get_input_files(input_dir)
    charset = set()
    if isfile(output_path):
        charset = scan(output_path, charset, unicode_block)
    for input_file in input_files:
        input_path = join(input_dir, input_file)
        with open(input_path, 'r') as f:
            charset = scan(input_path, charset, unicode_block)
        with open(output_path, 'w') as out:
            for hanzi in charset:
                out.write(hanzi + '\n')


def main():
    if len(sys.argv) == 4:
        input_dir = sys.argv[1]
        output_path = sys.argv[2]
        unicode_block = sys.argv[3]
    else:
        input_dir = 'input'
        output_path = join('.', 'charset_scaned.txt')
        unicode_block = 'B'
    process(input_dir, output_path, unicode_block)

if __name__ == "__main__":
    main()