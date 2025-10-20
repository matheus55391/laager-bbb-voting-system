import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    await prisma.vote.deleteMany();
    await prisma.participant.deleteMany();

    const participants = await prisma.participant.createMany({
        data: [
            {
                name: 'João Silva',
                nickname: 'João',
                isActive: true,
            },
            {
                name: 'Maria Santos',
                nickname: 'Maria',
                isActive: true,
            },
        ],
    });

    console.log(`✅ Created ${participants.count} participants`);

    const totalParticipants = await prisma.participant.count();
    const totalVotes = await prisma.vote.count();

    console.log(`
📊 Database seeded successfully!
   - Participants: ${totalParticipants}
   - Votes: ${totalVotes}
  `);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
