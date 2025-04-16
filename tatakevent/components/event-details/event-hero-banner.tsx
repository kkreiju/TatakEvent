import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EventHeroBannerProps = {
  title: string;
  image: string;
  status: string;
  tags: string[];
  getStatusColor: (status: string) => string;
};

export default function EventHeroBanner({
  title,
  image,
  status,
  tags,
  getStatusColor,
}: EventHeroBannerProps) {
  return (
    <div className="relative h-[40vh] md:h-[50vh]">
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="container mx-auto">
          <Link
            href="/landing/events"
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {title}
            </h1>
            <Badge className={`${getStatusColor(status)} text-white`}>
              {status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
