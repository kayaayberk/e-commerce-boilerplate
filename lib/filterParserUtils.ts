interface Filter {
  [key: string]: number | null | string[] | string
  minPrice: number | null
  maxPrice: number | null
  categories: string
  vendor: string[]
  tags: string[]
  colors: string[]
  sizes: string[]
}

export function parseFilter(query: string): Filter {
  if (!query) {
    return {
      minPrice: null,
      maxPrice: null,
      categories: '',
      vendor: [],
      tags: [],
      colors: [],
      sizes: [],
    }
  }
  const conditions = query.split('AND')

  const result: Filter = {
    minPrice: null,
    maxPrice: null,
    categories: '',
    vendor: [],
    tags: [],
    colors: [],
    sizes: [],
  }

  conditions.forEach((condition) => {
    condition = condition.trim().replace(/^\(|\)$/g, '')
    let [attribute, operator, ...valueParts] = condition.split(' ')
    let value: string | string[] = valueParts.join(' ').trim()

    if (value.startsWith('[')) {
      value = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((v) => v.trim().replace(/^"|"$|'/g, ''))
    } else {
      value = value.replace(/^"|"$|'/g, '')
    }

    switch (attribute) {
      case 'collections.title':
        attribute = 'categories'
        break
      case 'vendor':
        attribute = 'vendor'
        break
      case 'tags':
        attribute = 'tags'
        break
      case 'flatOptions.Color':
        attribute = 'colors'
        break
      case 'flatOptions.Size':
        attribute = 'sizes'
        break
    }

    switch (operator) {
      case 'IN':
        result[attribute] = value
        break
      case '=':
        result[attribute] = value
        break
      case '>=':
        result.minPrice = Number(value)
        break
      case '<=':
        result.maxPrice = Number(value)
        break
    }
  })

  return result
}
