import { IconName } from "./Projects/iconHelper";

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: IconName; // This is what you'll save to the database
  createdAt: Date;
  updatedAt: Date;
}

// Example of how your database schema might look:
/*
CREATE TABLE projects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color like "#D8B4FE"
    icon VARCHAR(50) NOT NULL, -- Icon name like "Star", "Globe", etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/

// Example API functions for saving/retrieving projects
export const saveProjectToDB = async (
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
) => {
  // Example API call
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: project.name,
      color: project.color,
      icon: project.icon, // This will be saved as a string like "Star"
    }),
  });

  return response.json();
};

export const getProjectFromDB = async (projectId: string): Promise<Project> => {
  const response = await fetch(`/api/projects/${projectId}`);
  const data = await response.json();

  // The data.icon will be a string like "Star" that you can use with getIconComponent
  return data;
};
