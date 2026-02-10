import { NextResponse } from "next/server";
import { client, urlFor } from "@/lib/sanity";
import { groq } from "next-sanity";

const MAX_RESULTS = 8;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  // GROQ match uses * for wildcard; escape * in query to avoid injection
  const safe = q.replace(/[*]/g, "").toLowerCase();
  if (!safe) {
    return NextResponse.json({ products: [] });
  }

  // Match name or description containing the search term (case-insensitive via lower())
  const query = groq`
    *[_type == "product" && (
      lower(name) match "*" + $q + "*" ||
      (description != null && lower(description) match "*" + $q + "*")
    )][0...$limit] {
      _id,
      name,
      slug,
      price,
      image,
    }
  `;

  try {
    const products = await client.fetch<Array<{
      _id: string;
      name: string;
      slug: { current: string };
      price: number;
      image?: Array<{ asset?: { _ref?: string } }> | null;
    }>>(query, { q: safe, limit: MAX_RESULTS });

    const withUrls = products.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug?.current ?? p._id,
      price: p.price,
      imageUrl: p.image?.[0]
        ? urlFor(p.image[0]).width(120).height(120).url()
        : null,
    }));

    return NextResponse.json({ products: withUrls });
  } catch (e) {
    console.error("Search error:", e);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
