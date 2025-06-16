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
import {
	reviewModule
} from '@/stores/release/review.js';
import {
	test_reviewModule
} from '@/stores/test/review.js';
import {
	writefrommemoryModule
} from '@/stores/release/writefrommemory.js';
import {
	test_writefrommemoryModule
} from '@/stores/test/writefrommemory.js';
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
export const reviewStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_reviewModule()
	} else {
		return reviewModule()
	}
}
export const writefrommemoryStore = () => {
	if (process.env.NODE_ENV === 'development') {
		return test_writefrommemoryModule()
	} else {
		return writefrommemoryModule()
	}
}