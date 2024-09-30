export default function getInfluenceWhatsappUrl(
    shareUrl: string,
    competitionName: string
) {
    const text = `Participe da Copa Hemocione "${competitionName}" de doação de sangue e me ajude a influenciar mais pessoas a doarem sangue!`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareUrl);
    return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
}
