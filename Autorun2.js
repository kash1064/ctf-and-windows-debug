// .scriptrun C:\CTF\Autorun2.js
"use strict";

let word = "";
let correctImageFileName = new Array(13).fill("*");

function RunCommands(cmd) {
	let ctl = host.namespace.Debugger.Utility.Control;
	let output = ctl.ExecuteCommand(cmd);

	for (let line of output) {
		host.diagnostics.debugLog("  ", line, "\n");
	}

	return output;
}

function SetBreakPoints() {
	let ctl = host.namespace.Debugger.Utility.Control;
	let breakpoint;

	breakpoint = ctl.SetBreakpointAtOffset("DoPDriver", 0x1054);
	breakpoint.Command = "dx -r1 @$autoRun2.CheckPoint1() ; g";

	breakpoint = ctl.SetBreakpointAtOffset("DoPDriver", 0x114a);
	breakpoint.Command = "dx -r1 @$autoRun2.CheckPoint2() ; r zf = 1 ; g";

	return;
}

function Result() {
	host.diagnostics.debugLog("correctImageFileName is: ");

	for (let w of correctImageFileName ) {
		host.diagnostics.debugLog(w);
	}

	host.diagnostics.debugLog("\n");
	return;
}

function CheckPoint1() {
	// EAX レジスタからイメージファイル名に含まれる 1 文字を取得
	let context = host.namespace.Debugger.State.DebuggerVariables.curthread.Registers.User;
	let eaxValue = context.eax;
	word = String.fromCodePoint(eaxValue);

	return;
}

function CheckPoint2() {
	let context = host.namespace.Debugger.State.DebuggerVariables.curthread.Registers.User;
	let r9Value = context.r9d;
	let r11Value = context.r11;
	let zeroFlagValue = context.zf;
	
	// ゼロフラグの値から検証に成功したかどうかを判断
	if (zeroFlagValue == 1) {
		correctImageFileName[parseInt(r9Value, 16)] = word;
	}
	
	return;
}

function initializeScript() {
	return [
		new host.apiVersionSupport(1, 7),
	];
}

function invokeScript() {
	RunCommands("dx @$autoRun2 = Debugger.State.Scripts.Autorun2.Contents");
	RunCommands("dx @$autoRun2.SetBreakPoints()");
	RunCommands("g");
	return;
}