import { ScalableBloomFilter } from 'bloom-filters'
import redirects from '@/redirects/redirects.json'
import { writeFileSync } from 'fs'

const filter = new ScalableBloomFilter(Object.keys(redirects).length, 0.0001)

for (const key in redirects) {
  filter.add(key)
}

const filterJson = filter.saveAsJSON()
writeFileSync('./redirects/bloom-filter.json', JSON.stringify(filterJson))
