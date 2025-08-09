import { getCourse } from "@/app/data/course/get-course";
import { purchasedVerification } from "@/app/data/user/user-enrolled";
import RenderDescription from "@/components/tiptap/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { IconCategory, IconPlayerPlayFilled } from "@tabler/icons-react";
import { CheckIcon, GraduationCap, HourglassIcon, Maximize2Icon, Video, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EnrollButton from "./_components/EnrollButton";
import { buttonVariants } from "@/components/ui/button";
import { ConstructedUrl } from "@/hooks/object-url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const course = await getCourse(slug);

  return {
    title: `Coursely | ${course.title}`,
    description: course.shortDescription || `Explore the course "${course.title}" and start learning today.`,
  };
}

type Params = Promise<{slug: string}>

const levelVariantMap = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
} as const;

const ViewCourse = async ({params}:{params: Params}) => {

  const { slug } = await params;
  const course = await getCourse(slug);
  const isEnrolled = await purchasedVerification(course.id)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
        <div className="order-1 lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                src={ConstructedUrl(course.fileKey)}
                alt="Thumbnail"
                fill
                priority
                className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{course.shortDescription}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge 
                variant={levelVariantMap[course.level as keyof typeof levelVariantMap]} 
                >
                  {course.level}
                </Badge>
                <Badge variant="category">
                  {course.category}
                </Badge>
                <Badge variant="duration">
                  {course.duration} <span>Hours</span>
                </Badge>
              </div>
              <Separator className="my-8" />
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Description:</h2>
                <RenderDescription json={JSON.parse(course.description)} />
              </div>
            </div>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Content:</h2>
                <div className="text-muted-foreground">
                  {course.chapter.length} Chapters | {course.chapter.reduce((total, chapter) => 
                  total + chapter.lessons.length, 0 
                  ) || 0}{" "}
                  Lessons
                </div> 
              </div>
              <div className="space-y-4">
                {course.chapter.map((chapter, index) => (
                  <Collapsible key={chapter.id} defaultOpen={false}>
                    <Card className="p-0 gap-0 overflow-hidden transition-all duration-200 hover:shadow:md">
                      <CollapsibleTrigger>
                        <div>
                          <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 <p className="flex size-10 items-center justify-center rounded-full bg-green-700/10 text-green-600 font-semibold">
                                  {index + 1}
                                </p>
                                <div>
                                  <h3 className="text-lg font-semibold text-left">{chapter.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 text-left">
                                    {chapter.lessons.length} Lesson
                                    {chapter.lessons.length !== 1 ? "s" : ""}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <div className="flex size-7 items-center justify-center rounded-md bg-green-700/10 text-green-600 font-semibold">
                                  <Maximize2Icon className="size-5" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>  
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t bg-muted/20">
                          <div className="p-6 pt-4 space-y-3">
                            {chapter.lessons.map((lesson, lessonPos) => (
                              <div key={lesson.id} className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group">
                                <div className="flex items-center justify-center size-8 rounded-full bg-transparent border-2 border-destructive/75">
                                  <IconPlayerPlayFilled className="size-4 text-destructive/30 transition-colors"/>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {lesson.title}
                                  </p>
                                  <p className="mt-1 text-muted-foreground text-xs">Lesson {lessonPos + 1}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </div>
        </div>
        {/* Payment */}
        <div className="order-2 lg:col-span-1">
          <div className="sticky top-6">
            <Card className="py-0 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-muted-foreground">Price:</span>
                  {isEnrolled ? (
                    <span className="text-2xl font-semibold p-2 rounded bg-yellow-700/10 text-yellow-600">
                      PAID
                    </span>
                  ):(
                    <span className="text-2xl font-semibold p-2 rounded bg-green-700/10 text-green-600">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(course.price)}
                    </span>
                  )}
                </div>
                <div className="mb-6 space-y-3 rounded bg-muted p-4">
                  <h4>Featured course:</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                        <GraduationCap className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Level</p>
                        <p className="text-sm text-muted-foreground">
                          {course.level}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-green-600/10 text-green-600">
                        <IconCategory className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm text-muted-foreground">
                          {course.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-yellow-600/10 text-yellow-600">
                        <HourglassIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {course.duration} Hours
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <Video className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Lessons</p>
                        <p className="text-sm text-muted-foreground">
                          {course.chapter.reduce((total, chapter) => 
                          total + chapter.lessons.length, 0 
                          ) || 0}{" "}
                          Lessons
                        </p>
                      </div>
                    </div>
                  </div>                   
                </div>
                <div className="mb-6 space-y-3">
                  <h4>What&apos;s included:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="rounded-full p-1 bg-green-700/10 text-green-600">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="rounded-full p-1 bg-green-700/10 text-green-600">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>Access on mobile and desktop</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="rounded-full p-1 bg-green-700/10 text-green-600">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>Certificate of completion</span>
                    </li>                    
                  </ul>
                </div>
                {isEnrolled? (
                  <Link href={"/dashboard"} className={buttonVariants({
                    className: "w-full",
                  })}>
                    <VideoIcon className="size-5"/> Watch Course
                  </Link>
                ):(
                  <>
                    <EnrollButton courseId={course.id} />
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      30-day money-back guarantee
                    </p>                      
                  </>              
                )}
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}

export default ViewCourse;