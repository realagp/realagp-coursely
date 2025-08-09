"use client";

import React from "react";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="mt-4">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tighter">About This LMS</CardTitle>
                <CardDescription className="text-muted-foreground">
                    This Learning Management System (LMS) was built to provide students and educators a
                    centralized platform to manage courses, track progress, and enhance digital learning.                    
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground mt-2">
                <ul className="list-disc pl-4">
                    <li>Course tracking and progress monitoring</li>
                    <li>Student and teacher dashboards</li>
                    <li>Responsive and user-friendly interface</li>
                    <li>Built with Next.js and Tailwind CSS</li>
                </ul>
                </div>                
            </CardContent>
        </Card>
    </div>
  )
}

export default AboutUs;