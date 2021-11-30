#!/bin/sh

mkdir -p charset_scanned input_text output_fonts preview

python3 ./process.py ./input_text ./charset_scanned/charset_all.txt ABCDEFG

echo "\t====== Feel free to ignore warning messages below ======"

pyftsubset TH-Sung-TP0.ttf \
  --text-file='./charset_scanned/charset_all.txt' \
  --output-file='./output_fonts/yngdieng-extended-0.ttf' \
  --xml > ./preview/subset_all_ttf_0.txt

pyftsubset TH-Sung-TP0.ttf \
  --text-file='./charset_scanned/charset_all.txt' \
  --output-file='./output_fonts/yngdieng-extended-0.woff' \
  --flavor=woff \
  --xml > ./preview/subset_all_woff_0.txt

pyftsubset CJKExtB-G.ttf \
  --text-file='./charset_scanned/charset_all.txt' \
  --output-file='./output_fonts/yngdieng-extended-1.ttf' \
  --xml > ./preview/subset_all_ttf_2.txt

pyftsubset CJKExtB-G.ttf \
  --text-file='./charset_scanned/charset_all.txt' \
  --output-file='./output_fonts/yngdieng-extended-1.woff' \
  --flavor=woff \
  --xml > ./preview/subset_all_woff_2.txt

echo "\t====== Subsetting finished ======"

cp -f ./output_fonts/* ../../web/src/assets/fonts/ \
  && echo "Font files are copied to yngdieng/web/src/assets/fonts/"
