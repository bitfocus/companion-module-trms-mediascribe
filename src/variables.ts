import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'transcription-status', name: 'Transcription Active' },
		{ variableId: 'active-preset-id', name: 'Active Preset ID' },
		{ variableId: 'active-preset-name', name: 'Active Preset Name' },
		{ variableId: 'transcription-duration-seconds', name: 'Transcription Duration (Seconds)' },
		{ variableId: 'transcription-duration-string', name: 'Transcription Duration (String)' },
		{ variableId: 'site-name', name: 'Site Name' },
		{ variableId: 'has-no-signal', name: 'Has No Signal' },
	])
}
