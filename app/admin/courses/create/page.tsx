import CreateCourseClient from "./_components/CreateCourseClient";

export const metadata = {
  title: "Coursely | Create Course",
  description:
    "Design and publish a new course in the Coursely admin panel. Add course details, structure lessons, and configure settings to launch your content.",
};

export default function CreateCoursePage() {
  return <CreateCourseClient />;
}