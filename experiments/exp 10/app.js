// 1. Import Express
const express = require('express');
const app = express();

// Middleware: Instructs Express to parse incoming JSON payloads inside request bodies
app.use(express.json());

const PORT = 3000;

// 2. In-Memory Student Data Store (Mock Database)
let students = [
    { id: 1, name: "Amit Kumar", email: "amit@gmail.com", age: 20 },
    { id: 2, name: "Rahul Sharma", email: "rahul@gmail.com", age: 21 },
    { id: 3, name: "Priya Patel", email: "priya@gmail.com", age: 22 }
];

/* -----------------------------------------------------------------
   REST API ENDPOINTS (CRUD OPERATIONS)
   ----------------------------------------------------------------- */

// 1. READ ALL (GET - Retrieve all students)
app.get('/api/students', (req, res) => {
    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
});

// 2. READ ONE (GET - Retrieve a specific student by ID)
app.get('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: `Student with ID ${studentId} not found.`
        });
    }

    res.status(200).json({
        success: true,
        data: student
    });
});

// 3. CREATE (POST - Create a new student record)
app.post('/api/students', (req, res) => {
    const { name, email, age } = req.body;

    // Simple validation
    if (!name || !email || !age) {
        return res.status(400).json({
            success: false,
            message: "Validation Error: Please provide name, email, and age."
        });
    }

    // Generate a unique ID
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

    const newStudent = {
        id: newId,
        name: name,
        email: email,
        age: parseInt(age)
    };

    students.push(newStudent);

    res.status(201).json({
        success: true,
        message: "Student record created successfully.",
        data: newStudent
    });
});

// 4. UPDATE (PUT - Modify an existing student record)
app.put('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Student with ID ${studentId} not found.`
        });
    }

    const { name, email, age } = req.body;

    // Update only the fields provided in the request body
    if (name) students[studentIndex].name = name;
    if (email) students[studentIndex].email = email;
    if (age) students[studentIndex].age = parseInt(age);

    res.status(200).json({
        success: true,
        message: "Student record updated successfully.",
        data: students[studentIndex]
    });
});

// 5. DELETE (DELETE - Remove a specific student record)
app.delete('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Student with ID ${studentId} not found.`
        });
    }

    // Remove student from array
    const deletedStudent = students.splice(studentIndex, 1);

    res.status(200).json({
        success: true,
        message: "Student record deleted successfully.",
        data: deletedStudent[0]
    });
});

// Start listening for requests
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Student REST API Server running on port ${PORT}`);
    console.log(` Base API URL: http://localhost:${PORT}/api/students`);
    console.log(`=================================================`);
});