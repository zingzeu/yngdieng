import sys
from os import listdir
from os.path import isfile, join

def get_input_files(input_dir):
    return [f for f in listdir(input_dir) \
        if isfile(join(input_dir, f)) and (f.endswith('.txt') or f.endswith('.csv') or f.endswith('.tsv') )]

def in_range(c, unicode_block='A'):
    if 0x3400 <= ord(c) <= 0x4DBF:
        return 'A' in unicode_block
    if 0x20000 <= ord(c) <= 0x2A6D6:
        return 'B' in unicode_block
    if 0x2A700 <= ord(c) <= 0x2B73F:
        return 'C' in unicode_block
    if 0x2B740 <= ord(c) <= 0x2B81F:
        return 'D' in unicode_block
    if 0x2B820 <= ord(c) <= 0x2CEAF:
        return 'E' in unicode_block
    if 0x2CEB0 <= ord(c) <= 0x2EBEF:
        return 'F' in unicode_block
    if 0x30000 <= ord(c) <= 0x3134F:
        return 'G' in unicode_block
    return False

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
        input_dir = 'input_text'
        output_path = join('charset_scanned', 'charset_B.txt')
        unicode_block = 'B'

    process(input_dir, output_path, unicode_block)

if __name__ == "__main__":
    main()