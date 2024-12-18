"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAllCronJobs = void 0;
exports.syncTeachers = syncTeachers;
exports.findTeachersCustomer = findTeachersCustomer;
// src/crons/myCronTasks.ts
const node_cron_1 = __importDefault(require("node-cron"));
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const db_teachers_1 = require("./db_teachers");
function syncTeachers(pool, source) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teachers = yield (0, db_teachers_1.fetchAllTeachers)(pool);
            console.log('All Teachers:', teachers.length);
            if (teachers.length > 0) {
                console.log('First Teacher:', teachers[0]);
                try {
                    // let createTeachers = await TeacherHelper.syncTeachers(teachers, source);
                    //console.log('Teachers created:', createTeachers.length);
                }
                catch (error) {
                    console.error('Error creating teachers:', error);
                }
            }
            else {
                console.log('No teachers found');
            }
        }
        catch (error) {
            console.error('Error during teacher fetch:', error);
        }
    });
}
function findTeachersCustomer(pool, source) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teacherCustomers = yield (0, db_teachers_1.findTeacherCustomerWithChats)(pool, source);
            if (teacherCustomers) {
                console.log('Teacher Customer FIND!:', teacherCustomers[0]);
                yield teacherHelper_1.default.createTeacherCustomerIfNotExist(teacherCustomers, source);
            }
        }
        catch (error) {
            console.error('Error fetching teacher customer:', error);
        }
    });
}
const startAllCronJobs = () => {
    node_cron_1.default.schedule('2 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('This task runs every minute');
        try {
            // await findTeachersCustomer(testMainPool, 'main');
        }
        catch (error) {
            console.error('Error during teacher fetch:', error);
        }
    }));
};
exports.startAllCronJobs = startAllCronJobs;
