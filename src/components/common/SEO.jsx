import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = "website",
    sku,
    availability,
    price,
}) => {
    const siteTitle = "All Inclusive | Indumentaria Masculina en Rosario";
    const defaultDescription =
        "All Inclusive ofrece la mejor indumentaria masculina en Rosario, Santa Fe. Pantalones, camisas, remeras y más con estilo y calidad premium.";
    const defaultKeywords =
        "indumentaria masculina, ropa hombre, rosario, santa fe, pantalones, camisas, camisas de lino, moda hombre, all inclusive, tienda de ropa hombre, jeans hombre, chombas, bermudas";
    const defaultImage = "https://allinclusive.com.ar/og-image.jpg"; // Cambiar cuando tengas la OG real
    const siteUrl = "https://www.allinclusive.com.ar";

    const finalTitle = title ? `${title} | All Inclusive` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords
        ? `${keywords}, ${defaultKeywords}`
        : defaultKeywords;
    const finalImage = image || defaultImage;
    const finalUrl = url ? `${siteUrl}${url}` : siteUrl;

    const schema = type === 'product' ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": finalTitle,
        "image": finalImage,
        "description": finalDescription,
        "url": finalUrl,
        "sku": sku || undefined,
        "brand": {
            "@type": "Brand",
            "name": "All Inclusive"
        },
        "offers": {
            "@type": "Offer",
            "url": finalUrl,
            "priceCurrency": "ARS",
            "price": price || (description ? description.match(/\$([\d.,]+)/)?.[1]?.replace(/[.,]/g, '') : "0"), // Use prop first, then fallback
            "availability": availability || "https://schema.org/InStock",
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "itemCondition": "https://schema.org/NewCondition"
        }
    } : {
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        "name": "All Inclusive",
        "image": finalImage,
        "url": finalUrl,
        "description": finalDescription,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Rosario",
            "addressRegion": "Santa Fe",
            "addressCountry": "Argentina"
        },
        "priceRange": "$$"
    };

    return (
        <Helmet>
            {/* ==== Meta base para SEO ==== */}
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <link rel="canonical" href={finalUrl} />

            {/* ==== Open Graph ==== */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:site_name" content="All Inclusive" />

            {/* ==== Twitter ==== */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* ==== Schema JSON-LD ==== */}
            <script type="application/ld+json">
                {JSON.stringify(schema).replace(/</g, '\\u003c')}
            </script>
        </Helmet>
    );
};

export default SEO;
