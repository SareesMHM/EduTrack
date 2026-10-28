# Database schema
See `server/prisma/schema.prisma` (13 models). Key relations: User(STUDENT) → Class (`classId`) and Grade; Class → Grade, teacher (User), subjects (ClassSubject), exams; Exam → Subject, Class, Marks; Attendance unique on (student, class, date); Mark unique on (exam, student).
Generate an ERD with `npx prisma-erd-generator` or paste the schema into prisma.io/docs data-modeling tools.
