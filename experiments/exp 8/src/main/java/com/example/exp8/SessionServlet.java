package com.example.exp8;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet(name = "SessionServlet", value = "/SessionServlet")
public class SessionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Read input parameters
        String username = request.getParameter("username");
        String theme = request.getParameter("theme");

        /* -------------------------------------------------------------
           MECHANISM 1: HTTP SESSION (Server-Side Storage)
           - Creates a new session if one does not exist.
           - Binds 'username' attribute to this session on the server.
           ------------------------------------------------------------- */
        HttpSession session = request.getSession(true);
        session.setAttribute("userSessionAttr", username);

        /* -------------------------------------------------------------
           MECHANISM 2: COOKIES (Client-Side Storage)
           - Creates a cookie mapping key 'userThemeCookie' to select value.
           - Configures max age duration to 1 day (86400 seconds).
           - Adds cookie to response object to save on client's browser.
           ------------------------------------------------------------- */
        Cookie themeCookie = new Cookie("userThemeCookie", theme);
        themeCookie.setMaxAge(60 * 60 * 24); // Expiry time: 24 hours
        response.addCookie(themeCookie);

        // Redirect to ProfileServlet to verify persistent states
        response.sendRedirect("ProfileServlet");
    }
}