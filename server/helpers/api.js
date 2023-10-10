module.exports = async (ctx, next) => {
  ctx.props = Object.assign(ctx.query || {}, ctx.request.body || {})

  try {
    await next()

    if (!ctx.body) {
      ctx.assert(ctx.result, 404, 'Not Found')

      ctx.body = {
        ok: true,
        result: ctx.result,
      }
    }
  } catch (error) {
    console.error(error)

    ctx.status = error.statusCode || error.status || 500
    ctx.body = {
      ok: false,
      error_code: ctx.status,
      message: error.message,
      description: error.description,
    }
  }
}
