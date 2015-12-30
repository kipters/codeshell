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
    let accessfs = require('fs').accessSync;
    
    let getNativeShellPath = function() {
        // VS code is running in a 32 bit process. 64 bit Windows will therefore redirect accesses to
        // system programs to 32 bit versions of them (WOW64, see https://msdn.microsoft.com/en-us/library/windows/desktop/aa384187(v=vs.85).aspx )
        // If that is the case, we need to work around the redirection to access the native powershell.
        if (process.env.PROCESSOR_ARCHITECTURE === 'x86') {
            try {
                accessfs(process.env.WINDIR + '\\Sysnative');
                return process.env.WINDIR + '\\Sysnative\\cmd.exe';
            } catch (exc) {
                // Cannot find Sysnative path -> either below Windows Vista or not 64bit -> 32 bit Shell
                return process.env.WINDIR + '\\System32\\cmd.exe';
            }
        }
        else {
            // apparently, VS code is now running in a 64 bit process. Nothing to do.
            return process.env.WINDIR + '\\System32\\cmd.exe';
        }
    }
	
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
        
		var cmd: string = 'start powershell.exe ' + additionalCommands + ' -noexit';
        var nativeShellCmd: string = getNativeShellPath() + ' /Q /S /C \" ' + cmd.replace('\"','^\"') + ' \"';
		exec(nativeShellCmd, { cwd: vscode.workspace.rootPath });
	};
	
	var vanillaDisposable = vscode.commands.registerCommand('codeshell.startShell', () => launchShell(null));
	var unrestrictedDisposable = vscode.commands.registerCommand('codeshell.startUnrestrictedShell', () => launchShell('-ExecutionPolicy Unrestricted'));
	
	context.subscriptions.push(vanillaDisposable);
	context.subscriptions.push(unrestrictedDisposable);
}