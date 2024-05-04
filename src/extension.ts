import * as vscode from 'vscode';
import { QmllsService } from "./service";

export async function activate(context: vscode.ExtensionContext) {
	const service = new QmllsService;
	await service.start();

	context.subscriptions.push(
		vscode.commands.registerCommand("qml-ls-client.restartServer", async () => {
			service.outputChannel.appendLine("restarting server");
			if (service.isStarting()){
				return;
			}
			service.dispose();
			await service.start();
		}),
	);
}

export async function deactivate() {}
