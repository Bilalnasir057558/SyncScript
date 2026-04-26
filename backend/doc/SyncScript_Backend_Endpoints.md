# SyncScript Backend - Complete Endpoint Specification

## Project Structure Overview
```
Backend will have:
- User authentication & management
- Vault CRUD operations
- Vault collaboration (sharing, roles)
- Resource management (add, read, delete)
- Annotation management (notes, comments, files)
- Error handling & middleware
```

---

## 📋 USER ENDPOINTS

### **Authentication Flow**

#### 1. **POST /api/v1/users/register**
- **Controller:** `userController.register()`
- **Why:** Create new user account with username, email, password
- **Request Body:** username, email, password
- **Response:** User object + access token + refresh token
- **Auth Required:** No

#### 2. **POST /api/v1/users/login**
- **Controller:** `userController.login()`
- **Why:** Authenticate user and generate tokens for session
- **Request Body:** email/username, password
- **Response:** User object + access token + refresh token (in cookie)
- **Auth Required:** No

#### 3. **POST /api/v1/users/logout**
- **Controller:** `userController.logout()`
- **Why:** Clear refresh token from database and cookies, end user session
- **Request Body:** None
- **Response:** Success message
- **Auth Required:** Yes (JWT)

#### 4. **POST /api/v1/users/refresh-token**
- **Controller:** `userController.refreshAccessToken()`
- **Why:** Generate new access token when expired using refresh token
- **Request Body:** None (refresh token in cookie)
- **Response:** New access token + refresh token
- **Auth Required:** No (uses refresh token)

#### 5. **GET /api/v1/users/me**
- **Controller:** `userController.getCurrentUser()`
- **Why:** Fetch current logged-in user's profile information
- **Request Body:** None
- **Response:** User object (id, username, email, createdAt)
- **Auth Required:** Yes (JWT)

---

## 🏠 VAULT ENDPOINTS

### **Create Vault**

#### 6. **POST /api/v1/vaults**
- **Controller:** `vaultController.createVault()`
- **Why:** Create a new knowledge vault for the authenticated user
- **Request Body:** name, description (optional)
- **Response:** Vault object with id, createdBy, name, description, createdAt
- **Auth Required:** Yes (JWT)
- **Note:** createdBy should be set from req.user.id

### **Read Vaults**

#### 7. **GET /api/v1/vaults**
- **Controller:** `vaultController.getUserVaults()`
- **Why:** Fetch all vaults created by user + all vaults user is member of
- **Request Body:** None
- **Query Params:** Optional (limit, page for pagination)
- **Response:** Array of vault objects with member roles
- **Auth Required:** Yes (JWT)

#### 8. **GET /api/v1/vaults/:vaultId**
- **Controller:** `vaultController.getVaultById()`
- **Why:** Fetch specific vault details (check user has access)
- **Request Body:** None
- **Response:** Vault object + list of members with their roles
- **Auth Required:** Yes (JWT)
- **Note:** Verify user is Owner/Contributor/Viewer of this vault

### **Update Vault**

#### 9. **PUT /api/v1/vaults/:vaultId**
- **Controller:** `vaultController.updateVault()`
- **Why:** Update vault name and description
- **Request Body:** name, description
- **Response:** Updated vault object
- **Auth Required:** Yes (JWT)
- **Note:** Only Owner can update vault

### **Delete Vault**

#### 10. **DELETE /api/v1/vaults/:vaultId**
- **Controller:** `vaultController.deleteVault()`
- **Why:** Delete entire vault and all its resources and annotations
- **Request Body:** None
- **Response:** Success message
- **Auth Required:** Yes (JWT)
- **Note:** Only Owner can delete vault. CASCADE delete all resources

---

## 👥 VAULT COLLABORATION ENDPOINTS

### **Add Member to Vault**

#### 11. **POST /api/v1/vaults/:vaultId/members**
- **Controller:** `vaultMemberController.addVaultMember()`
- **Why:** Share vault with another user and assign role
- **Request Body:** userId, role (Owner/Contributor/Viewer)
- **Response:** VaultMember object with userId, vaultId, role, addedAt
- **Auth Required:** Yes (JWT)
- **Note:** Only Owner can add members. Check user exists before adding.

### **Get Vault Members**

#### 12. **GET /api/v1/vaults/:vaultId/members**
- **Controller:** `vaultMemberController.getVaultMembers()`
- **Why:** Fetch all members of a vault with their roles and join dates
- **Request Body:** None
- **Response:** Array of member objects with username, role, addedAt
- **Auth Required:** Yes (JWT)
- **Note:** Only vault members can view member list

### **Update Member Role**

#### 13. **PUT /api/v1/vaults/:vaultId/members/:memberId**
- **Controller:** `vaultMemberController.updateMemberRole()`
- **Why:** Change a member's role (Owner/Contributor/Viewer)
- **Request Body:** role
- **Response:** Updated VaultMember object
- **Auth Required:** Yes (JWT)
- **Note:** Only Owner can change roles. Can't demote last owner.

### **Remove Member from Vault**

#### 14. **DELETE /api/v1/vaults/:vaultId/members/:memberId**
- **Controller:** `vaultMemberController.removeVaultMember()`
- **Why:** Remove user from vault (revoke access)
- **Request Body:** None
- **Response:** Success message
- **Auth Required:** Yes (JWT)
- **Note:** Only Owner can remove members

---

## 📦 RESOURCE ENDPOINTS

### **Create Resource (Add Link)**

#### 15. **POST /api/v1/vaults/:vaultId/resources**
- **Controller:** `resourceController.createResource()`
- **Why:** Add a new link/resource to vault
- **Request Body:** title, url
- **Response:** Resource object with id, vaultId, createdBy, title, url, createdAt
- **Auth Required:** Yes (JWT)
- **Note:** User must be Owner/Contributor of vault. createdBy = req.user.id

### **Get All Resources in Vault**

#### 16. **GET /api/v1/vaults/:vaultId/resources**
- **Controller:** `resourceController.getVaultResources()`
- **Why:** Fetch all links/resources in a specific vault
- **Request Body:** None
- **Query Params:** Optional (limit, page, sortBy)
- **Response:** Array of resource objects with creator info
- **Auth Required:** Yes (JWT)
- **Note:** User must have access to vault

### **Get Single Resource**

#### 17. **GET /api/v1/resources/:resourceId**
- **Controller:** `resourceController.getResourceById()`
- **Why:** Fetch specific resource details and its metadata
- **Request Body:** None
- **Response:** Resource object with creator name, creation date
- **Auth Required:** Yes (JWT)
- **Note:** User must have access to parent vault

### **Update Resource**

#### 18. **PUT /api/v1/resources/:resourceId**
- **Controller:** `resourceController.updateResource()`
- **Why:** Update resource title and/or url
- **Request Body:** title, url
- **Response:** Updated resource object
- **Auth Required:** Yes (JWT)
- **Note:** Only creator or Owner can update

### **Delete Resource**

#### 19. **DELETE /api/v1/resources/:resourceId**
- **Controller:** `resourceController.deleteResource()`
- **Why:** Remove resource from vault (CASCADE deletes annotations)
- **Request Body:** None
- **Response:** Success message
- **Auth Required:** Yes (JWT)
- **Note:** Only creator or Owner can delete

---

## 💬 ANNOTATION ENDPOINTS

### **Create Annotation (Add Note/Comment/File)**

#### 20. **POST /api/v1/resources/:resourceId/annotations**
- **Controller:** `annotationController.createAnnotation()`
- **Why:** Add note/comment on a resource OR upload file
- **Request Body (Note):** type='note', content
- **Request Body (File):** type='file', fileName, (file upload via multer)
- **Response:** Annotation object with id, resourceId, userId, type, content/fileName, createdAt
- **Auth Required:** Yes (JWT)
- **Note:** User must have access to parent vault

### **Get All Annotations on Resource**

