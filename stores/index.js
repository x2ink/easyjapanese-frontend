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
import {
	learnmodeModule
} from '@/stores/release/learnmode.js';
import {
	test_learnmodeModule
} from '@/stores/test/learnmode.js';
import {
	fastmodeModule
} from '@/stores/release/fastmode.js';
import {
	test_fastmodeModule
} from '@/stores/test/fastmode.js';
import {
	todaylearnModule
} from '@/stores/release/todaylearn.js';
import {
	test_todaylearnModule
} from '@/stores/test/todaylearn.js';
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
export const learnmodeStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_learnmodeModule()
	} else {
		return learnmodeModule()
	}
}
export const fastmodeStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_fastmodeModule()
	} else {
		return fastmodeModule()
	}
}
export const todaylearnStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_todaylearnModule()
	} else {
		return todaylearnModule()
	}
}