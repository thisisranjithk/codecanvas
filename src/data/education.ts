import type { Education } from "@/types"

export const mockEducation: Education[] = [
  {
    id: "1",
    institution: "Carnegie Mellon University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startDate: "2014-09",
    endDate: "2018-05",
    gpa: "3.8",
    location: "Pittsburgh, PA, USA",
    activities: ["ACM Chapter President", "Hackathon Organizer", "Teaching Assistant – Algorithms"],
    description: "Focused on distributed systems and human-computer interaction. Thesis: 'Optimizing state synchronization in collaborative real-time editors.'",
    logo: "CMU",
  },
  {
    id: "2",
    institution: "Y Combinator Startup School",
    degree: "Certificate",
    field: "Entrepreneurship & Product",
    startDate: "2021-01",
    endDate: "2021-03",
    gpa: "",
    location: "San Francisco, CA, USA",
    activities: ["Hackathon Organizer"],
    description: "Completed the 10-week online program covering product strategy, user research, and go-to-market fundamentals.",
    logo: "YC",
  },
]
