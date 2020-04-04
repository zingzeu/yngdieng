#!/bin/sh

python3 ./process.py ./input ./charset_scanned/charset_A.txt A
python3 ./process.py ./input ./charset_scanned/charset_B.txt B

pyftsubset TH-Sung-TP0.ttf \
  --text-file='./charset_scanned/charset_A.txt' \
  --output-file='./output_fonts/yngdieng-extended-A.ttf' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --xml > ./log/subset_A_ttf.log

pyftsubset TH-Sung-TP0.ttf \
  --text-file='./charset_scanned/charset_A.txt' \
  --output-file='./output_fonts/yngdieng-extended-A.woff' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --flavor=woff \
  --xml > ./log/subset_A_woff.log

pyftsubset TH-Sung-TP2.ttf \
  --text-file='./charset_scanned/charset_B.txt' \
  --output-file='./output_fonts/yngdieng-extended-B.ttf' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --xml > ./log/subset_B_ttf.log

pyftsubset TH-Sung-TP2.ttf \
  --text-file='./charset_scanned/charset_B.txt' \
  --output-file='./output_fonts/yngdieng-extended-B.woff' \
  --no-ignore-missing-unicodes --no-ignore-missing-glyphs \
  --flavor=woff \
  --xml > ./log/subset_B_woff.log

echo 'Please copy the font files into /web/src/assets/fonts.'
