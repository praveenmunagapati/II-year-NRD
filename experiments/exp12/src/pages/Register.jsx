import React, { useState } from 'react';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Successfully Registered Student: ${name}`);
    };

    return (
        <div className="row">
            <div className="col-md-5 mx-auto">
                <div className="card p-4 shadow-sm bg-white mt-4">
                    <h3 className="text-center mb-4 text-success">Student Registration</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Enrolled Course</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., B.Tech CSE (AI & ML)"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;