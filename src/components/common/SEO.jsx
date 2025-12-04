import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}) => {
    const siteTitle = 'All Inclusive | Indumentaria Masculina en Rosario';
    const defaultDescription = 'All Inclusive ofrece la mejor indumentaria masculina en Rosario, Santa Fe. Pantalones, camisas, remeras y más con estilo y calidad premium.';
    const defaultKeywords = 'indumentaria masculina, ropa hombre, rosario, santa fe, pantalones, camisas, moda hombre, all inclusive';
    const defaultImage = 'https://allinclusive.com.ar/og-image.jpg'; // Replace with actual URL if available
    const siteUrl = 'https://allinclusive.com.ar';

    const finalTitle = title ? `${title} | All Inclusive` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
    const finalImage = image || defaultImage;
    const finalUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:site_name" content="All Inclusive" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />
        </Helmet>
    );
};

export default SEO;
