#!/bin/sh

mkdir -p charset_scanned input_text output_fonts preview


python3 ./process.py ./input_text ./charset_scanned/charset_A.txt A
python3 ./process.py ./input_text ./charset_scanned/charset_B.txt B

pyftsubset TH-Sung-TP0.ttf \
  --text-file='./charset_scanned/charset_A.txt' \
  --output-file='./output_fonts/yngdieng-extended-A.ttf' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --xml > ./preview/subset_A_ttf.txt

pyftsubset TH-Sung-TP0.ttf \
  --text-file='./charset_scanned/charset_A.txt' \
  --output-file='./output_fonts/yngdieng-extended-A.woff' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --flavor=woff \
  --xml > ./preview/subset_A_woff.txt

pyftsubset TH-Sung-TP2.ttf \
  --text-file='./charset_scanned/charset_B.txt' \
  --output-file='./output_fonts/yngdieng-extended-B.ttf' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --xml > ./preview/subset_B_ttf.txt

pyftsubset TH-Sung-TP2.ttf \
  --text-file='./charset_scanned/charset_B.txt' \
  --output-file='./output_fonts/yngdieng-extended-B.woff' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --flavor=woff \
  --xml > ./preview/subset_B_woff.txt

echo 'Please copy the font files into /web/src/assets/fonts.'
