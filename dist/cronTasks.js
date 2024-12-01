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
exports.startCronJobs = void 0;
// src/crons/myCronTasks.ts
const node_cron_1 = __importDefault(require("node-cron"));
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const db_teachers_1 = require("./db_teachers");
const db_pools_1 = require("./db_pools");
function syncTeachersFromMain() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teachers = yield (0, db_teachers_1.fetchAllTeachers)(db_pools_1.testMainPool);
            console.log('All SERVER Teachers:', teachers.length);
            if (teachers.length > 0) {
                console.log('First Teacher:', teachers[0]);
                try {
                    let createTeachers = yield teacherHelper_1.default.syncTeachers(teachers, 'main');
                    console.log('Teachers created:', createTeachers.length);
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
function syncTeachersFromUA() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teachers = yield (0, db_teachers_1.fetchAllTeachers)(db_pools_1.uaPool);
            console.log('All UA Teachers:', teachers.length);
            if (teachers.length > 0) {
                console.log('First Teacher:', teachers[0]);
                try {
                    let createTeachers = yield teacherHelper_1.default.syncTeachers(teachers, 'ua');
                    console.log('Teachers created:', createTeachers.length);
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
function syncTeachersFromPL() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teachers = yield (0, db_teachers_1.fetchAllTeachers)(db_pools_1.plPool);
            console.log('All PL Teachers:', teachers.length);
            if (teachers.length > 0) {
                console.log('First Teacher:', teachers[0]);
                try {
                    let createTeachers = yield teacherHelper_1.default.syncTeachers(teachers, 'pl');
                    console.log('Teachers created:', createTeachers.length);
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
const startCronJobs = () => {
    node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('This task runs every minute');
        try {
            yield syncTeachersFromPL();
        }
        catch (error) {
            console.error('Error during teacher fetch:', error);
        }
        //save teachers from main
    }));
    node_cron_1.default.schedule('0 0 * * *', () => {
        console.log('This task runs every day at midnight');
        // Your code here, for example, clearing the database or generating a report
    });
};
exports.startCronJobs = startCronJobs;
