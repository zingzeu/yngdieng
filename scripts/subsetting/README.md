# Font subsetting for yngdieng

This is a tool for font subsetting for yngdieng website.

### Prerequisites

The script uses [fonttools](https://github.com/fonttools/fonttools). You can install it with pip (pip3):

```
pip install fonttools
```


### Usage

Make sure you are under `yngdieng/scripts/subsetting` directory. 
Create a folder named `input_text` or run the following command: `mkdir -p input_text`.
Move all the text files (at the moment: feng.txt, CikLinBekIn.csv, DFDCharacters.csv) that we want out font covers to the folder `input_text`.
Now, run the command:
```
./subset.sh

```

Once the script stops, you may copy the subsetted font files into `/web/src/assets/fonts` or any directory that requires these subsetted fonts.
You may check details about subsetted fonts in `preview` directory. 

### Future improvements
<!-- This tool uses TH-Sung (天珩字库) as the original font. -->
The two font files could be merged into one.