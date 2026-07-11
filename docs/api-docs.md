# Portfolio CMS API (1.0.0)

API documentation for Portfolio CMS

## Base URL

`/api/v1`

## Endpoints

### POST /api/v1/auth/register

**Summary:** Register User

**Description:** Register a new user account.

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "fullName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 30,
      "pattern": "^[a-zA-Z0-9_]+$"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 128
    }
  },
  "required": ["fullName", "username", "email", "password"]
}
```

**Responses:**

- **201:** User registered successfully

---

### POST /api/v1/auth/login

**Summary:** Login User

**Description:** Login to an existing user account.

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": ["email", "password"]
}
```

**Responses:**

- **200:** Login successful

---

### GET /api/v1/auth/me

**Summary:** Get Current User

**Description:** Fetch the profile of the currently authenticated user.

**Requires Authentication:** Yes

**Responses:**

- **200:** User profile fetched successfully

---

### PUT /api/v1/auth/change-password

**Summary:** Change Password

**Description:** Change the password of the authenticated user.

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "$ref": "#/components/schemas/ChangePasswordRequest"
}
```

**Responses:**

- **200:** Password changed successfully

---

### DELETE /api/v1/auth/account

**Summary:** Delete Account

**Description:** Permanently delete the authenticated user account and all associated data.

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "$ref": "#/components/schemas/DeleteAccountRequest"
}
```

**Responses:**

- **200:** Account deleted successfully

---

### GET /api/v1/health

**Summary:** API Health Check

**Description:** Returns the health status of the API.

**Responses:**

- **200:** Healthy response

---

### POST /api/v1/profile

**Summary:** Create user profile

**Description:** Creates a profile for the authenticated user.

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "$ref": "#/components/schemas/CreateProfileRequest"
}
```

**Responses:**

- **201:** Profile created successfully.
- **401:** Unauthorized
- **409:** Profile already exists for this user.

---

### GET /api/v1/profile

**Summary:** Get user profile

**Description:** Retrieves the profile of the authenticated user.

**Requires Authentication:** Yes

**Responses:**

- **200:** Profile retrieved successfully.
- **401:** Unauthorized
- **404:** Profile not found.

---

### PUT /api/v1/profile

**Summary:** Update user profile

**Description:** Updates the profile of the authenticated user.

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "$ref": "#/components/schemas/UpdateProfileRequest"
}
```

**Responses:**

- **200:** Profile updated successfully.
- **401:** Unauthorized
- **404:** Profile not found.

---

### GET /api/v1/profile/portfolio-settings

**Summary:** Get portfolio settings

**Description:** Retrieves the portfolio settings of the authenticated user.

**Requires Authentication:** Yes

**Responses:**

- **200:** Portfolio settings retrieved successfully.
- **401:** Unauthorized

---

### PUT /api/v1/profile/portfolio-settings

**Summary:** Update portfolio settings

**Description:** Updates the portfolio settings of the authenticated user.

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "$ref": "#/components/schemas/UpdatePortfolioSettingsRequest"
}
```

**Responses:**

- **200:** Portfolio settings updated successfully.
- **401:** Unauthorized

---

### POST /api/v1/media/upload

**Summary:** Upload media

**Requires Authentication:** Yes

**Responses:**

- **201:** Media uploaded successfully
- **400:** Bad Request / Validation Error
- **401:** Unauthorized

---

### GET /api/v1/media/{id}

**Summary:** Get media by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Media retrieved successfully
- **401:** Unauthorized
- **404:** Media not found

---

### DELETE /api/v1/media/{id}

**Summary:** Delete media

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Media deleted successfully
- **401:** Unauthorized
- **404:** Media not found

---

### POST /api/v1/projects

**Summary:** Create a new project

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 3,
      "maxLength": 255,
      "example": "My Awesome Project"
    },
    "description": {
      "type": "string",
      "minLength": 10,
      "example": "A comprehensive project describing my skills."
    },
    "categoryId": {
      "type": "string",
      "format": "cuid",
      "example": "ckz1234567890"
    },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "PUBLISHED", "ARCHIVED"],
      "default": "DRAFT",
      "example": "PUBLISHED"
    },
    "technologies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "example": ["React", "Node.js", "Prisma"]
    },
    "liveUrl": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "string",
          "enum": [""]
        },
        {
          "nullable": true
        }
      ],
      "example": "https://myproject.com"
    },
    "githubUrl": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "string",
          "enum": [""]
        },
        {
          "nullable": true
        }
      ],
      "example": "https://github.com/myuser/myproject"
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "example": true
    },
    "thumbnailMediaId": {
      "anyOf": [
        {
          "type": "string",
          "nullable": true
        },
        {
          "type": "string",
          "enum": [""]
        },
        {
          "nullable": true
        }
      ]
    }
  },
  "required": ["title", "description", "categoryId", "technologies"]
}
```

