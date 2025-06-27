
export default defineEventHandler(async () => {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: {
        criado_em: 'desc',
      },
    })

    return {
      status: 'success',
      data: pedidos,
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)

    return sendError(
      createError({
        statusCode: 500,
        statusMessage: 'Erro ao buscar pedidos',
      })
    )
  }
})

