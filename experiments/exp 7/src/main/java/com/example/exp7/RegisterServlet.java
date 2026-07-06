package com.example.exp7;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

// Using jakarta servlet imports for Tomcat 10 compatibility
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Tomcat 10 Controller mapping using Jakarta WebServlet Annotation
 */
@WebServlet(name = "RegisterServlet", value = "/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Database configurations (MySQL setup from Exp 5)
    private static final String DB_URL = "jdbc:mysql://localhost:3306/college";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "123456";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Step 1: Set response content parameters
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // Step 2: Read parameter fields sent from the HTML View
        String name = request.getParameter("studentName");
        String email = request.getParameter("studentEmail");
        String ageStr = request.getParameter("studentAge");
        int age = Integer.parseInt(ageStr);

        Connection conn = null;
        PreparedStatement pstmt = null;
        boolean isSuccess = false;

        try {
            // Step 3: Register the modern MySQL JDBC driver class
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);

            // Step 4: Prepare the parameterized SQL query for inserts
            String query = "INSERT INTO student (name, email, age) VALUES (?, ?, ?)";
            pstmt = conn.prepareStatement(query);
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setInt(3, age);

            int result = pstmt.executeUpdate();
            if (result > 0) {
                isSuccess = true;
            }

        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            out.println("<h3 style='color:red;'>System Database Error: " + e.getMessage() + "</h3>");
        } finally {
            // Clean up resources cleanly to avoid connection pool exhaustion
            try {
                if (pstmt != null) pstmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // Step 5: Generate the responsive Bootstrap response view
        out.println("<html>");
        out.println("<head><title>Registration Status</title>");
        out.println("<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>");
        out.println("</head>");
        out.println("<body class='bg-light d-flex align-items-center justify-content-center' style='height:100vh;'>");
        out.println("<div class='card p-4 text-center shadow-sm' style='max-width:400px;'>");

        if (isSuccess) {
            out.println("<h3 class='text-success mb-3'>Success!</h3>");
            out.println("<p class='text-muted'>Student record was stored in the database.</p>");
            out.println("<p><strong>Name:</strong> " + name + "<br><strong>Email:</strong> " + email + "<br><strong>Age:</strong> " + age + "</p>");
        } else {
            out.println("<h3 class='text-danger mb-3'>Registration Failed</h3>");
            out.println("<p class='text-muted'>Unable to register student at this time.</p>");
        }

        out.println("<a href='register.html' class='btn btn-outline-primary mt-3'>Register Another Student</a>");
        out.println("</div>");
        out.println("</body>");
        out.println("</html>");

        out.close();
    }
}