**Responses:**

- **201:** Project created successfully
- **400:** Validation Error
- **401:** Unauthorized

---

### GET /api/v1/projects

**Summary:** List projects for authenticated user

**Requires Authentication:** Yes

**Parameters:**

- `page` (query):
- `limit` (query):
- `search` (query):
- `sortBy` (query):
- `sortOrder` (query):
- `categoryId` (query):
- `status` (query):

**Responses:**

- **200:** Projects retrieved successfully
- **401:** Unauthorized

---

### GET /api/v1/projects/{id}

**Summary:** Get project by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Project retrieved successfully
- **401:** Unauthorized
- **403:** Forbidden (Not the owner)
- **404:** Project not found

---

### PUT /api/v1/projects/{id}

**Summary:** Update project by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 3,
      "maxLength": 255,
      "example": "My Awesome Project"
    },
    "description": {
      "type": "string",
      "minLength": 10,
      "example": "A comprehensive project describing my skills."
    },
    "categoryId": {
      "type": "string",
      "format": "cuid",
      "example": "ckz1234567890"
    },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "PUBLISHED", "ARCHIVED"],
      "example": "PUBLISHED"
    },
    "technologies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "example": ["React", "Node.js", "Prisma"]
    },
    "liveUrl": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "string",
          "enum": [""]
        },
        {
          "nullable": true
        }
      ],
      "example": "https://myproject.com"
    },
    "githubUrl": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "string",
          "enum": [""]
        },
        {
          "nullable": true
        }
      ],
      "example": "https://github.com/myuser/myproject"
    },
    "featured": {
      "type": "boolean"
    },
    "thumbnailMediaId": {
      "anyOf": [
        {
          "type": "string",
          "nullable": true
        },
        {
          "type": "string",
          "enum": [""]
        },
        {
          "nullable": true
        }
      ]
    }
  }
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Project updated successfully
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Project not found

---

### DELETE /api/v1/projects/{id}

**Summary:** Delete project by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Project deleted successfully
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Project not found

---

### POST /api/v1/skills

