import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		is_transcribing: {
			type: 'boolean',
			name: 'Is Transcribing',
			description: 'True when transcription is active',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return !!self.statusData?.recording
			},
		},
		has_no_signal: {
			type: 'boolean',
			name: 'Has No Signal',
			description: 'True when input signal is lost',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => {
				return !!self.statusData?.hasNoSignal
			},
		},
	})
}
