import type { ModuleInstance } from './main.js'

export function UpdateActions(self: ModuleInstance): void {
	const presetChoices =
		self.statusData?.presets.map((p) => ({
			id: p.id,
			label: p.name,
		})) || []

	self.setActionDefinitions({
		start_transcribing: {
			name: 'Start Transcribing',
			options: [],
			callback: async () => {
				try {
					const response = await self.apiRequest('/api/control/recording', 'PUT', { action: 'start' })
					if (response.ok) {
						self.log('info', 'Transcription started')
					} else if (response.status === 409) {
						self.log('warn', 'Already recording')
					} else {
						self.log('error', `Start transcription failed: ${response.status} ${response.statusText}`)
					}
				} catch (e) {
					self.log('error', `Start transcription error: ${e}`)
				}
			},
		},
		stop_transcribing: {
			name: 'Stop Transcribing',
			options: [],
			callback: async () => {
				try {
					const response = await self.apiRequest('/api/control/recording', 'PUT', { action: 'stop' })
					if (response.ok) {
						self.log('info', 'Transcription stopped')
					} else if (response.status === 400) {
						self.log('warn', 'Not currently recording')
					} else {
						self.log('error', `Stop transcription failed: ${response.status} ${response.statusText}`)
					}
				} catch (e) {
					self.log('error', `Stop transcription error: ${e}`)
				}
			},
		},
		toggle_transcribing: {
			name: 'Toggle Transcribing',
			options: [],
			callback: async () => {
				const isRecording = !!self.statusData?.recording
				try {
					const response = await self.apiRequest('/api/control/recording', 'PUT', {
						action: isRecording ? 'stop' : 'start',
					})
					if (response.ok) {
						self.log('info', isRecording ? 'Transcription stopped' : 'Transcription started')
					} else {
						self.log('error', `Toggle transcription failed: ${response.status} ${response.statusText}`)
					}
				} catch (e) {
					self.log('error', `Toggle transcription error: ${e}`)
				}
			},
		},
		set_preset: {
			name: 'Set Preset',
			options: [
				{
					id: 'presetId',
					type: 'dropdown',
					label: 'Preset',
					default: presetChoices[0]?.id || '',
					choices: presetChoices,
				},
			],
			callback: async (event) => {
				const presetId = event.options.presetId as string
				if (!presetId) {
					self.log('warn', 'No preset selected')
					return
				}
				try {
					const response = await self.apiRequest('/api/control/preset', 'PUT', { presetId })
					if (response.ok) {
						self.log('info', `Preset changed to ${presetId}`)
					} else if (response.status === 409) {
						self.log('warn', 'Cannot change preset while recording')
					} else {
						self.log('error', `Set preset failed: ${response.status} ${response.statusText}`)
					}
				} catch (e) {
					self.log('error', `Set preset error: ${e}`)
				}
			},
		},
		cycle_preset: {
			name: 'Cycle Preset',
			options: [],
			callback: async () => {
				const presets = self.statusData?.presets
				const activeId = self.statusData?.activePresetId
				if (!presets || presets.length === 0) {
					self.log('warn', 'No presets available')
					return
				}
				const currentIndex = presets.findIndex((p) => p.id === activeId)
				const nextIndex = (currentIndex + 1) % presets.length
				const nextPreset = presets[nextIndex]
				try {
					const response = await self.apiRequest('/api/control/preset', 'PUT', { presetId: nextPreset.id })
					if (response.ok) {
						self.log('info', `Preset cycled to ${nextPreset.name}`)
					} else if (response.status === 409) {
						self.log('warn', 'Cannot change preset while recording')
					} else {
						self.log('error', `Cycle preset failed: ${response.status} ${response.statusText}`)
					}
				} catch (e) {
					self.log('error', `Cycle preset error: ${e}`)
				}
			},
		},
	})
}
