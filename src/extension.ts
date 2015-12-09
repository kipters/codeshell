// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "codeshell" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let exec = require('child_process').exec;
	
	let launchShell = function (additionalCommands: string) {
		if (process.platform != 'win32') {
			vscode.window.showErrorMessage('PowerShell is supported on Windows only!');
			return;
		}
		
		if (!vscode.workspace.rootPath) {
			vscode.window.showWarningMessage('You have to open a folder first');
			return;
		}
		if (additionalCommands == null) {
			additionalCommands = '';
		}
		var cmd = 'start powershell.exe ' + additionalCommands + ' -noexit -command \"cd \'' + vscode.workspace.rootPath + '\'\"';
		exec(cmd);
	};
	
	var vanillaDisposable = vscode.commands.registerCommand('extension.startShell', () => launchShell(null));
	var unrestrictedDisposable = vscode.commands.registerCommand('extension.startUnrestrictedShell', () => launchShell('-ExecutionPolicy Unrestricted'));
	
	context.subscriptions.push(vanillaDisposable);
	context.subscriptions.push(unrestrictedDisposable);
}