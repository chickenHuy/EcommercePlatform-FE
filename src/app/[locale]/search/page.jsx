import { Separator } from "@/components/ui/separator";
import SearchHeader from "./headerSearch";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@mui/material";
import { ArrowDownWideNarrow, Filter, FilterX } from "lucide-react";
import LeftSideBar from "./leftSideBar";
import RightSideBar from "./rightSidebar";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SearchHeader />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 relative">
        {/* Left Sidebar */}
        <aside className="col-span-2">
          <LeftSideBar></LeftSideBar>
        </aside>

        {/* Center Content */}
        <div className="col-span-8 flex flex-col">
          {/* Filter Bar - Fixed Height */}
          <div className="h-24 bg-white-primary border-b">
            <div className="h-full container mx-auto flex items-center justify-end px-4">
              <Button className="bg-blue-primary opacity-90 m-1 hover:bg-white-secondary">
                <Filter className="text-black-tertiary"></Filter>
              </Button>
              <Button className="bg-blue-primary opacity-90 m-1 hover:bg-white-secondary">
                <ArrowDownWideNarrow className="text-black-tertiary"></ArrowDownWideNarrow>
              </Button>
              <span className="text-black-primary font-light ml-1 mr-1">
                Sort by:
              </span>
              <Select>
                <SelectTrigger className="w-[180px] h-10 rounded-full border-none bg-blue-primary opacity-90">
                  <SelectValue placeholder="Theme" className=""></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-auto bg-white-primary p-4">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded shadow-sm">Result 1</div>
              <div className="p-4 border rounded shadow-sm">Result 2</div>
              <div className="p-4 border rounded shadow-sm">Result 3</div>
              {/* Add more results as needed */}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-2 bg-white-primary">
          <RightSideBar></RightSideBar>
        </aside>
      </div>
    </div>
  );
}