**Summary:** Create a new skill

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "categoryId": {
      "type": "string",
      "format": "cuid"
    },
    "proficiency": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 0
    },
    "yearsOfExperience": {
      "type": "integer",
      "minimum": 0,
      "default": 0
    },
    "displayOrder": {
      "type": "integer",
      "default": 0
    }
  },
  "required": ["name", "categoryId"]
}
```

**Responses:**

- **201:** Skill created successfully
- **400:** Validation Error
- **401:** Unauthorized

---

### GET /api/v1/skills

**Summary:** List skills for authenticated user

**Requires Authentication:** Yes

**Responses:**

- **200:** Skills retrieved successfully
- **401:** Unauthorized

---

### GET /api/v1/skills/{id}

**Summary:** Get skill by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Skill retrieved successfully
- **401:** Unauthorized
- **403:** Forbidden (Not the owner)
- **404:** Skill not found

---

### PUT /api/v1/skills/{id}

**Summary:** Update skill by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "categoryId": {
      "type": "string",
      "format": "cuid"
    },
    "proficiency": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "yearsOfExperience": {
      "type": "integer",
      "minimum": 0
    },
    "displayOrder": {
      "type": "integer"
    }
  }
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Skill updated successfully
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Skill not found

---

### DELETE /api/v1/skills/{id}

**Summary:** Delete skill by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Skill deleted successfully
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Skill not found

---

### POST /api/v1/categories

**Summary:** Create a new category

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "slug": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "type": {
      "type": "string",
      "enum": ["PROJECT", "SKILL", "BLOG", "EMPLOYMENT_TYPE"]
    },
    "displayOrder": {
      "type": "integer"
    },
    "isActive": {
      "type": "boolean"
    }
  },
  "required": ["name", "slug", "type"]
}
```

**Responses:**

- **201:** Category created successfully
- **400:** Validation Error or duplicate slug/name

---

### GET /api/v1/categories

**Summary:** List all categories

**Requires Authentication:** Yes

**Responses:**

- **200:** Categories retrieved successfully

---

### GET /api/v1/categories/dropdown

**Summary:** Get categories for dropdowns

**Requires Authentication:** Yes

**Parameters:**

- `type` (query): (Required)

**Responses:**

- **200:** Dropdown items retrieved

---

### GET /api/v1/categories/{id}

**Summary:** Get category by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Category retrieved
- **404:** Not found

---

### PUT /api/v1/categories/{id}

**Summary:** Update category by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "type": {
      "type": "string",
      "enum": ["PROJECT", "SKILL", "BLOG", "EMPLOYMENT_TYPE"]
    },
    "displayOrder": {
      "type": "integer"
    },
    "isActive": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Category updated
- **400:** Validation Error or duplicate name

---

### DELETE /api/v1/categories/{id}

**Summary:** Delete category by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **204:** Category deleted
- **400:** Category in use

---

### POST /api/v1/experiences

