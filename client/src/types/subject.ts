export interface Subject { id: string; name: string; code: string }
export interface Grade { id: string; name: string; _count?: { students: number; classes: number } }
