import { combineRgb, type CompanionPresetDefinitions } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {
		start_transcribing: {
			type: 'button',
			category: 'Recording Control',
			name: 'Start Transcribing',
			style: {
				text: 'Start\\nTranscribing',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [
				{
					feedbackId: 'is_transcribing',
					options: {},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
			steps: [
				{
					down: [{ actionId: 'start_transcribing', options: {} }],
					up: [],
				},
			],
		},
		stop_transcribing: {
			type: 'button',
			category: 'Recording Control',
			name: 'Stop Transcribing',
			style: {
				text: 'Stop\\nTranscribing',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [],
			steps: [
				{
					down: [{ actionId: 'stop_transcribing', options: {} }],
					up: [],
				},
			],
		},
		toggle_transcribing: {
			type: 'button',
			category: 'Recording Control',
			name: 'Toggle Transcribing',
			style: {
				text: 'Toggle\\nTranscribing',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [
				{
					feedbackId: 'is_transcribing',
					options: {},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
			steps: [
				{
					down: [{ actionId: 'toggle_transcribing', options: {} }],
					up: [],
				},
			],
		},
		cycle_preset: {
			type: 'button',
			category: 'Presets',
			name: 'Cycle Preset',
			style: {
				text: 'Cycle\\nPreset',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [],
			steps: [
				{
					down: [{ actionId: 'cycle_preset', options: {} }],
					up: [],
				},
			],
		},
		transcription_status: {
			type: 'button',
			category: 'Status',
			name: 'Transcription Status',
			style: {
				text: '$(trms-mediascribe:transcription-status)',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [
				{
					feedbackId: 'is_transcribing',
					options: {},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
				{
					feedbackId: 'has_no_signal',
					options: {},
					style: {
						bgcolor: combineRgb(255, 255, 0),
						color: combineRgb(0, 0, 0),
					},
				},
			],
			steps: [
				{
					down: [],
					up: [],
				},
			],
		},
		active_preset: {
			type: 'button',
			category: 'Status',
			name: 'Active Preset',
			style: {
				text: '$(trms-mediascribe:active-preset-name)',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [],
			steps: [
				{
					down: [],
					up: [],
				},
			],
		},
	}

	self.setPresetDefinitions(presets)
}