**Summary:** Create a new experience

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "company": {
      "type": "string",
      "minLength": 1,
      "example": "Google"
    },
    "role": {
      "type": "string",
      "minLength": 1,
      "example": "Software Engineer"
    },
    "employmentTypeId": {
      "type": "string",
      "format": "cuid",
      "example": "cuid_value_here"
    },
    "location": {
      "type": "string",
      "example": "Mountain View, CA"
    },
    "startDate": {
      "type": "string",
      "format": "date-time",
      "example": "2020-01-01T00:00:00Z"
    },
    "endDate": {
      "type": "string",
      "nullable": true,
      "format": "date-time",
      "example": "2023-01-01T00:00:00Z"
    },
    "isCurrent": {
      "type": "boolean",
      "default": false,
      "example": false
    },
    "description": {
      "type": "string",
      "example": "Worked on Google Cloud Platform"
    },
    "responsibilities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [],
      "example": ["Built things", "Fixed bugs"]
    },
    "technologies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [],
      "example": ["Go", "Kubernetes"]
    },
    "displayOrder": {
      "type": "integer",
      "default": 0,
      "example": 0
    }
  },
  "required": ["company", "role", "employmentTypeId", "startDate"]
}
```

**Responses:**

- **201:** Experience created successfully
- **400:** Validation Error
- **401:** Unauthorized

---

### GET /api/v1/experiences

**Summary:** List experiences for authenticated user

**Requires Authentication:** Yes

**Responses:**

- **200:** Experiences retrieved successfully
- **401:** Unauthorized

---

### GET /api/v1/experiences/{id}

**Summary:** Get experience by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Experience retrieved successfully
- **401:** Unauthorized
- **403:** Forbidden (Not the owner)
- **404:** Experience not found

---

### PUT /api/v1/experiences/{id}

**Summary:** Update experience by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "company": {
      "type": "string",
      "minLength": 1,
      "example": "Google"
    },
    "role": {
      "type": "string",
      "minLength": 1,
      "example": "Software Engineer"
    },
    "employmentTypeId": {
      "type": "string",
      "format": "cuid",
      "example": "cuid_value_here"
    },
    "location": {
      "type": "string",
      "example": "Mountain View, CA"
    },
    "startDate": {
      "type": "string",
      "format": "date-time",
      "example": "2020-01-01T00:00:00Z"
    },
    "endDate": {
      "type": "string",
      "nullable": true,
      "format": "date-time",
      "example": "2023-01-01T00:00:00Z"
    },
    "isCurrent": {
      "type": "boolean",
      "example": false
    },
    "description": {
      "type": "string",
      "example": "Worked on Google Cloud Platform"
    },
    "responsibilities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "example": ["Built things", "Fixed bugs"]
    },
    "technologies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "example": ["Go", "Kubernetes"]
    },
    "displayOrder": {
      "type": "integer",
      "example": 0
    }
  }
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Experience updated successfully
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Experience not found

---

### DELETE /api/v1/experiences/{id}

**Summary:** Delete experience by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Experience deleted successfully
- **204:** Experience deleted successfully (No Content)
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Experience not found

---

### POST /api/v1/educations

**Summary:** Create a new education

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "institution": {
      "type": "string",
      "minLength": 1,
      "example": "Harvard University"
    },
    "degree": {
      "type": "string",
      "minLength": 1,
      "example": "Bachelor of Science"
    },
    "fieldOfStudy": {
      "type": "string",
      "minLength": 1,
      "example": "Computer Science"
    },
    "startDate": {
      "type": "string",
      "format": "date-time",
      "example": "2016-09-01T00:00:00Z"
    },
    "endDate": {
      "type": "string",
      "nullable": true,
      "format": "date-time",
      "example": "2020-06-01T00:00:00Z"
    },
    "gpa": {
      "type": "string",
      "example": "3.8"
    },
    "location": {
      "type": "string",
      "example": "Cambridge, MA"
    },
    "description": {
      "type": "string",
      "example": "Studied algorithms and data structures"
    },
    "activities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [],
      "example": ["Coding Club", "Robotics Team"]
    },
    "displayOrder": {
      "type": "integer",
      "default": 0,
      "example": 0
    }
  },
  "required": ["institution", "degree", "fieldOfStudy", "startDate"]
}
```

**Responses:**

- **201:** Education created successfully
- **400:** Validation Error
- **401:** Unauthorized

---

### GET /api/v1/educations

**Summary:** List educations for authenticated user

**Requires Authentication:** Yes

**Responses:**

- **200:** Educations retrieved successfully
- **401:** Unauthorized

---

### GET /api/v1/educations/{id}

**Summary:** Get education by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Education retrieved successfully
- **401:** Unauthorized
- **403:** Forbidden (Not the owner)
- **404:** Education not found

---

### PUT /api/v1/educations/{id}

**Summary:** Update education by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "institution": {
      "type": "string",
      "minLength": 1,
      "example": "Harvard University"
    },
    "degree": {
      "type": "string",
      "minLength": 1,
      "example": "Bachelor of Science"
    },
    "fieldOfStudy": {
      "type": "string",
      "minLength": 1,
      "example": "Computer Science"
    },
    "startDate": {
      "type": "string",
      "format": "date-time",
      "example": "2016-09-01T00:00:00Z"
    },
    "endDate": {
      "type": "string",
      "nullable": true,
      "format": "date-time",
      "example": "2020-06-01T00:00:00Z"
    },
    "gpa": {
      "type": "string",
      "example": "3.8"
    },
    "location": {
      "type": "string",
      "example": "Cambridge, MA"
    },
    "description": {
      "type": "string",
      "example": "Studied algorithms and data structures"
    },
    "activities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "example": ["Coding Club", "Robotics Team"]
    },
    "displayOrder": {
      "type": "integer",
      "example": 0
    }
  }
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Education updated successfully
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Education not found

