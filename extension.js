// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
var term = null;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.runSelection', function () {
        // fs.writeFile('/Desktop/dev.txt', 'I am cool!',  function(err) {
        //     if (err) {
        //         console.log(err.message);
        //         vscode.window.showInformationMessage('Temp file not found');
        //     }
        //     console.log("File created!");
        // });
        var config = vscode.workspace.getConfiguration('matlab-runner');
        if (!config.has('matlabPath') || config['matlabPath'] == null) {
            vscode.window.showErrorMessage("Could not find path to the matlab executable in the configuration file.");
            return;
        }
        if (!config.has('tempFilePath') || config['tempFilePath'] == null) {
            vscode.window.showErrorMessage("Could not find path to the temp matlab file.");
            return;
        }
        let editor = vscode.window.activeTextEditor;
        let section = editor.selection;
        let ran = section.with(section.start, section.end);
        let text = editor.document.getText(ran);
        var fileFound = true;
        var tempFile = config['tempFilePath'];
        var matlab = config['matlabPath'];
        fs.writeFile(tempFile, '', function (err) {
            if (err) {
                vscode.window.showInformationMessage('Error writing to temp file');
                fileFound = false;
                return;
            }
        });
        if (fileFound) {
            var stream = fs.createWriteStream(tempFile);
            stream.once('open', function (fd) {
                stream.write(text);
                stream.end();
            });
            stream.close();
            if (term == null) {
                term = vscode.window.createTerminal('Matlab');
                term.show();
                setTimeout(function () {
                    term.sendText(matlab +  ' -nodisplay -nosplash -nodesktop -r "run(\'' + tempFile + '\');"', true);
                }, 2000);
            } else {
                term.sendText('clear \'' + tempFile + '\'', true);
                term.sendText('run \'' + tempFile + '\'', true);
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;