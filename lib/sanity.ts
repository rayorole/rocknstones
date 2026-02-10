import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
    projectId: "sqft17py",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});

export const urlFor = (source: any) => {
    return createImageUrlBuilder(client).image(source);
};