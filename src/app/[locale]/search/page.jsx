"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, Filter, FilterX, Menu, Store, X } from "lucide-react";
import LeftSideBar from "./leftSideBar";
import RightSideBar from "./rightSidebar";

export default function SearchPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SearchHeader />

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar */}
        <ResizablePanel
          defaultSize={20}
          collapsible={true}
          collapsedSize={0}
          minSize={20}
          maxSize={30}
          className="hidden md:block"
        >
          <LeftSideBar />
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Center Content */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="flex flex-col h-full">
            {/* Filter Bar - Fixed Height */}
            <div className="h-24 bg-white-primary">
              <div className="h-full container mx-auto flex items-center justify-between px-4">
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLeftSidebarOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center">
                  <Button className="bg-blue-primary opacity-90 m-1 hover:bg-white-secondary">
                    <Filter className="text-black-tertiary" />
                  </Button>
                  <Button className="bg-blue-primary opacity-90 m-1 hover:bg-white-secondary">
                    <ArrowDownWideNarrow className="text-black-tertiary" />
                  </Button>
                  <span className="text-black-primary font-light ml-1 mr-1 hidden sm:inline">
                    Sort by:
                  </span>
                  <Select>
                    <SelectTrigger className="w-[180px] h-10 rounded-full border-none bg-blue-primary opacity-90">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRightSidebarOpen(true)}
                  >
                    <Store className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="m-auto"></Separator>
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
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Sidebar */}
        <ResizablePanel
          defaultSize={20}
          collapsible={true}
          collapsedSize={0}
          minSize={20}
          maxSize={30}
          className="hidden md:block"
        >
          <RightSideBar />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Mobile Left Sidebar */}
      {leftSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-64 bg-transparent-primary">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setLeftSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <LeftSideBar />
          </div>
        </div>
      )}

      {/* Mobile Right Sidebar */}
      {rightSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-transparent-primary">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-2"
              onClick={() => setRightSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <RightSideBar />
          </div>
        </div>
      )}
    </div>
  );
}
