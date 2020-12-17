#!/bin/sh

mkdir -p charset_scanned input_text output_fonts preview

# get zingzeu data
cd input_text
if [ ! -d "./zingzeu-data" ]
then
  git clone git@github.com:ztl8702/zingzeu-data.git
else
  cd zingzeu-data
  git pull
  cd ..
fi
cp ./zingzeu-data/cikling/CikLinBekIn.csv CikLinBekIn.csv 2>/dev/null \
  && echo "√ CikLinBekIn.csv is updated." || echo "[!] CikLinBekIn.csv is missing."
cp ./zingzeu-data/contrib.tsv contrib.tsv 2>/dev/null \
  && echo "√ contrib.tsv is updated." || echo "[!] contrib.tsv is missing."
cp ./zingzeu-data/feng.txt feng.txt 2>/dev/null \
  && echo "√ feng.txt is updated" || echo "[!] feng.txt is missing."
cp ./zingzeu-data/li.txt li.txt 2>/dev/null \
  && echo "√ li.txt is updated" || echo "[!] li.txt is missing."
cp ./zingzeu-data/zingzeu_words.txt zingzeu_words.txt 2>/dev/null \
  && echo "√ zingzeu_words.txt is updated" || echo "[!] zingzeu_words.txt is missing."
cp ./zingzeu-data/feng_zeu_mapping.txt feng_zeu_mapping.txt 2>/dev/null \
  && echo "√ feng_zeu_mapping.txt is updated " || echo "[!] feng_zeu_mapping.txt is missing."
cd ..

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

pyftsubset TH-Sung-TP2.ttf \
  --text-file='./charset_scanned/charset_all.txt' \
  --output-file='./output_fonts/yngdieng-extended-1.ttf' \
  --xml > ./preview/subset_all_ttf_2.txt

pyftsubset TH-Sung-TP2.ttf \
  --text-file='./charset_scanned/charset_all.txt' \
  --output-file='./output_fonts/yngdieng-extended-1.woff' \
  --flavor=woff \
  --xml > ./preview/subset_all_woff_2.txt

echo "\t====== Subsetting finished ======"

cp -f ./output_fonts/* ../../web/src/assets/fonts/ \
  && echo "Font files are copied to yngdieng/web/src/assets/fonts/"
