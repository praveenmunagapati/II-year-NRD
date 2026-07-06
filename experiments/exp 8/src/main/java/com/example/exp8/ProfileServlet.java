package com.example.exp8;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet(name = "ProfileServlet", value = "/ProfileServlet")
public class ProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        /* -------------------------------------------------------------
           READING MECHANISM 1: HTTP SESSION
           ------------------------------------------------------------- */
        HttpSession session = request.getSession(false); // Do not create a new session
        String loggedUser = null;
        if (session != null) {
            loggedUser = (String) session.getAttribute("userSessionAttr");
        }

        /* -------------------------------------------------------------
           READING MECHANISM 2: COOKIES
           ------------------------------------------------------------- */
        String activeTheme = "light"; // Default theme
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("userThemeCookie")) {
                    activeTheme = cookie.getValue();
                    break;
                }
            }
        }

        // Apply theme color based on preference retrieved from Cookie
        String bodyBg = activeTheme.equals("dark") ? "#1a252f" : "#f4f6f9";
        String cardBg = activeTheme.equals("dark") ? "#2c3e50" : "#ffffff";
        String textColor = activeTheme.equals("dark") ? "#ffffff" : "#333333";

        // Output HTML response reflecting session states
        out.println("<html>");
        out.println("<head><title>User Dashboard Profile</title>");
        out.println("<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>");
        out.println("</head>");
        out.println("<body style='background-color:" + bodyBg + "; height:100vh;' class='d-flex align-items-center justify-content-center'>");

        out.println("<div class='card p-4 text-center shadow-sm' style='max-width:450px; background-color:" + cardBg + "; color:" + textColor + ";'>");

        if (loggedUser != null) {
            out.println("<h3 class='mb-3'>Dashboard Profile</h3>");
            out.println("<p class='fs-5'>Welcome back, <strong>" + loggedUser + "</strong>!</p>");
            out.println("<hr style='border-color:" + textColor + ";'>");

            // Detailed status print out of tracked session attributes
            out.println("<div class='text-start my-3' style='font-size:0.9rem;'>");
            out.println("<p><strong>HTTP Session ID:</strong> <code class='text-info'>" + session.getId() + "</code></p>");
            out.println("<p><strong>Server-side tracked User:</strong> " + loggedUser + " (From HTTP Session)</p>");
            out.println("<p><strong>Browser preference saved:</strong> " + activeTheme + " mode (From Cookie)</p>");
            out.println("</div>");
        } else {
            out.println("<h3 class='text-danger'>Access Denied</h3>");
            out.println("<p>No active user session was found. Please log in first.</p>");
        }

        out.println("<a href='session_demo.html' class='btn btn-primary mt-3'>Sign Out / Reset Demo</a>");
        out.println("</div>");

        out.println("</body>");
        out.println("</html>");

        out.close();
    }
}