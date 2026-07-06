// 1. Import built-in Node.js core modules
const http = require('http');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

// 2. Initialize a custom Event Emitter instance
class RequestEmitter extends EventEmitter {}
const requestEmitter = new RequestEmitter();

// Define a port number for the web server
const PORT = 3000;

// 3. Register a listener for the custom 'pageVisited' event
requestEmitter.on('pageVisited', (url, time) => {
    console.log(`[EVENT EMITTED] Custom Event triggered! Path: "${url}" accessed at ${time}`);
});

/* -----------------------------------------------------------------
   CREATE CUSTOM HTTP SERVER
   ----------------------------------------------------------------- */
const server = http.createServer((req, res) => {

    // Ignore requests for favicon
    if (req.url === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Trigger the custom event using the Event Emitter
    const timestamp = new Date().toLocaleTimeString();
    requestEmitter.emit('pageVisited', req.url, timestamp);

    // Set the response header to serve HTML content
    res.writeHead(200, { 'Content-Type': 'text/html' });

    /* -------------------------------------------------------------
       EXPLORING THE 'OS' MODULE
       ------------------------------------------------------------- */
    const osPlatform = os.platform();               // Operating System platform (win32, linux, etc.)
    const osArch = os.arch();                       // CPU Architecture (x64, arm, etc.)
    const totalMemoryGB = (os.totalmem() / (1024 ** 3)).toFixed(2); // Total RAM in Gigabytes
    const freeMemoryGB = (os.freemem() / (1024 ** 3)).toFixed(2);   // Free RAM in Gigabytes
    const systemUptimeHours = (os.uptime() / 3600).toFixed(2);      // System uptime in hours

    /* -------------------------------------------------------------
       EXPLORING THE 'PATH' MODULE
       ------------------------------------------------------------- */
    const currentFilePath = __filename;             // Global variable holding current absolute file path
    const fileBaseName = path.basename(currentFilePath); // Resolves filename (e.g., 'server.js')
    const fileExtension = path.extname(currentFilePath); // Resolves file extension (e.g., '.js')
    const joinedPathExample = path.join('/usr', 'local', 'bin', fileBaseName); // Cross-platform folder path resolver

    // Render HTML presentation output to client
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Node.js Core Modules Demo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
            <div class="container my-5">
                <div class="card p-4 shadow-sm bg-white">
                    <h2 class="text-center text-success mb-4">Node.js Core Modules Dashboard</h2>
                    <p class="text-muted text-center">HTTP Server is running successfully on port <strong>${PORT}</strong>.</p>
                    
                    <div class="row mt-4">
                        <!-- OS Module Data Display -->
                        <div class="col-md-6 mb-3">
                            <div class="card h-100 border-success">
                                <div class="card-header bg-success text-white">OS Module (System Info)</div>
                                <div class="card-body">
                                    <p><strong>Platform:</strong> ${osPlatform}</p>
                                    <p><strong>Architecture:</strong> ${osArch}</p>
                                    <p><strong>Total Memory:</strong> ${totalMemoryGB} GB</p>
                                    <p><strong>Free Memory:</strong> ${freeMemoryGB} GB</p>
                                    <p><strong>System Uptime:</strong> ${systemUptimeHours} hours</p>
                                </div>
                            </div>
                        </div>

                        <!-- Path Module Data Display -->
                        <div class="col-md-6 mb-3">
                            <div class="card h-100 border-primary">
                                <div class="card-header bg-primary text-white">Path Module (File Path Manipulation)</div>
                                <div class="card-body">
                                    <p><strong>Current File Name:</strong> <code>${fileBaseName}</code></p>
                                    <p><strong>Extension Name:</strong> <code>${fileExtension}</code></p>
                                    <p><strong>Absolute Directory Path:</strong> <br><small class="text-muted">${path.dirname(currentFilePath)}</small></p>
                                    <p><strong>Joined Path Example:</strong> <br><small class="text-muted">${joinedPathExample}</small></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Events Module Logging Notice -->
                    <div class="alert alert-warning mt-3 mb-0" role="alert">
                        <strong>Events Module Status:</strong> A custom <code>'pageVisited'</code> event was just emitted on the server console at <strong>${timestamp}</strong>. Check your command terminal to view console outputs.
                    </div>

                </div>
            </div>
        </body>
        </html>
    `);

    res.end(); // End the response process
});

// Start listening for incoming connections
server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Custom HTTP Server listening on port ${PORT}`);
    console.log(` Access URL: http://localhost:${PORT}`);
    console.log(`=================================================`);
});