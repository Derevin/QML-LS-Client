import * as vscode from 'vscode';
import * as vscodelc from 'vscode-languageclient/node';
import { Config } from './config';

export class QmllsService implements vscode.Disposable {
	subscriptions: vscode.Disposable[] = [];
	client!: vscodelc.LanguageClient;
	outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('qmlls');

	async start() {		
		this.outputChannel.appendLine("Starting QML LS Client...");

		const args: string[] = Config.getBuildDir() !== "" ? ["--build-dir", Config.getBuildDir()] : [];
		if (Config.getQmllsPath() === ""){
			vscode.window.showErrorMessage("QML LS Client: qmlls path empty, cannot start");
			this.outputChannel.appendLine("qmlls path empty, cannot start");
			return;
		}

		const qmlls: vscodelc.Executable = {
			command: Config.getQmllsPath(),
			args: args,
		};

		const serverOptions: vscodelc.ServerOptions = qmlls;
		const clientOptions: vscodelc.LanguageClientOptions = {
			documentSelector: [ {scheme: 'file', language: 'qml'}],
			outputChannel: this.outputChannel,
			revealOutputChannelOn: vscodelc.RevealOutputChannelOn.Never,
			synchronize: {
				fileEvents: vscode.workspace.createFileSystemWatcher('**/*.qml')
			}
	
		};
	
		this.client = new vscodelc.LanguageClient("QML LS", serverOptions, clientOptions);
		this.client.clientOptions.errorHandler = this.client.createDefaultErrorHandler(2); // max restart count

		await this.client.start();
		this.outputChannel.appendLine("QML LS Client now active");
	}

	isStarting(){ 
		return this.client && this.client.state === vscodelc.State.Starting;
	}

	dispose() {
		this.subscriptions.forEach((d) => { d.dispose(); });
		if (this.client){
		  this.client.stop();
		}
		this.subscriptions = [];
	}
}
