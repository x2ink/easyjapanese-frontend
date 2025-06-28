import {
	userModule
} from '@/stores/release/user.js';
import {
	test_userModule
} from '@/stores/test/user.js';
import {
	historyrecordModule
} from '@/stores/release/historyrecord.js';
import {
	test_historyrecordModule
} from '@/stores/test/historyrecord.js';
import {
	localwordsModule
} from '@/stores/release/localwords.js';
import {
	test_localwordsModule
} from '@/stores/test/localwords.js';
export const userStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_userModule()
	} else {
		return userModule()
	}
}
export const historyrecordStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_historyrecordModule()
	} else {
		return historyrecordModule()
	}
}
export const localwordsStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_localwordsModule()
	} else {
		return localwordsModule()
	}
}