---

### DELETE /api/v1/educations/{id}

**Summary:** Delete education by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Education deleted successfully
- **204:** Education deleted successfully (No Content)
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Education not found

---

### POST /api/v1/certifications

**Summary:** Create a new certification

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "example": "AWS Certified Solutions Architect"
    },
    "issuer": {
      "type": "string",
      "minLength": 1,
      "example": "Amazon Web Services"
    },
    "issueDate": {
      "type": "string",
      "format": "date-time",
      "example": "2023-01-15T00:00:00Z"
    },
    "expiryDate": {
      "type": "string",
      "nullable": true,
      "format": "date-time",
      "example": "2026-01-15T00:00:00Z"
    },
    "credentialId": {
      "type": "string",
      "example": "AWS-12345678"
    },
    "verificationUrl": {
      "type": "string",
      "format": "uri",
      "example": "https://aws.amazon.com/verify/12345678"
    },
    "certificateMediaId": {
      "type": "string",
      "nullable": true,
      "example": null
    },
    "displayOrder": {
      "type": "integer",
      "default": 0,
      "example": 0
    }
  },
  "required": ["name", "issuer", "issueDate"]
}
```

**Responses:**

- **201:** Certification created successfully
- **400:** Validation Error
- **401:** Unauthorized

---

### GET /api/v1/certifications

**Summary:** List certifications for authenticated user

**Requires Authentication:** Yes

**Responses:**

- **200:** Certifications retrieved successfully
- **401:** Unauthorized

---

### GET /api/v1/certifications/{id}

**Summary:** Get certification by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Certification retrieved successfully
- **401:** Unauthorized
- **403:** Forbidden (Not the owner)
- **404:** Certification not found

---

### PUT /api/v1/certifications/{id}

**Summary:** Update certification by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "example": "AWS Certified Solutions Architect"
    },
    "issuer": {
      "type": "string",
      "minLength": 1,
      "example": "Amazon Web Services"
    },
    "issueDate": {
      "type": "string",
      "format": "date-time",
      "example": "2023-01-15T00:00:00Z"
    },
    "expiryDate": {
      "type": "string",
      "nullable": true,
      "format": "date-time",
      "example": "2026-01-15T00:00:00Z"
    },
    "credentialId": {
      "type": "string",
      "example": "AWS-12345678"
    },
    "verificationUrl": {
      "type": "string",
      "format": "uri",
      "example": "https://aws.amazon.com/verify/12345678"
    },
    "certificateMediaId": {
      "type": "string",
      "nullable": true,
      "example": null
    },
    "displayOrder": {
      "type": "integer",
      "example": 0
    }
  }
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Certification updated successfully
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Certification not found

---

### DELETE /api/v1/certifications/{id}

**Summary:** Delete certification by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **204:** Certification deleted successfully (No Content)
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Certification not found

---

### POST /api/v1/blogs

**Summary:** Create a new blog

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1
    },
    "slug": {
      "type": "string",
      "minLength": 1,
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "excerpt": {
      "type": "string",
      "minLength": 1
    },
    "content": {
      "type": "string",
      "minLength": 1
    },
    "coverMediaId": {
      "type": "string"
    },
    "readTime": {
      "type": "integer",
      "minimum": 0
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "PUBLISHED"]
    },
    "featured": {
      "type": "boolean"
    },
    "seoTitle": {
      "type": "string"
    },
    "seoDescription": {
      "type": "string"
    }
  },
  "required": ["title", "slug", "excerpt", "content"]
}
```

**Responses:**

- **201:** Blog created successfully
- **400:** Validation Error
- **401:** Unauthorized
- **409:** Conflict

---

### GET /api/v1/blogs

