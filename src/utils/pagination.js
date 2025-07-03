export const paginationMiddleware = (req, res, next) => {
  const { limit = 15, page = 1, skip, take } = { ...req.query, ...req.body }

  const parsedLimit = parseInt(limit)
  const parsedPage = parseInt(page)

  req.pagination = {
    limit: parsedLimit,
    page: parsedPage,
    skip: skip ? parseInt(skip) : (parsedPage - 1) * parsedLimit,
    take: take ? parseInt(take) : parsedLimit
  }

  next()
}
