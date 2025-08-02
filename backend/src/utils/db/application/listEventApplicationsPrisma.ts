import prisma from '../prisma';

export default async function listEventApplicationsPrisma(
  filters: any,
  limit = 10,
  offset = 0
) {
  const applications = await prisma.application.findMany({
    where: filters,
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
    include: {
      event: true,
      freelancer: true,
      history: true,
    },
  });

  return applications;
}
