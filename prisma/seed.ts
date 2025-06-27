import { PrismaClient, BloodType, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cria 3 assistidos
  const assisted = await Promise.all([
    prisma.assisted.create({
      data: {
        cpf: '11111111111',
        name: 'João Silva',
        blood_type: BloodType.O_POS,
      },
    }),
    prisma.assisted.create({
      data: {
        cpf: '22222222222',
        name: 'Maria Souza',
        blood_type: BloodType.A_NEG,
      },
    }),
    prisma.assisted.create({
      data: {
        cpf: '33333333333',
        name: 'Carlos Lima',
        blood_type: BloodType.B_POS,
      },
    }),
  ]);

  // Cria requests para cada assisted
  const requests = await Promise.all(
    assisted.map((a, idx) =>
      prisma.request.create({
        data: {
          requester_id: `user-${idx + 1}`,
          assisted_id: a.id,
          local_name: `Hospital ${idx + 1}`,
          address: `Rua ${idx + 1}`,
          city: 'Cidade Teste',
          state: 'Estado',
          review_status: RequestStatus.Approved,
          review_message: '',
          active_campagin: true,
        },
      })
    )
  );

  // Cria RequestDonators (mock simples, só para conectar)
  await prisma.requestDonators.create({
    data: {
      request_id: requests[0].id,
      donator_id: 1, // você precisa garantir que donator_id 1 exista, ou criar ele como User, se for o caso
    },
  });
}

main()
  .then(() => {
    console.log('✅ Seed concluído');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Erro ao rodar seed', e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });

