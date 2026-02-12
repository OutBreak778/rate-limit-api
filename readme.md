📦 Tech Stack
json
```json
{
  "dependencies": {
    "express": "^4.21.2",        // Web framework
    "mongoose": "^8.10.0",       // MongoDB ODM
    "jsonwebtoken": "^9.0.2",    // JWT auth
    "bcrypt": "^5.1.1",          // Password hashing
    "dotenv": "^16.4.7",         // Env variables
    "cors": "^2.8.6",            // CORS support
    "cookie-parser": "^1.4.7",   // Cookie parsing
    "nodemon": "^3.1.9"          // Dev hot reload
  }
}
```
⚡ One-Command Setup
bash
# Clone & install
git clone https://github.com/yourusername/rate-limit-api.git
cd taskflow-api
npm install
cp .env.example .env

# Run
npm run dev
That's it. Server runs on http://localhost:5000

```json
🔐 Environment Variables
env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
SECRET_KEY=your_super_secret_key
JWT_EXPIRY=7d
```

### 📁 Structure (6 files only)
```json
rate-limit-api/
├── server.js                 # Entry point
├── .env                     # Config
├── src/
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Task.js         # Task schema
│   ├── controllers/
│   │   ├── auth.js         # Login/Register
│   │   └── task.js         # CRUD
│   ├── routes/
│   │   ├── auth.js
│   │   └── task.js
│   └── middleware/
│       └── auth.js         # JWT verification
└── package.json
```

🌐 API Reference
Auth POST /api/v1/auth
Endpoint	Body	Response
/sign-up	{name, email, password, role?}	201: {token, user}
/sign-in	{email, password}	200: {token, user}
/sign-out	-	200: {success}
Tasks GET /api/v1/task 🔒
Method	Endpoint	Body	Access	Response
POST	/	{title, description?, priority?}	User/Admin	201: Task
GET	/	?status&priority	User: Own, Admin: All	200: Task[]
GET	/:id	-	Own/Any(Admin)	200: Task
PUT	/:id	{status, title, ...}	Own/Any(Admin)	200: Task
DELETE	/:id	-	Own/Any(Admin)	200: {success}
GET	/stats/summary	-	Own/All(Admin)	200: {byStatus, byPriority, total}


📦 Sample Requests
Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'
```
Create Task (with token)
```bash
curl -X POST http://localhost:5000/api/v1/task \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","priority":"high"}'
  ```
Response Format
```json
{
  "success": true,
  "data": { ... },
  "count": 5,        // For GET /task
  "message": "..."   // For DELETE
}
```
🛡️ Auth Flow
text
1. POST /sign-in → { token }
2. Header: Authorization: Bearer <token>
3. Middleware verifies → req.user = { userId, role }
4. Controllers check: 
   - User: can only access resources with user=req.user.userId
   - Admin: full access
✅ Testing with Postman
Collection Variables:

```json
{
  "baseUrl": "http://localhost:5000/api/v1",
  "token": "{{signInResponse.token}}",
  "taskId": "{{createTaskResponse._id}}"
}
```
Test Flow:

text
1. Sign Up → Get token
2. Create Task → Get taskId
3. Get Tasks → List all
4. Update Task → Change status
5. Delete Task → Remove
6. Sign Out → Logout
🚦 Error Handling
json
```json
{
  "success": false,
  "message": "Task not found",
  "statusCode": 404
}
```
Code	Description
400	Bad Request / Validation
401	Unauthorized / Invalid token
403	Forbidden (wrong user)
404	Resource not found
409	Duplicate email
500	Server error

📊 Database Indexes (Performance)
🚀 Deploy in 30 Seconds
Render:

bash
1. Push to GitHub
2. New Web Service → Connect repo
3. Build: `npm install`
4. Start: `npm start`
5. Add env vars
Railway:

bash
1. `railway login`
2. `railway init`
3. `railway up`
 
🔒 Security Features
✅ Passwords hashed with bcrypt (salt=10)

✅ JWT tokens (7d expiry)

✅ Role-based access (user/admin)

✅ Input validation (mongoose)

✅ token storage (client keeps it)

✅ HTTP-only cookies optional

✅ CORS whitelist

✅ Rate limiting ready

