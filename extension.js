const vscode = require('vscode');
const fs = require('fs');
var term = null;



function activate(context) {

    vscode.window.onDidCloseTerminal(function(event) { 
        if (event.name == 'Matlab') {
            term = null;
        }
    });    

    let disposable = vscode.commands.registerCommand('extension.runSelection', function () {
        
        var config = vscode.workspace.getConfiguration('matlab-runner');
        if (!config.has('matlabPath') || config['matlabPath'] == null) {
            vscode.window.showErrorMessage("Could not find path to the matlab executable.");
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
        if (!text || text == undefined || text == "" || text.length == 0) {
            vscode.window.showInformationMessage('No code was selected');
            return;
        }
        var tempFile = config['tempFilePath'];
        var matlab = "\"" + config['matlabPath'] + "\"";
        var shouldClear = config['clearPastRuns'];
        fs.writeFile(tempFile, '', function (err) {
            if (err) {
                vscode.window.showInformationMessage('Error writing to temp file: ' + err.message);
                return;
            }
        });
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
            if (shouldClear) {
                term.sendText('clc', true);
            }
            term.sendText('run \'' + tempFile + '\'', true);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;