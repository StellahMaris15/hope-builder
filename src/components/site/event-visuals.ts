import communityOutreachImage from "@/assets/communtiy outreach.jpg";
import youthConferenceImage from "@/assets/hope youth conference.jpg";
import leadershipTrainingImage from "@/assets/leadership training.jpg";

type EventVisual = {
  src: string;
  alt: string;
};

export function getEventVisual(title: string, imageUrl: string | null): EventVisual {
  if (imageUrl) return { src: imageUrl, alt: title };

  const identifier = title.toLowerCase();
  if (identifier.includes("youth") || identifier.includes("conference")) {
    return { src: youthConferenceImage, alt: "Participants at a Hope Alliance youth conference" };
  }
  if (
    identifier.includes("outreach") ||
    identifier.includes("community") ||
    identifier.includes("food")
  ) {
    return { src: communityOutreachImage, alt: "Hope Alliance community outreach gathering" };
  }
  if (
    identifier.includes("leadership") ||
    identifier.includes("training") ||
    identifier.includes("workshop")
  ) {
    return {
      src: leadershipTrainingImage,
      alt: "Facilitator leading a leadership training workshop",
    };
  }

  return { src: communityOutreachImage, alt: "Hope Alliance community event" };
}
