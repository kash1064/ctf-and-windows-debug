// .scriptrun C:\CTF\Autorun.js
// FLAG{AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA}
"use strict";

let word = "";
let a1 = [];

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

	breakpoint = ctl.SetBreakpointAtOffset("DoPClient", 0x13a6);
	breakpoint.Command = "dx -r1 @$autoRun.CheckPoint1() ; g";

	breakpoint = ctl.SetBreakpointAtOffset("DoPClient", 0x17cd);
	breakpoint.Command = "dx -r1 @$autoRun.CheckPoint2() ; r zf = 1 ; g";

	return;
}

function Result() {
	for (let line of a1) {
		host.diagnostics.debugLog("", line, "\n");
	}
	return;
}

function CheckPoint1() {
	let context = host.namespace.Debugger.State.DebuggerVariables.curthread.Registers.User;
	let edxValue = context.edx;
	word = String.fromCodePoint(edxValue);
	return;
}

function CheckPoint2() {
	let context = host.namespace.Debugger.State.DebuggerVariables.curthread.Registers.User;
	var memory = host.memory;
	let edxValue = context.ecx;
	let r11Value = context.r11;
	let int32Value = memory.readMemoryValues(r11Value, 1, 4);
	a1.push("Result: Word is " + word + " EDX = " + edxValue.toString() + " R11 = " + int32Value.toString() + " IsValid = " + (parseInt(edxValue) == parseInt(int32Value)).toString());
	return;
}

function initializeScript() {
	return [
		new host.apiVersionSupport(1, 7),
	];
}

function invokeScript() {
	RunCommands("dx @$autoRun = Debugger.State.Scripts.Autorun.Contents");
	RunCommands("dx @$autoRun.SetBreakPoints()");
	RunCommands("g");
	return;
}