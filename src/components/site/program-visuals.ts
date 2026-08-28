import charityImage from "@/assets/charity.jpg";
import educationImage from "@/assets/program-education.jpg";
import fallbackImage from "@/assets/hero-children.jpg";
import mentorshipImage from "@/assets/program-mentorship.jpg";
import ministryImage from "@/assets/ministry.jpg";
import skillsImage from "@/assets/Education.jpg";
import youthImage from "@/assets/youth.jpg";

type ProgramVisual = {
  src: string;
  alt: string;
  position?: string;
};

export function getProgramVisual(title: string, icon: string): ProgramVisual {
  const identifier = `${title} ${icon}`.toLowerCase();

  if (identifier.includes("education") || identifier.includes("scholarship")) {
    return { src: educationImage, alt: "Students learning together in a classroom" };
  }
  if (identifier.includes("mentor")) {
    return { src: mentorshipImage, alt: "A mentor supporting a young person" };
  }
  if (identifier.includes("youth") || identifier.includes("conference")) {
    return {
      src: youthImage,
      alt: "Young people gathered at a Hope Alliance event",
      position: "center 35%",
    };
  }
  if (identifier.includes("charity") || identifier.includes("outreach")) {
    return { src: charityImage, alt: "Volunteers preparing food parcels for community outreach" };
  }
  if (identifier.includes("ministry") || identifier.includes("church")) {
    return { src: ministryImage, alt: "A community gathered in worship", position: "center 35%" };
  }
  if (identifier.includes("skill") || identifier.includes("empower")) {
    return { src: skillsImage, alt: "Young adults building their skills and confidence" };
  }

  return { src: fallbackImage, alt: "Hope Alliance participants building a brighter future" };
}
