const prisma = require('../src/models/prismaClient');

const statuses = [
  { text: 'Pending' },
  { text: 'In Progress' },
  { text: 'Completed' },
  { text: 'On Hold' },
];

const persons = [
  { email: 'alice@example.com', name: 'Alice' },
  { email: 'bob@example.com', name: 'Bob' },
  { email: 'carol@example.com', name: 'Carol' },
  { email: 'dave@example.com', name: 'Dave' },
  { email: 'eve@example.com', name: 'Eve' },
];

async function main() {
  // Seed Statuses
  await prisma.status.createMany({
    data: statuses,
    skipDuplicates: true, // Prevents errors if records already exist
  });

  const insertedStatuses = await prisma.status.findMany(); // Fetch inserted statuses

  // Seed Persons
  await prisma.person.createMany({
    data: persons,
    skipDuplicates: true,
  });

  const insertedPersons = await prisma.person.findMany(); // Fetch inserted persons

  // Seed Tasks
  const insertedTasks = await prisma.task.createMany({
    data: [
      { name: 'Seed 1', statusId: insertedStatuses[0].id },
      { name: 'Seed 2', statusId: insertedStatuses[1].id },
    ],
    skipDuplicates: true,
  });

  const tasks = await prisma.task.findMany(); // Fetch inserted tasks

  // Seed Task Assignments
  await prisma.taskAssignment.createMany({
    data: [
      { personId: insertedPersons[0].id, taskId: tasks[0].id },
      { personId: insertedPersons[1].id, taskId: tasks[0].id },
      { personId: insertedPersons[2].id, taskId: tasks[1].id },
      { personId: insertedPersons[3].id, taskId: tasks[1].id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data inserted successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
