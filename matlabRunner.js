const vscode = require('vscode');
const fs = require('fs');
var term = null;
//let args = [' -nodisplay -nosplash -nodesktop', ' -nosplash -nodesktop'];
var argsUsed = ' -nosplash -nodesktop';


function activate(context) {

    vscode.window.onDidCloseTerminal(function (event) {
        if (event.name == 'Matlab') {
            term = null;
        }
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('matlabRunner.runSelection', RunSelection),
        vscode.commands.registerCommand('matlabRunner.runFile', RunFile),
        vscode.commands.registerCommand('matlabRunner.createMatlabTerm', CreateNewTerminal)
    );

}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

function CreateNewTerminal() {
    var config = vscode.workspace.getConfiguration('matlab-runner');
    if (!config.has('matlabPath') || config['matlabPath'] == null) {
        vscode.window.showErrorMessage("Could not find path to the matlab executable.");
        return;
    }
    var matlab = "\"" + config['matlabPath'] + "\"";
    term = vscode.window.createTerminal('Matlab');
    term.show();
    setTimeout(function () {
        term.sendText(matlab + argsUsed, true);
    }, 2000);
}

function RunSelection() {
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
            term.sendText(matlab + argsUsed + ' -r "run(\'' + tempFile + '\');"', true);
        }, 2000);
    } else {
        term.sendText('clear \'' + tempFile + '\'', true);
        if (shouldClear) {
            term.sendText('clc', true);
        }
        term.sendText('run \'' + tempFile + '\'', true);
    }
}

function RunFile() {
    var config = vscode.workspace.getConfiguration('matlab-runner');
    if (!config.has('matlabPath') || config['matlabPath'] == null) {
        vscode.window.showErrorMessage("Could not find path to the matlab executable.");
        return;
    }
    var matlab = "\"" + config['matlabPath'] + "\"";
    let editor = vscode.window.activeTextEditor;
    let filePath = editor.document.uri.fsPath;
    var shouldClear = config['clearPastRuns'];
    if (filePath.indexOf('Untitled-') != -1) {
        vscode.window.showErrorMessage("Please save the file before attempting to run it.");
        return;
    }
    if (filePath.split('.').pop() != 'm' && filePath.split('.').pop() != 'M') {
        vscode.window.showErrorMessage("Please make sure this file is saved with the \'.m\' extension");
        return;
    }
    if (term == null) {
        term = vscode.window.createTerminal('Matlab');
        term.show();
        setTimeout(function () {
            term.sendText(matlab + argsUsed + ' -r "run(\'' + filePath + '\');"', true);
        }, 2000);
    } else {
        if (shouldClear) {
            term.sendText('clc', true);
        }
        term.sendText('run \'' + filePath + '\'', true);
    }
}