import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

public class StudentCrudApp {

    // Database Connection Parameters
    private static final String DB_URL = "jdbc:mysql://localhost:3306/college";
    private static final String DB_USER = "root";       // Change to your MySQL username
    private static final String DB_PASSWORD = "123456"; // Change to your MySQL password

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Connection conn = null;

        try {
            // 1. Register the JDBC driver and establish database connection
            System.out.println("Connecting to database...");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            System.out.println("Connection successful!");

            while (true) {
                // Display Interaction Menu to User
                System.out.println("\n--- STUDENT CRUD OPERATIONS ---");
                System.out.println("1. Create (Insert Student)");
                System.out.println("2. Read (View All Students)");
                System.out.println("3. Update (Modify Student Email)");
                System.out.println("4. Delete (Remove Student)");
                System.out.println("5. Exit");
                System.out.print("Enter your choice: ");

                int choice = scanner.nextInt();
                scanner.nextLine(); // Clear the buffer input newline

                switch (choice) {
                    case 1:
                        createStudent(conn, scanner);
                        break;
                    case 2:
                        readStudents(conn);
                        break;
                    case 3:
                        updateStudent(conn, scanner);
                        break;
                    case 4:
                        deleteStudent(conn, scanner);
                        break;
                    case 5:
                        System.out.println("Exiting Application. Database connection closed.");
                        return;
                    default:
                        System.out.println("Invalid selection. Try again.");
                }
            }

        } catch (SQLException e) {
            System.err.println("Database Error: " + e.getMessage());
        } finally {
            // Clean up and close connection scanner resources safely
            try {
                if (conn != null) conn.close();
                scanner.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /* -----------------------------------------------------------------
       1. CREATE (Insert Data)
       Using PreparedStatement prevents SQL injection attacks
       ----------------------------------------------------------------- */
    private static void createStudent(Connection conn, Scanner scanner) throws SQLException {
        String sql = "INSERT INTO student (name, email, age) VALUES (?, ?, ?)";

        System.out.print("Enter Student Name: ");
        String name = scanner.nextLine();
        System.out.print("Enter Student Email: ");
        String email = scanner.nextLine();
        System.out.print("Enter Student Age: ");
        int age = scanner.nextInt();

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setInt(3, age);

            int rowsInserted = stmt.executeUpdate();
            if (rowsInserted > 0) {
                System.out.println("Record created successfully!");
            }
        }
    }

    /* -----------------------------------------------------------------
       2. READ (Select / View Data)
       Uses Statement and ResultSet to iterate over rows in database
       ----------------------------------------------------------------- */
    private static void readStudents(Connection conn) throws SQLException {
        String sql = "SELECT * FROM student";

        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            System.out.println("\n-----------------------------------------------------");
            System.out.printf("%-5s | %-20s | %-20s | %-5s\n", "ID", "Name", "Email", "Age");
            System.out.println("-----------------------------------------------------");

            boolean recordsFound = false;
            while (rs.next()) {
                recordsFound = true;
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String email = rs.getString("email");
                int age = rs.getInt("age");

                System.out.printf("%-5d | %-20s | %-20s | %-5d\n", id, name, email, age);
            }

            if (!recordsFound) {
                System.out.println("No records found in the table.");
            }
            System.out.println("-----------------------------------------------------");
        }
    }

    /* -----------------------------------------------------------------
       3. UPDATE (Modify Data)
       Using SQL UPDATE statements targeting a specific record ID
       ----------------------------------------------------------------- */
    private static void updateStudent(Connection conn, Scanner scanner) throws SQLException {
        String sql = "UPDATE student SET email = ? WHERE id = ?";

        System.out.print("Enter Student ID to update: ");
        int id = scanner.nextInt();
        scanner.nextLine(); // Clear the input buffer
        System.out.print("Enter New Email: ");
        String newEmail = scanner.nextLine();

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, newEmail);
            stmt.setInt(2, id);

            int rowsUpdated = stmt.executeUpdate();
            if (rowsUpdated > 0) {
                System.out.println("Record updated successfully!");
            } else {
                System.out.println("Record update failed. Student ID not found.");
            }
        }
    }

    /* -----------------------------------------------------------------
       4. DELETE (Remove Data)
       Using SQL DELETE statement to drop student records
       ----------------------------------------------------------------- */
    private static void deleteStudent(Connection conn, Scanner scanner) throws SQLException {
        String sql = "DELETE FROM student WHERE id = ?";

        System.out.print("Enter Student ID to delete: ");
        int id = scanner.nextInt();

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);

            int rowsDeleted = stmt.executeUpdate();
            if (rowsDeleted > 0) {
                System.out.println("Record deleted successfully!");
            } else {
                System.out.println("Record deletion failed. Student ID not found.");
            }
        }
    }
}