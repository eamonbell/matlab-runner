# MATLAB Selection Runner for Visual Studio Code

This extension gives Visual Studio Code the ability to run selected MATLAB code and show the output in a terminal window.

[![Marketplace](https://vsmarketplacebadge.apphb.com/version-short/eamonbell.matlab-runner.svg)](https://vsmarketplacebadge.apphb.com/version-short/eamonbell.matlab-runner.svg)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/eamonbell.matlab-runner.svg)](https://vsmarketplacebadge.apphb.com/installs/eamonbell.matlab-runner.svg)
[![GitHub issues](https://img.shields.io/github/issues/eamon-bell/matlab-runner.svg)](https://github.com/eamon-bell/matlab-runner/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Gimly/vscode-matlab.svg)](https://github.com/eamon-bell/matlab-runner/pulls)
[![GitHub license](https://img.shields.io/github/license/eamon-bell/matlab-runner.svg)](https://github.com/eamon-bell/matlab-runner/blob/master/LICENSE.txt)

Please open an issue for any bugs you find. I hacked this together for my own personal use, but if others see a benefit from using this I am happy to update it as needed.

# Demo
![Image](demos/demo3.gif)
# Please Note
This extension works best on mac as Matlab does not fully support running the executable from command prompt. Also, versions prior to 2017 will not work on windows at all.
# Setup
1. In settings, find 'matlab-runner.matlabPath' and set it to the location of the matlab executable.
For example (mac): '/Applications/MATLAB_R2017b/bin/matlab'
2. Create an empty matlab file ('something'.m) and save it
3. In settings, find 'matlab-runner.tempFilePath' and set it to the location of the file you just created. For example (mac): '/Users/username/Documents/temp.m'
4. The setting 'matlab-runner.clearPastRuns' is a true or false value (defaults to true) that indicates whether or not the previous output should be cleared from the terminal window upon a following execution.
5. The setting 'matlab-runner.powershell' is a true or flase value (defaults to false) that indicates whether or not matlab is being executed in powershell

# Using MATLAB Runner
While working on a MATLAB file, highlight the code you want to run, open the command palette to search 'Matlab: Run Selection', and execute the command.

The first time the command is executed it will open a new terminal for matlab which will take a few seconds, but each following execution will be instant.

Selecting 'Matlab: Run File' will run the entire contents of the current file. Make sure you save to see you changes reflected in the output.

