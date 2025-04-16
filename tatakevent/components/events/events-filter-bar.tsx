"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function EventsFilterBar({
  onCategoryChange,
  onRegionChange,
  onSortChange,
}: {
  onCategoryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSortChange: (value: string) => void;
}) {
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("date");

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    onRegionChange(value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    onSortChange(value);
  };

  return (
    <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md py-4 border-b mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search events..." className="pl-10" />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Startup">Startup</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Culture">Culture</SelectItem>
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Philippines">Philippines</SelectItem>
              <SelectItem value="Asia">Asia</SelectItem>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" size="sm" className="rounded-full">
          All
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Tech
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Startup
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Design
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Business
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Culture
        </Button>
      </div>
    </div>
  );
}