**Summary:** List blogs for authenticated user

**Requires Authentication:** Yes

**Parameters:**

- `page` (query):
- `limit` (query):
- `search` (query):
- `sortBy` (query):
- `sortOrder` (query):
- `status` (query):
- `featured` (query):

**Responses:**

- **200:** Blogs retrieved successfully
- **401:** Unauthorized

---

### GET /api/v1/blogs/{id}

**Summary:** Get blog by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Blog retrieved successfully
- **401:** Unauthorized
- **403:** Forbidden (Not the owner)
- **404:** Blog not found

---

### PUT /api/v1/blogs/{id}

**Summary:** Update blog by ID

**Requires Authentication:** Yes

**Request Body Schema:**

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1
    },
    "slug": {
      "type": "string",
      "minLength": 1,
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "excerpt": {
      "type": "string",
      "minLength": 1
    },
    "content": {
      "type": "string",
      "minLength": 1
    },
    "coverMediaId": {
      "type": "string"
    },
    "readTime": {
      "type": "integer",
      "minimum": 0
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "PUBLISHED"]
    },
    "featured": {
      "type": "boolean"
    },
    "seoTitle": {
      "type": "string"
    },
    "seoDescription": {
      "type": "string"
    }
  }
}
```

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Blog updated successfully
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Blog not found
- **409:** Conflict

---

### DELETE /api/v1/blogs/{id}

**Summary:** Delete blog by ID

**Requires Authentication:** Yes

**Parameters:**

- `id` (path): (Required)

**Responses:**

- **200:** Blog deleted successfully
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Blog not found

---

### GET /api/v1/portfolio/{username}

**Summary:** Get Portfolio Homepage

**Description:** Retrieves aggregated portfolio data for the given username, including profile, featured projects, skills, experiences, educations, certifications, and latest published blogs.

**Parameters:**

- `username` (path): (Required)

**Responses:**

- **200:** Portfolio homepage data retrieved successfully
- **404:** Portfolio not found for the given username

---

### GET /api/v1/portfolio/{username}/projects

**Summary:** Get Portfolio Projects

**Description:** Retrieves a paginated list of published projects for the given username.

**Parameters:**

- `username` (path): (Required)
- `page` (query):
- `limit` (query):
- `search` (query):
- `sortBy` (query):
- `sortOrder` (query):
- `categoryId` (query):
- `status` (query):

**Responses:**

- **200:** Projects retrieved successfully
- **404:** Portfolio not found for the given username

---

### GET /api/v1/portfolio/{username}/projects/{id}

**Summary:** Get Portfolio Project by ID

**Description:** Retrieves details of a specific published project for the given username.

**Parameters:**

- `username` (path): (Required)
- `id` (path): (Required)

**Responses:**

- **200:** Project retrieved successfully
- **404:** Project not found or not published

---

### GET /api/v1/portfolio/{username}/blogs

**Summary:** Get Portfolio Blogs

**Description:** Retrieves a paginated list of published blogs for the given username.

**Parameters:**

- `username` (path): (Required)
- `page` (query):
- `limit` (query):
- `search` (query):
- `sortBy` (query):
- `sortOrder` (query):
- `status` (query):
- `featured` (query):

**Responses:**

- **200:** Blogs retrieved successfully
- **404:** Portfolio not found for the given username

---

### GET /api/v1/portfolio/{username}/blogs/{slug}

**Summary:** Get Portfolio Blog by Slug

**Description:** Retrieves details of a specific published blog by its slug for the given username.

**Parameters:**

- `username` (path): (Required)
- `slug` (path): (Required)

**Responses:**

- **200:** Blog retrieved successfully
- **404:** Blog not found or not published

---

### GET /api/v1/dashboard

**Summary:** Get dashboard statistics and recent activity

**Requires Authentication:** Yes

**Responses:**

- **200:** Dashboard data retrieved successfully
- **401:** Unauthorized

---