#### 21. **GET /api/v1/resources/:resourceId/annotations**
- **Controller:** `annotationController.getResourceAnnotations()`
- **Why:** Fetch all notes/comments/files on a specific resource
- **Request Body:** None
- **Query Params:** Optional (limit, page, sortBy)
- **Response:** Array of annotation objects with author usernames
- **Auth Required:** Yes (JWT)
- **Note:** User must have access to parent vault

### **Get Single Annotation**

#### 22. **GET /api/v1/annotations/:annotationId**
- **Controller:** `annotationController.getAnnotationById()`
- **Why:** Fetch specific annotation details
- **Request Body:** None
- **Response:** Annotation object with creator, type, content/file info
- **Auth Required:** Yes (JWT)

### **Update Annotation**

#### 23. **PUT /api/v1/annotations/:annotationId**
- **Controller:** `annotationController.updateAnnotation()`
- **Why:** Edit note/comment content
- **Request Body:** content
- **Response:** Updated annotation object
- **Auth Required:** Yes (JWT)
- **Note:** Only creator can update

### **Delete Annotation**

#### 24. **DELETE /api/v1/annotations/:annotationId**
- **Controller:** `annotationController.deleteAnnotation()`
- **Why:** Remove note/comment/file from resource
- **Request Body:** None
- **Response:** Success message
- **Auth Required:** Yes (JWT)
- **Note:** Only creator can delete

---

## 🔍 SEARCH & FILTER ENDPOINTS (Optional but useful)

#### 25. **GET /api/v1/vaults/:vaultId/search**
- **Controller:** `searchController.searchInVault()`
- **Why:** Search resources by title or annotations by content in a vault
- **Request Body:** None
- **Query Params:** q (search term), type (resource/annotation)
- **Response:** Array of matching resources and annotations
- **Auth Required:** Yes (JWT)

#### 26. **GET /api/v1/users/:userId/activity**
- **Controller:** `activityController.getUserActivity()`
- **Why:** Track user's activity (resources created, annotations made)
- **Request Body:** None
- **Query Params:** limit, page
- **Response:** Array of activity items with timestamps
- **Auth Required:** Yes (JWT)

---

## 📊 ENDPOINT SUMMARY TABLE

```
┌────┬──────────────┬──────────────────────────────────┬────────┬──────────────┐
│ #  │ HTTP METHOD  │ ENDPOINT                         │ AUTH   │ CONTROLLER   │
├────┼──────────────┼──────────────────────────────────┼────────┼──────────────┤
│ 1  │ POST         │ /api/v1/users/register           │ No     │ register     │
│ 2  │ POST         │ /api/v1/users/login              │ No     │ login        │
│ 3  │ POST         │ /api/v1/users/logout             │ Yes    │ logout       │
│ 4  │ POST         │ /api/v1/users/refresh-token      │ No     │ refresh      │
│ 5  │ GET          │ /api/v1/users/me                 │ Yes    │ getCurrentUser
│ 6  │ POST         │ /api/v1/vaults                   │ Yes    │ createVault  │
│ 7  │ GET          │ /api/v1/vaults                   │ Yes    │ getUserVaults│
│ 8  │ GET          │ /api/v1/vaults/:vaultId          │ Yes    │ getVaultById │
│ 9  │ PUT          │ /api/v1/vaults/:vaultId          │ Yes    │ updateVault  │
│ 10 │ DELETE       │ /api/v1/vaults/:vaultId          │ Yes    │ deleteVault  │
│ 11 │ POST         │ /api/v1/vaults/:vaultId/members  │ Yes    │ addVaultMember
│ 12 │ GET          │ /api/v1/vaults/:vaultId/members  │ Yes    │ getVaultMembers
│ 13 │ PUT          │ /api/v1/vaults/.../members/:id   │ Yes    │ updateRole   │
│ 14 │ DELETE       │ /api/v1/vaults/.../members/:id   │ Yes    │ removeMember │
│ 15 │ POST         │ /api/v1/vaults/:vaultId/resources│ Yes    │ createResource
│ 16 │ GET          │ /api/v1/vaults/:vaultId/resources│ Yes    │ getResources │
│ 17 │ GET          │ /api/v1/resources/:resourceId    │ Yes    │ getResourceById
│ 18 │ PUT          │ /api/v1/resources/:resourceId    │ Yes    │ updateResource
│ 19 │ DELETE       │ /api/v1/resources/:resourceId    │ Yes    │ deleteResource
│ 20 │ POST         │ /api/v1/resources/:id/annotations│ Yes    │ createAnnotation
│ 21 │ GET          │ /api/v1/resources/:id/annotations│ Yes    │ getAnnotations
│ 22 │ GET          │ /api/v1/annotations/:annotationId│ Yes    │ getAnnotationById
│ 23 │ PUT          │ /api/v1/annotations/:annotationId│ Yes    │ updateAnnotation
│ 24 │ DELETE       │ /api/v1/annotations/:annotationId│ Yes    │ deleteAnnotation
└────┴──────────────┴──────────────────────────────────┴────────┴──────────────┘
```

