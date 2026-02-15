# OpenAPI/Swagger Documentation

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "T.O.O.L.S Inc API",
    "description": "REST API for reentry support and workforce development platform",
    "version": "1.0.0",
    "contact": {
      "name": "API Support",
      "email": "api@sdtoolsinc.org"
    }
  },
  "servers": [
    {
      "url": "https://api.sdtoolsinc.org",
      "description": "Production"
    },
    {
      "url": "http://localhost:3000/api",
      "description": "Development"
    }
  ],
  "paths": {
    "/v1/auth/login": {
      "post": {
        "tags": ["Authentication"],
        "summary": "Login user",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": { "type": "string", "format": "email" },
                  "password": { "type": "string", "format": "password" }
                },
                "required": ["email", "password"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": { "type": "string" },
                    "user": { "$ref": "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Invalid credentials"
          }
        }
      }
    },
    "/v1/auth/signup": {
      "post": {
        "tags": ["Authentication"],
        "summary": "Register new user",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": { "type": "string", "format": "email" },
                  "password": { "type": "string", "format": "password" },
                  "fullName": { "type": "string" }
                },
                "required": ["email", "password", "fullName"]
              }
            }
          }
        },
        "responses": {
          "201": { "description": "User created" },
          "400": { "description": "Validation error" }
        }
      }
    },
    "/v1/users/me": {
      "get": {
        "tags": ["Users"],
        "summary": "Get current user profile",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": {
            "description": "User profile",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/User" }
              }
            }
          },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/v1/courses": {
      "get": {
        "tags": ["Courses"],
        "summary": "List all courses",
        "parameters": [
          { "name": "limit", "in": "query", "schema": { "type": "integer" } },
          { "name": "offset", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": {
            "description": "Course list",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Course" }
                    },
                    "total": { "type": "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/v1/admin/users": {
      "get": {
        "tags": ["Admin"],
        "summary": "List all users (admin only)",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "User list" },
          "403": { "description": "Forbidden" }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "email": { "type": "string" },
          "fullName": { "type": "string" },
          "role": { "type": "string", "enum": ["client", "case_manager", "admin"] },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      "Course": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "level": { "type": "string", "enum": ["Beginner", "Intermediate", "Advanced"] },
          "duration": { "type": "string" }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}
```

## View API Documentation

Access Swagger UI at: `https://api.sdtoolsinc.org/docs`

```bash
# Generate OpenAPI spec from code
npm run generate-openapi

# Validate OpenAPI spec
npm run validate-openapi

# Generate TypeScript types from OpenAPI
npm run generate-api-types
```
