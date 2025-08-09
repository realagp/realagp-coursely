import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GetStarted from "./_components/GetStarted";
import Image from "next/image";

export const metadata = {
  title: "Coursely | Home",
  description: "Enhance your learning journey.",
};

interface featureProps {
  title: string;
  description: string;
  icons: string;
}
const features: featureProps[] = [
  {
    title: "Comprehensive Courses",
    description: "Access a wide range of courses designed to enhance your skills and knowledge.",
    icons: "/icons/courses.png",
  },
  {
    title: "Interactive Learning",
    description: "Engage with interactive content that makes learning fun and effective.",
    icons: "/icons/learning.png",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed progress tracking and analytics.",
    icons: "/icons/progress.png",
  },
  {
    title: "Community Support",
    description: "Join a vibrant community of learners and educators for support and collaboration.",
    icons: "/icons/community.png",
  }
]

export default function Home() {

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"custom"}>Redefining Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Enhance Your Learning Journey</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">Unlock a smarter way to learn with our modern, interactive LMS. Access top-quality courses whenever and wherever you want.</p>
          <GetStarted />
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Image src={feature.icons} alt={feature.title} height={36} width={36} />
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
