# API Endpoints Documentation

Your Python backend needs to implement these endpoints for the project management system:

## Base URL
```
http://localhost:8000/api
```

## Projects Endpoints

### 1. Get All Projects
```
GET /projects
```
**Response:**
```json
[
  {
    "id": 1,
    "project_name": "مشروع تطوير النظام",
    "beneficiary_organization": "جامعة الملك سعود",
    "university_project_manager": "د. أحمد محمد",
    "technical_responsible_beneficiary": "م. سارة أحمد",
    "university_project_team": "فريق التطوير",
    "executing_company_name": "شركة التقنية المتقدمة",
    "executing_company_project_manager": "م. محمد علي",
    "executing_company_representative": "أ. فاطمة سالم",
    "authorization_number": "AUTH-2024-001",
    "project_authorization_date": "2024-01-15",
    "project_cost": 500000.00,
    "purchase_order_number": "PO-2024-001",
    "charter_preparation_date": "2024-01-10",
    "project_start_date": "2024-02-01",
    "type_of_project_start": "immediate",
    "project_duration_days": 180,
    "planned_project_end_date": "2024-07-30",
    "actual_project_end_date": null,
    "site_handover_date": "2024-01-25",
    "contract_signing_date": "2024-01-20",
    "project_status": "in_progress",
    "project_suspension_date": null,
    "suspension_duration": null,
    "project_resumption_date": null,
    "notes": "مشروع تطوير نظام إدارة المشاريع"
  }
]
```

### 2. Get Project by ID
```
GET /projects/{id}
```
**Response:** Same as single project object above

### 3. Create New Project
```
POST /projects
```
**Request Body:**
```json
{
  "license_start_date": "2024-01-01",
  "license_end_date": "2024-12-31", 
  "has_license": true,
  "license_notes": "رخصة سارية المفعول",
  "project_name": "مشروع جديد",
  "beneficiary_organization": "جامعة الملك سعود",
  "university_project_manager": "د. أحمد محمد",
  "technical_responsible_beneficiary": "م. سارة أحمد",
  "university_project_team": "فريق التطوير",
  "executing_company_name": "شركة التقنية المتقدمة",
  "executing_company_project_manager": "م. محمد علي",
  "executing_company_representative": "أ. فاطمة سالم",
  "authorization_number": "AUTH-2024-002",
  "project_authorization_date": "2024-01-15",
  "project_cost": 750000.00,
  "purchase_order_number": "PO-2024-002",
  "charter_preparation_date": "2024-01-10",
  "project_start_date": "2024-02-01",
  "type_of_project_start": "scheduled",
  "project_duration_days": 240,
  "planned_project_end_date": "2024-09-30",
  "actual_project_end_date": null,
  "site_handover_date": "2024-01-25",
  "contract_signing_date": "2024-01-20",
  "project_status": "planning",
  "project_suspension_date": null,
  "suspension_duration": null,
  "project_resumption_date": null,
  "notes": "ملاحظات المشروع"
}
```
**Response:** Created project object with assigned ID

### 4. Update Project
```
PUT /projects/{id}
```
**Request Body:** Same as create project
**Response:** Updated project object

### 5. Delete Project
```
DELETE /projects/{id}
```
**Response:** 
```json
{
  "message": "Project deleted successfully"
}
```

### 6. Get Projects by Status (Optional)
```
GET /projects/status/{status}
```
**Parameters:**
- status: planning, in_progress, suspended, completed, cancelled

## Data Types and Validation

### Project Status Options:
- `planning` - تخطيط
- `in_progress` - قيد التنفيذ  
- `suspended` - متوقف
- `completed` - مكتمل
- `cancelled` - ملغي

### Project Start Type Options:
- `immediate` - فوري
- `scheduled` - مجدول
- `conditional` - مشروط

### Required Fields:
- `has_license` (boolean)
- `project_name` (string)
- `beneficiary_organization` (string)
- `university_project_manager` (string)
- `executing_company_name` (string)
- `project_cost` (decimal/float)
- `project_start_date` (date)

### Optional Fields:
- `license_start_date` (date)
- `license_end_date` (date) 
- `license_notes` (string)
All other fields are optional and can be null/empty

### Date Format:
All dates should be in ISO format: `YYYY-MM-DD`

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 404 Not Found
```json
{
  "detail": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## CORS Configuration
Make sure your Python backend allows CORS for:
- Origin: `http://localhost:5173` (Vite dev server)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

## Example Python FastAPI Implementation Structure:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import date

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectCreate(BaseModel):
    project_name: str
    beneficiary_organization: str
    university_project_manager: str
    # ... other fields

class ProjectResponse(BaseModel):
    id: int
    project_name: str
    beneficiary_organization: str
    # ... other fields

@app.get("/api/projects")
async def get_projects():
    # Implementation here
    pass

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    # Implementation here
    pass

# ... other endpoints
```