const express = require('express');
const jwt = require('jsonwebtoken'); // 1. Import JSON Web Token package
const app = express();

app.use(express.json());

const PORT = 3000;
const SECRET_KEY = "my_custom_jwt_secret_key"; // Signature secret key used to sign tokens

// Mock Student Database
let students = [
    { id: 1, name: "Amit Kumar", email: "amit@gmail.com", age: 20 },
    { id: 2, name: "Rahul Sharma", email: "rahul@gmail.com", age: 21 }
];

/* -----------------------------------------------------------------
   JWT AUTHORIZATION MIDDLEWARE
   - Intercepts incoming API calls to verify authorization headers.
   ----------------------------------------------------------------- */
const authenticateToken = (req, res, next) => {
    // Read the 'Authorization' header from incoming request
    const authHeader = req.headers['authorization'];

    // Header format is expected to be: "Bearer <JWT_TOKEN>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied: Missing Authorization Token."
        });
    }

    // Verify token validity against the secret key
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Access Forbidden: Invalid or expired token."
            });
        }

        // Attach verified user payload context to the request object
        req.user = user;
        next(); // Proceed to the protected controller route
    });
};

/* -----------------------------------------------------------------
   PUBLIC ROUTE: LOGIN (Generates and returns JWT)
   ----------------------------------------------------------------- */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Simple static credentials check
    if (username === 'admin' && password === 'password123') {
        const userPayload = { username: username, role: 'admin' };

        // Generate token signed with our SECRET_KEY, expiring in 1 hour
        const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "Authentication successful.",
            token: token
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid credentials."
    });
});

/* -----------------------------------------------------------------
   PROTECTED ROUTES (Secured with 'authenticateToken' middleware)
   ----------------------------------------------------------------- */

// 1. GET ALL STUDENTS (Protected)
app.get('/api/students', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        count: students.length,
        accessedBy: req.user.username, // Log verified user payload attribute
        data: students
    });
});

// 2. CREATE STUDENT (Protected)
app.post('/api/students', authenticateToken, (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.status(400).json({ success: false, message: "Provide name, email, and age." });
    }

    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent = { id: newId, name, email, age: parseInt(age) };
    students.push(newStudent);

    res.status(201).json({
        success: true,
        message: "Student record created successfully.",
        data: newStudent
    });
});

// 3. DELETE STUDENT (Protected)
app.delete('/api/students/:id', authenticateToken, (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({ success: false, message: "Student record not found." });
    }

    const deleted = students.splice(studentIndex, 1);
    res.status(200).json({
        success: true,
        message: "Student record deleted successfully.",
        data: deleted[0]
    });
});

// Start API Server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Secured JWT Server running on port ${PORT}`);
    console.log(` Login Endpoint: http://localhost:${PORT}/api/login`);
    console.log(` Protected API:  http://localhost:${PORT}/api/students`);
    console.log(`=================================================`);
});