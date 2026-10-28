import { User } from './user';
import { ClassItem } from './class';
import { Subject } from './subject';
export interface TeacherDetail extends User { classes: ClassItem[]; subjects: Subject[] }
