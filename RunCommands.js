"use strict";

function initializeScript()
{
    host.diagnostics.debugLog("RunCommands>; initializeScript was called \n");
}

function invokeScript()
{
    host.diagnostics.debugLog("RunCommands>; invokeScript was called \n");
}

function uninitializeScript()
{
    host.diagnostics.debugLog("RunCommands>; uninitialize was called\n");
}

function RunCommands(cmd)
{
	var ctl = host.namespace.Debugger.Utility.Control;   
	var output = ctl.ExecuteCommand(cmd);
	host.diagnostics.debugLog("RunCommands> Displaying command output \n");

	for (var line of output)
	{
		host.diagnostics.debugLog("  ", line, "\n");
	}

	host.diagnostics.debugLog("RunCommands> Exiting RunCommands Function \n");
}