---

## 🔐 Authorization Matrix

Who can do what:

```
VAULT OPERATIONS:
- Create Vault         → Any logged-in user
- View Vault           → Owner, Contributor, Viewer
- Update Vault         → Owner only
- Delete Vault         → Owner only
- Add Member           → Owner only
- Change Role          → Owner only
- Remove Member        → Owner only

RESOURCE OPERATIONS:
- Create Resource      → Owner, Contributor
- View Resource        → Owner, Contributor, Viewer
- Update Resource      → Creator or Owner only
- Delete Resource      → Creator or Owner only

ANNOTATION OPERATIONS:
- Create Annotation    → Owner, Contributor, Viewer (all can annotate)
- View Annotation      → Owner, Contributor, Viewer (all can see)
- Update Annotation    → Creator only
- Delete Annotation    → Creator only
```

---

## 📝 Implementation Order Recommendation

**Phase 1: User Management (Endpoints 1-5)**
- Setup auth flows
- Test login/logout/token refresh

**Phase 2: Vault Management (Endpoints 6-10)**
- CRUD operations on vaults
- Verify ownership checks

**Phase 3: Collaboration (Endpoints 11-14)**
- Share vaults with users
- Test role-based access

**Phase 4: Resources (Endpoints 15-19)**
- Add/edit/delete links
- Test resource access control

**Phase 5: Annotations (Endpoints 20-24)**
- Notes, comments, files
- Test annotation cascading

**Phase 6: Optional (Endpoints 25-26)**
- Search functionality
- Activity tracking

---

## 🧪 Testing Strategy

For each endpoint:
1. **Happy Path:** Valid request, correct response
2. **Auth Check:** Request without token, should get 401
3. **Permission Check:** User without access, should get 403
4. **Validation:** Invalid input, should get 400
5. **Not Found:** Resource doesn't exist, should get 404

---

## 📦 Request/Response Format

### **All endpoints follow this pattern:**

**Success Response (200, 201):**
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Resource fetched successfully",
  "success": true
}
```

**Error Response (400, 401, 403, 404, 500):**
```json
{
  "statusCode": 400,
  "message": "Error description",
  "success": false,
  "errors": [...]
}
```

---

## 💡 Important Notes

1. **Token Storage:** Access token in response body, refresh token in httpOnly cookie
2. **Pagination:** Implement offset-based pagination (limit, page)
3. **Timestamps:** All records should have createdAt and updatedAt (except Auth endpoints)
4. **Soft Delete (Optional):** Consider adding isDeleted flag for audit trails
5. **Rate Limiting:** Implement rate limiting on auth endpoints
6. **Validation:** Validate all inputs server-side before DB operations
7. **Cascading:** When vault deleted, cascade delete all resources and annotations
8. **File Upload:** Multer for file uploads, store path in DB, actual files in Cloudinary/storage
9. **Query Population:** JOIN or populate related data (creator names, member details)
10. **Error Handling:** Consistent error messages across all endpoints

