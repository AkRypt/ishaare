import { constants } from "./constants";

export const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": constants.siteUrl
    },
    headline: "Play Indian Charades with your friends",
    description:
        "Play Ishaare game which is a game of Heads Up but with a twist just for Indians. Indian Charades.",
    image: `${constants.siteUrl}/favicon.ico`,
    inLanguage: "en-US"
};

