import * as vscode from 'vscode';


export namespace Config {
	function getConfig() {
		return vscode.workspace.getConfiguration('qml-ls-client');
	}
	
	export function getQmllsPath() : string  {
		return getConfig().get('qmllsPath') || "";
	}
	
	export function getBuildDir() : string  {
		return getConfig().get('buildDir') || "";
	}
}