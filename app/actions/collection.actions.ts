import { storefrontClient } from "@/clients/storeFrontClient";
import { unstable_cache } from "next/cache";

export const getCollections = unstable_cache(async () => {
    const collections = await storefrontClient.getCollections()

    return collections || []
})

export const getSingleCollection = unstable_cache(async (slug: string) => {
    const collection = await storefrontClient.getCollection(slug)

    return collection || null
})

