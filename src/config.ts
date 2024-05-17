import * as vscode from 'vscode';


export namespace Config {	
	export function getQmllsPath() : string  {
		return substituted(getConfig().get('qmllsPath') || "");
	}
	
	export function getBuildDir() : string  {
		return substituted(getConfig().get('buildDir') || "");
	}
	
	function getConfig() {
		return vscode.workspace.getConfiguration('qml-ls-client');
	}

	function substituted(preSubstitution: string) : string {
		preSubstitution = preSubstitution.replace(/\$\{(.*?)\}/g, (match, name) => {
			// keep as was in case no substitution available
			return substitutionVars(name) ?? match;
		  }) as unknown as string;

		return preSubstitution;
	}

	function substitutionVars(name: string) : string|undefined  {
		if (name === 'workspaceRoot' || name === 'workspaceFolder') {
			if (vscode.workspace.workspaceFolders === undefined){
				return undefined;
			}

			return vscode.workspace.workspaceFolders[0].uri.path;
		}
		return undefined;
	}
}