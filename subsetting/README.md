# Font subsetting for yngdieng

This is a tool for font subsetting for yngdieng website.

### Prerequisites

The script uses [fonttools](https://github.com/fonttools/fonttools). You can install it with pip:

```
pip install fonttools
```


### Usage

Make sure you are under `yngdient/subsetting` directory. 
Create a folder named `input_text` or run the following command: `mkdir -p input_text`.
Move all the text files that we want out font covers to the folder `input_text`.
Now, run the command:
```
./subset.sh

```

Once the script stops, you may copy the subsetted font files into `/web/src/assets/fonts` or any directory that requires these subsetted fonts.
You may check details about subsetted fonts in `preview` directory. 

### Future improvements
<!-- This tool uses TH-Sung (天珩字库) as the original font. -->
Currently, the script only works for characters from Unicode Extended-A and Extended-A. 