import {
	userModule
} from '@/stores/release/user.js';
import {
	test_userModule
} from '@/stores/test/user.js';
import {
	searchrecordModule
} from '@/stores/release/searchrecord.js';
import {
	test_searchrecordModule
} from '@/stores/test/searchrecord.js';
export const userStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_userModule()
	} else {
		return userModule()
	}
}
export const searchrecordStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_searchrecordModule()
	} else {
		return searchrecordModule()
	}
}