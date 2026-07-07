import React from 'react';

function About() {
    return (
        <div className="row">
            <div className="col-md-8 mx-auto mt-4">
                <div className="card p-4 shadow-sm bg-white">
                    <h3 className="text-dark mb-3">About JNTU Student Portal</h3>
                    <p className="lead">This portal is designed to manage academic records, student registrations, and administrative tasks within the department.</p>
                    <hr />
                    <h5>Department Highlights:</h5>
                    <ul>
                        <li>B.Tech II Year I Sem. Syllabus Compliance</li>
                        <li>Advanced Full-Stack Architectures (Node JS, React JS)</li>
                        <li>Robust client and server-side tracking mechanisms</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default About;